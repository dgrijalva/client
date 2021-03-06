// Copyright 2017 Keybase, Inc. All rights reserved. Use of
// this source code is governed by the included BSD license.

// Handlers for team-related gregor messages

package service

import (
	"encoding/json"
	"fmt"
	"strings"
	"sync"

	"golang.org/x/net/context"

	"github.com/keybase/client/go/badges"
	"github.com/keybase/client/go/gregor"
	"github.com/keybase/client/go/libkb"
	"github.com/keybase/client/go/protocol/gregor1"
	"github.com/keybase/client/go/protocol/keybase1"
	"github.com/keybase/client/go/teams"
)

const teamHandlerName = "teamHandler"

type teamHandler struct {
	libkb.Contextified
	badger *badges.Badger

	// Some work that comes from team gregor messages is done in
	// background goroutine: rotateTeam and reset user badge
	// dismissing, for now. Use a mutex to limit this to only one
	// job at time.
	teamHandlerBackgroundJob sync.Mutex
}

var _ libkb.GregorInBandMessageHandler = (*teamHandler)(nil)

func newTeamHandler(g *libkb.GlobalContext, badger *badges.Badger) *teamHandler {
	return &teamHandler{
		Contextified: libkb.NewContextified(g),
		badger:       badger,
	}
}

func (r *teamHandler) Create(ctx context.Context, cli gregor1.IncomingInterface, category string, item gregor.Item) (bool, error) {
	switch category {
	case "team.clkr":
		return true, r.rotateTeam(ctx, cli, item)
	case "team.sbs":
		return true, r.sharingBeforeSignup(ctx, cli, item)
	case "team.openreq":
		return true, r.openTeamAccessRequest(ctx, cli, item)
	case "team.change":
		return true, r.changeTeam(ctx, cli, item, keybase1.TeamChangeSet{})
	case "team.rename":
		return true, r.changeTeam(ctx, cli, item, keybase1.TeamChangeSet{Renamed: true})
	case "team.delete":
		return true, r.deleteTeam(ctx, cli, item)
	case "team.exit":
		return true, r.exitTeam(ctx, cli, item)
	case "team.seitan":
		return true, r.seitanCompletion(ctx, cli, item)
	case "team.member_out_from_reset":
		return true, r.memberOutFromReset(ctx, cli, item)
	case "team.abandoned":
		return true, r.abandonTeam(ctx, cli, item)
	case "team.newly_added_to_team":
		return true, nil
	default:
		if strings.HasPrefix(category, "team.") {
			return false, fmt.Errorf("unknown teamHandler category: %q", category)
		}
		return false, nil
	}
}

func (r *teamHandler) rotateTeam(ctx context.Context, cli gregor1.IncomingInterface, item gregor.Item) error {
	r.G().Log.CDebugf(ctx, "teamHandler: team.clkr received")
	var msg keybase1.TeamCLKRMsg
	if err := json.Unmarshal(item.Body().Bytes(), &msg); err != nil {
		r.G().Log.CDebugf(ctx, "error unmarshaling team.clkr item: %s", err)
		return err
	}
	r.G().Log.CDebugf(ctx, "team.clkr unmarshaled: %+v", msg)

	for _, uv := range msg.ResetUsersUntrusted {
		// We don't use UIDMapper in HandleRotateRequest, but since
		// server just told us that these users have reset, we might
		// as well use that knowledge to refresh cache.

		// Use ClearUIDAtEldestSeqno instead of InformOfEldestSeqno
		// because usually uv.UserEldestSeqno (the "new EldestSeqno")
		// will be 0, because user has just reset and hasn't
		// reprovisioned yet

		r.G().UIDMapper.ClearUIDAtEldestSeqno(ctx, r.G(), uv.Uid, uv.MemberEldestSeqno)
	}

	go func() {
		r.teamHandlerBackgroundJob.Lock()
		defer r.teamHandlerBackgroundJob.Unlock()

		if err := teams.HandleRotateRequest(ctx, r.G(), msg); err != nil {
			r.G().Log.CDebugf(ctx, "HandleRotateRequest failed with error: %s", err)
			return
		}

		r.G().Log.CDebugf(ctx, "dismissing team.clkr item since rotate succeeded")
		r.G().GregorDismisser.DismissItem(ctx, cli, item.Metadata().MsgID())
	}()

	return nil
}

func (r *teamHandler) memberOutFromReset(ctx context.Context, cli gregor1.IncomingInterface, item gregor.Item) error {
	nm := "team.member_out_from_reset"
	r.G().Log.CDebugf(ctx, "teamHandler: %s received", nm)
	var msg keybase1.TeamMemberOutFromReset
	if err := json.Unmarshal(item.Body().Bytes(), &msg); err != nil {
		r.G().Log.CDebugf(ctx, "error unmarshaling %s item: %s", nm, err)
		return err
	}
	r.G().Log.CDebugf(ctx, "%s unmarshaled: %+v", nm, msg)

	if err := r.G().UIDMapper.ClearUIDAtEldestSeqno(ctx, r.G(), msg.ResetUser.Uid, msg.ResetUser.EldestSeqno); err != nil {
		return err
	}

	r.G().Log.CDebugf(ctx, "%s: cleared UIDMap cache for %s%%%d", nm, msg.ResetUser.Uid, msg.ResetUser.EldestSeqno)
	return nil
}

type abandonMsg struct {
	TeamID keybase1.TeamID `json:"team_id"`
}

func (r *teamHandler) abandonTeam(ctx context.Context, cli gregor1.IncomingInterface, item gregor.Item) error {
	nm := "team.abandoned"
	r.G().Log.CDebugf(ctx, "teamHandler.abandonTeam: %s received", nm)
	var msg abandonMsg
	if err := json.Unmarshal(item.Body().Bytes(), &msg); err != nil {
		r.G().Log.CDebugf(ctx, "error unmarshaling %s item: %s", nm, err)
		return err
	}
	r.G().Log.CDebugf(ctx, "teamHandler.abandonTeam: %s unmarshaled: %+v", nm, msg)

	r.G().NotifyRouter.HandleTeamAbandoned(ctx, msg.TeamID)

	r.G().Log.CDebugf(ctx, "teamHandler.abandonTeam: locally dismissing %s", nm)
	if err := r.G().GregorDismisser.LocalDismissItem(ctx, item.Metadata().MsgID()); err != nil {
		r.G().Log.CDebugf(ctx, "teamHandler.abandonTeam: failed to locally dismiss msg %v", item.Metadata().MsgID())
	}

	return nil
}

func (r *teamHandler) findAndDismissResetBadges(ctx context.Context, cli gregor1.IncomingInterface, teamName string) error {
	badges := r.badger.State().FindResetMemberBadges(teamName)
	if len(badges) == 0 {
		return nil
	}
	r.G().Log.CDebugf(ctx, "Checking reset badges: got total %d badges for team %q",
		len(badges), teamName)

	team, err := teams.GetMaybeAdminByStringName(ctx, r.G(), teamName, false /* public */)
	if err != nil {
		return err
	}

	for _, badge := range badges {
		var dismiss bool
		teamUV, notFoundErr := team.UserVersionByUID(ctx, badge.Uid)
		if notFoundErr == nil {
			arg := libkb.NewLoadUserArg(r.G()).WithUID(badge.Uid).WithNetContext(ctx).WithForcePoll(true).WithPublicKeyOptional()
			upak, _, err := r.G().GetUPAKLoader().LoadV2(arg)
			if err != nil {
				r.G().Log.CDebugf(ctx, "Failed to load UPAK for: %s during badge dismissal: %s",
					badge.Uid, err)
				continue
			}
			if upak.Current.EldestSeqno == teamUV.EldestSeqno {
				// We have the latest version of the user in the team.
				r.G().Log.CDebugf(ctx, "Dismissing badge for %s - team has latest user version", badge.Uid)
				dismiss = true
			} else {
				r.G().Log.CDebugf(ctx, "User %s is still reset: current seq: %d team seq: ",
					badge.Uid, upak.Current.EldestSeqno, teamUV.EldestSeqno)
			}
		} else {
			// User has been removed from the team.
			r.G().Log.CDebugf(ctx, "Dismissing badge for %s - member was removed", badge.Uid)
			dismiss = true
		}

		if dismiss {
			err := r.G().GregorDismisser.DismissItem(ctx, cli, badge.Id)
			if err == nil {
				r.G().Log.CDebugf(ctx, "dismissed badge %s for %s!", badge.Id, badge.Uid)
			} else {
				r.G().Log.CDebugf(ctx, "failed to dismiss TeamMemberOutFromReset badge: %s", err)
			}
		}
	}

	return nil
}

func (r *teamHandler) changeTeam(ctx context.Context, cli gregor1.IncomingInterface, item gregor.Item, changes keybase1.TeamChangeSet) error {
	var rows []keybase1.TeamChangeRow
	r.G().Log.CDebugf(ctx, "teamHandler: changeTeam received")
	if err := json.Unmarshal(item.Body().Bytes(), &rows); err != nil {
		r.G().Log.CDebugf(ctx, "error unmarshaling team.(change|rename) item: %s", err)
		return err
	}
	r.G().Log.CDebugf(ctx, "team.(change|rename) unmarshaled: %+v", rows)
	if err := teams.HandleChangeNotification(ctx, r.G(), rows, changes); err != nil {
		return err
	}

	// Locally dismiss this now that we have processed it so we can
	// avoid replaying it over and over.
	if err := r.G().GregorDismisser.LocalDismissItem(ctx, item.Metadata().MsgID()); err != nil {
		r.G().Log.CDebugf(ctx, "failed to local dismiss team change: %s", err)
	}

	// Check the badge state to see if any team reset badges need dismissal.
	go func() {
		r.teamHandlerBackgroundJob.Lock()
		defer r.teamHandlerBackgroundJob.Unlock()

		for _, row := range rows {
			if !row.RemovedResetUsers {
				continue
			}

			if err := r.findAndDismissResetBadges(ctx, cli, row.Name); err != nil {
				r.G().Log.CDebugf(ctx, "Error during dismissing badges for team %q: %s", row.Name, err)
			}
		}
	}()

	return nil
}

func (r *teamHandler) deleteTeam(ctx context.Context, cli gregor1.IncomingInterface, item gregor.Item) error {
	var rows []keybase1.TeamChangeRow
	if err := json.Unmarshal(item.Body().Bytes(), &rows); err != nil {
		r.G().Log.CDebugf(ctx, "error unmarshaling team.(change|rename) item: %s", err)
		return err
	}
	r.G().Log.CDebugf(ctx, "teamHandler: team.delete unmarshaled: %+v", rows)

	err := teams.HandleDeleteNotification(ctx, r.G(), rows)
	if err != nil {
		return err
	}

	return r.G().GregorDismisser.DismissItem(ctx, cli, item.Metadata().MsgID())
}

func (r *teamHandler) exitTeam(ctx context.Context, cli gregor1.IncomingInterface, item gregor.Item) error {
	var rows []keybase1.TeamExitRow
	if err := json.Unmarshal(item.Body().Bytes(), &rows); err != nil {
		r.G().Log.CDebugf(ctx, "error unmarshaling team.exit item: %s", err)
		return err
	}
	r.G().Log.CDebugf(ctx, "teamHandler: team.exit unmarshaled: %+v", rows)
	err := teams.HandleExitNotification(ctx, r.G(), rows)
	if err != nil {
		return err
	}

	r.G().Log.Debug("dismissing team.exit: %v", item.Metadata().MsgID().String())
	return r.G().GregorDismisser.DismissItem(ctx, cli, item.Metadata().MsgID())
}

func (r *teamHandler) sharingBeforeSignup(ctx context.Context, cli gregor1.IncomingInterface, item gregor.Item) error {
	r.G().Log.CDebugf(ctx, "teamHandler: team.sbs received")
	var msg keybase1.TeamSBSMsg
	if err := json.Unmarshal(item.Body().Bytes(), &msg); err != nil {
		r.G().Log.CDebugf(ctx, "error unmarshaling team.sbs item: %s", err)
		return err
	}
	r.G().Log.CDebugf(ctx, "team.sbs unmarshaled: %+v", msg)

	if err := teams.HandleSBSRequest(ctx, r.G(), msg); err != nil {
		return err
	}

	r.G().Log.Debug("dismissing team.sbs item since it succeeded")
	return r.G().GregorDismisser.DismissItem(ctx, cli, item.Metadata().MsgID())
}

func (r *teamHandler) openTeamAccessRequest(ctx context.Context, cli gregor1.IncomingInterface, item gregor.Item) error {
	r.G().Log.CDebugf(ctx, "teamHandler: team.openreq received")
	var msg keybase1.TeamOpenReqMsg
	if err := json.Unmarshal(item.Body().Bytes(), &msg); err != nil {
		r.G().Log.CDebugf(ctx, "error unmarshaling team.openreq item: %s", err)
		return err
	}
	r.G().Log.CDebugf(ctx, "team.openreq unmarshaled: %+v", msg)

	if err := teams.HandleOpenTeamAccessRequest(ctx, r.G(), msg); err != nil {
		return err
	}

	r.G().Log.CDebugf(ctx, "dismissing team.openreq item since it succeeded")
	return r.G().GregorDismisser.DismissItem(ctx, cli, item.Metadata().MsgID())
}

func (r *teamHandler) seitanCompletion(ctx context.Context, cli gregor1.IncomingInterface, item gregor.Item) error {
	r.G().Log.CDebugf(ctx, "teamHandler: team.seitan received")
	var msg keybase1.TeamSeitanMsg
	if err := json.Unmarshal(item.Body().Bytes(), &msg); err != nil {
		r.G().Log.CDebugf(ctx, "error unmarshaling team.seitan item: %s", err)
		return err
	}
	r.G().Log.CDebugf(ctx, "team.seitan unmarshaled: %+v", msg)

	if err := teams.HandleTeamSeitan(ctx, r.G(), msg); err != nil {
		return err
	}

	r.G().Log.CDebugf(ctx, "dismissing team.seitan item since it succeeded")
	return r.G().GregorDismisser.DismissItem(ctx, cli, item.Metadata().MsgID())
}

func (r *teamHandler) Dismiss(ctx context.Context, cli gregor1.IncomingInterface, category string, item gregor.Item) (bool, error) {
	return false, nil
}

func (r *teamHandler) IsAlive() bool {
	return true
}

func (r *teamHandler) Name() string {
	return teamHandlerName
}
