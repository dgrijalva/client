// @flow
/* eslint-disable */

// This file is auto-generated by client/protocol/Makefile.
// Not enabled: calls need to be turned on in enabled-calls.json
import * as Keybase1 from './rpc-gen'
import engine, {EngineChannel} from '../../engine'
import engineSaga from '../../engine/saga'
import * as Saga from '../../util/saga'
import type {Action} from '../../constants/types/flux'
import type {Boolean, Bool, Bytes, Double, Int, Int64, Long, String, Uint, Uint64, WaitingHandlerType, RPCErrorHandler, RPCError} from '../../engine/types'
import type {TypedState} from '../../constants/reducer'

export const bundleAccountMode = {
  none: 0,
  user: 1,
}

export const bundleBundleVersion = {
  v1: 1,
}

export const commonPaymentStrategy = {
  none: 0,
  direct: 1,
  relay: 2,
}

export const commonRelayDirection = {
  claim: 0,
  yank: 1,
}

export const commonTransactionStatus = {
  none: 0,
  pending: 1,
  success: 2,
  errorTransient: 3,
  errorPermanent: 4,
}

export const localBalanceDelta = {
  none: 0,
  increase: 1,
  decrease: 2,
}

export const localParticipantType = {
  none: 0,
  keybase: 1,
  stellar: 2,
  sbs: 3,
}

export const localPaymentStatus = {
  none: 0,
  pending: 1,
  claimable: 2,
  completed: 3,
  error: 4,
  unknown: 5,
}

export const remotePaymentSummaryType = {
  none: 0,
  stellar: 1,
  direct: 2,
  relay: 3,
}
export const localGetAccountAssetsLocalRpcPromise = (params: LocalGetAccountAssetsLocalRpcParam, waitingKey?: string): Promise<LocalGetAccountAssetsLocalResult> => new Promise((resolve, reject) => engine()._rpcOutgoing({method: 'stellar.1.local.getAccountAssetsLocal', params, callback: (error: RPCError, result: LocalGetAccountAssetsLocalResult) => (error ? reject(error) : resolve(result)), waitingKey}))
export const localGetPaymentsLocalRpcPromise = (params: LocalGetPaymentsLocalRpcParam, waitingKey?: string): Promise<LocalGetPaymentsLocalResult> => new Promise((resolve, reject) => engine()._rpcOutgoing({method: 'stellar.1.local.getPaymentsLocal', params, callback: (error: RPCError, result: LocalGetPaymentsLocalResult) => (error ? reject(error) : resolve(result)), waitingKey}))
export const localGetWalletAccountsLocalRpcPromise = (params: LocalGetWalletAccountsLocalRpcParam, waitingKey?: string): Promise<LocalGetWalletAccountsLocalResult> => new Promise((resolve, reject) => engine()._rpcOutgoing({method: 'stellar.1.local.getWalletAccountsLocal', params, callback: (error: RPCError, result: LocalGetWalletAccountsLocalResult) => (error ? reject(error) : resolve(result)), waitingKey}))
export const localLinkNewWalletAccountLocalRpcPromise = (params: LocalLinkNewWalletAccountLocalRpcParam, waitingKey?: string): Promise<LocalLinkNewWalletAccountLocalResult> => new Promise((resolve, reject) => engine()._rpcOutgoing({method: 'stellar.1.local.linkNewWalletAccountLocal', params, callback: (error: RPCError, result: LocalLinkNewWalletAccountLocalResult) => (error ? reject(error) : resolve(result)), waitingKey}))
export const localValidateAccountNameLocalRpcPromise = (params: LocalValidateAccountNameLocalRpcParam, waitingKey?: string): Promise<void> => new Promise((resolve, reject) => engine()._rpcOutgoing({method: 'stellar.1.local.validateAccountNameLocal', params, callback: (error: RPCError, result: void) => (error ? reject(error) : resolve()), waitingKey}))
export const localValidateSecretKeyLocalRpcPromise = (params: LocalValidateSecretKeyLocalRpcParam, waitingKey?: string): Promise<void> => new Promise((resolve, reject) => engine()._rpcOutgoing({method: 'stellar.1.local.validateSecretKeyLocal', params, callback: (error: RPCError, result: void) => (error ? reject(error) : resolve()), waitingKey}))
export type AccountAssetLocal = $ReadOnly<{name: String, assetCode: String, issuerName: String, issuerAccountID: String, balanceTotal: String, balanceAvailableToSend: String, worthCurrency: String, worth: String, availableToSendWorth: String}>
export type AccountDetails = $ReadOnly<{accountID: AccountID, seqno: String, balances?: ?Array<Balance>, subentryCount: Int, available: String}>
export type AccountID = String
export type AccountMode =
  | 0 // NONE_0
  | 1 // USER_1

export type Asset = $ReadOnly<{type: String, code: String, issuer: String}>
export type AutoClaim = $ReadOnly<{kbTxID: KeybaseTransactionID}>
export type Balance = $ReadOnly<{asset: Asset, amount: String, limit: String}>
export type BalanceDelta =
  | 0 // NONE_0
  | 1 // INCREASE_1
  | 2 // DECREASE_2

export type BuildPaymentResLocal = $ReadOnly<{readyToSend: Boolean, toErrMsg: String, amountErrMsg: String, secretNoteErrMsg: String, publicMemoErrMsg: String, worthDescription: String, worthInfo: String, banners?: ?Array<SendBannerLocal>}>
export type Bundle = $ReadOnly<{revision: BundleRevision, prev: Hash, ownHash: Hash, accounts?: ?Array<BundleEntry>}>
export type BundleEntry = $ReadOnly<{accountID: AccountID, mode: AccountMode, isPrimary: Boolean, signers?: ?Array<SecretKey>, name: String}>
export type BundleRevision = Uint64
export type BundleSecretEntry = $ReadOnly<{accountID: AccountID, signers?: ?Array<SecretKey>, name: String}>
export type BundleSecretV1 = $ReadOnly<{visibleHash: Hash, accounts?: ?Array<BundleSecretEntry>}>
export type BundleSecretVersioned = {version: 1, v1: ?BundleSecretV1}
export type BundleVersion = 1 // V1_1

export type BundleVisibleEntry = $ReadOnly<{accountID: AccountID, mode: AccountMode, isPrimary: Boolean}>
export type BundleVisibleV1 = $ReadOnly<{revision: BundleRevision, prev: Hash, accounts?: ?Array<BundleVisibleEntry>}>
export type ClaimSummary = $ReadOnly<{txID: TransactionID, txStatus: TransactionStatus, txErrMsg: String, dir: RelayDirection, toStellar: AccountID, to: Keybase1.UserVersion}>
export type CurrencyLocal = $ReadOnly<{description: String, code: OutsideCurrencyCode, symbol: String, name: String}>
export type CurrencySymbol = $ReadOnly<{symbol: String, ambigious: Boolean, postfix: Boolean}>
export type EncryptedBundle = $ReadOnly<{v: Int, e: Bytes, n: Keybase1.BoxNonce, gen: Keybase1.PerUserKeyGeneration}>
export type EncryptedNote = $ReadOnly<{v: Int, e: Bytes, n: Keybase1.BoxNonce, sender: NoteRecipient, recipient?: ?NoteRecipient}>
export type EncryptedRelaySecret = $ReadOnly<{v: Int, e: Bytes, n: Keybase1.BoxNonce, gen: Keybase1.PerTeamKeyGeneration}>
export type Hash = Bytes
export type KeybaseRequestID = String
export type KeybaseTransactionID = String
export type LocalBalancesLocalRpcParam = $ReadOnly<{accountID: AccountID}>
export type LocalBuildPaymentLocalRpcParam = $ReadOnly<{from: AccountID, fromSeqno: String, to: String, toIsAccountID: Boolean, amount: String, currency?: ?OutsideCurrencyCode, asset?: ?Asset, secretNote: String, publicMemo: String}>
export type LocalChangeDisplayCurrencyLocalRpcParam = $ReadOnly<{accountID: AccountID, currency: OutsideCurrencyCode}>
export type LocalChangeWalletAccountNameLocalRpcParam = $ReadOnly<{accountID: AccountID, newName: String}>
export type LocalClaimCLILocalRpcParam = $ReadOnly<{txID: String, into?: ?AccountID}>
export type LocalCreateWalletAccountLocalRpcParam = $ReadOnly<{name: String}>
export type LocalDeleteWalletAccountLocalRpcParam = $ReadOnly<{accountID: AccountID, userAcknowledged: String}>
export type LocalExchangeRateLocalRpcParam = $ReadOnly<{currency: OutsideCurrencyCode}>
export type LocalExportSecretKeyLocalRpcParam = $ReadOnly<{accountID: AccountID}>
export type LocalFormatLocalCurrencyStringRpcParam = $ReadOnly<{amount: String, code: OutsideCurrencyCode}>
export type LocalGetAccountAssetsLocalRpcParam = $ReadOnly<{accountID: AccountID}>
export type LocalGetAvailableLocalCurrenciesRpcParam = void
export type LocalGetDisplayCurrenciesLocalRpcParam = void
export type LocalGetDisplayCurrencyLocalRpcParam = $ReadOnly<{accountID: AccountID}>
export type LocalGetPaymentDetailsLocalRpcParam = $ReadOnly<{accountID: AccountID, id: PaymentID}>
export type LocalGetPaymentsLocalRpcParam = $ReadOnly<{accountID: AccountID, cursor?: ?PageCursor}>
export type LocalGetRequestDetailsLocalRpcParam = $ReadOnly<{reqID: KeybaseRequestID}>
export type LocalGetSendAssetChoicesLocalRpcParam = $ReadOnly<{from: AccountID, to: String}>
export type LocalGetWalletAccountPublicKeyLocalRpcParam = $ReadOnly<{accountID: AccountID}>
export type LocalGetWalletAccountSecretKeyLocalRpcParam = $ReadOnly<{accountID: AccountID}>
export type LocalGetWalletAccountsLocalRpcParam = void
export type LocalGetWalletSettingsLocalRpcParam = void
export type LocalImportSecretKeyLocalRpcParam = $ReadOnly<{secretKey: SecretKey, makePrimary: Boolean}>
export type LocalLinkNewWalletAccountLocalRpcParam = $ReadOnly<{secretKey: SecretKey, name: String}>
export type LocalOwnAccountLocalRpcParam = $ReadOnly<{accountID: AccountID}>
export type LocalPaymentDetailCLILocalRpcParam = $ReadOnly<{txID: String}>
export type LocalRecentPaymentsCLILocalRpcParam = $ReadOnly<{accountID?: ?AccountID}>
export type LocalSendCLILocalRpcParam = $ReadOnly<{recipient: String, amount: String, asset: Asset, note: String, displayAmount: String, displayCurrency: String, forceRelay: Boolean, publicNote: String, fromAccountID: AccountID}>
export type LocalSendPaymentLocalRpcParam = $ReadOnly<{from: AccountID, fromSeqno: String, to: String, toIsAccountID: Boolean, amount: String, asset: Asset, worthAmount: String, worthCurrency?: ?OutsideCurrencyCode, secretNote: String, publicMemo: String, quickReturn: Boolean}>
export type LocalSendRequestCLILocalRpcParam = $ReadOnly<{recipient: String, asset?: ?Asset, currency?: ?OutsideCurrencyCode, amount: String, message: String}>
export type LocalSetAcceptedDisclaimerLocalRpcParam = void
export type LocalSetDisplayCurrencyRpcParam = $ReadOnly<{accountID: AccountID, currency: String}>
export type LocalSetWalletAccountAsDefaultLocalRpcParam = $ReadOnly<{accountID: AccountID}>
export type LocalValidateAccountIDLocalRpcParam = $ReadOnly<{accountID: AccountID}>
export type LocalValidateAccountNameLocalRpcParam = $ReadOnly<{name: String}>
export type LocalValidateSecretKeyLocalRpcParam = $ReadOnly<{secretKey: SecretKey}>
export type LocalWalletDumpLocalRpcParam = void
export type LocalWalletGetAccountsCLILocalRpcParam = void
export type LocalWalletInitLocalRpcParam = void
export type NoteContents = $ReadOnly<{note: String, stellarID: TransactionID}>
export type NoteRecipient = $ReadOnly<{user: Keybase1.UserVersion, pukGen: Keybase1.PerUserKeyGeneration}>
export type OutsideCurrencyCode = String
export type OutsideCurrencyDefinition = $ReadOnly<{name: String, symbol: CurrencySymbol}>
export type OutsideExchangeRate = $ReadOnly<{currency: OutsideCurrencyCode, rate: String}>
export type OwnAccountCLILocal = $ReadOnly<{accountID: AccountID, isPrimary: Boolean, name: String, balance?: ?Array<Balance>, exchangeRate?: ?OutsideExchangeRate}>
export type PageCursor = $ReadOnly<{horizonCursor: String, directCursor: String, relayCursor: String}>
export type ParticipantType =
  | 0 // NONE_0
  | 1 // KEYBASE_1
  | 2 // STELLAR_2
  | 3 // SBS_3

export type PaymentCLILocal = $ReadOnly<{txID: TransactionID, time: TimeMs, status: String, statusDetail: String, amount: String, asset: Asset, displayAmount?: ?String, displayCurrency?: ?String, fromStellar: AccountID, toStellar?: ?AccountID, fromUsername?: ?String, toUsername?: ?String, toAssertion?: ?String, note: String, noteErr: String}>
export type PaymentDetails = $ReadOnly<{summary: PaymentSummary, memo: String, memoType: String}>
export type PaymentDetailsLocal = $ReadOnly<{id: PaymentID, txID: TransactionID, time: TimeMs, statusSimplified: PaymentStatus, statusDescription: String, statusDetail: String, amountDescription: String, delta: BalanceDelta, worth: String, worthCurrency: String, source: String, sourceType: ParticipantType, target: String, targetType: ParticipantType, note: String, noteErr: String, publicNote: String, publicNoteType: String}>
export type PaymentDirectPost = $ReadOnly<{fromDeviceID: Keybase1.DeviceID, to?: ?Keybase1.UserVersion, displayAmount: String, displayCurrency: String, noteB64: String, signedTransaction: String, quickReturn: Boolean}>
export type PaymentID = $ReadOnly<{txID: TransactionID}>
export type PaymentLocal = $ReadOnly<{id: PaymentID, time: TimeMs, statusSimplified: PaymentStatus, statusDescription: String, statusDetail: String, amountDescription: String, delta: BalanceDelta, worth: String, worthCurrency: String, source: String, sourceType: ParticipantType, target: String, targetType: ParticipantType, note: String, noteErr: String}>
export type PaymentOrErrorCLILocal = $ReadOnly<{payment?: ?PaymentCLILocal, err?: ?String}>
export type PaymentOrErrorLocal = $ReadOnly<{payment?: ?PaymentLocal, err?: ?String}>
export type PaymentRelayPost = $ReadOnly<{fromDeviceID: Keybase1.DeviceID, to?: ?Keybase1.UserVersion, toAssertion: String, relayAccount: AccountID, teamID: Keybase1.TeamID, displayAmount: String, displayCurrency: String, boxB64: String, signedTransaction: String, quickReturn: Boolean}>
export type PaymentResult = $ReadOnly<{keybaseID: KeybaseTransactionID, stellarID: TransactionID, pending: Boolean}>
export type PaymentStatus =
  | 0 // NONE_0
  | 1 // PENDING_1
  | 2 // CLAIMABLE_2
  | 3 // COMPLETED_3
  | 4 // ERROR_4
  | 5 // UNKNOWN_5

export type PaymentStatusMsg = $ReadOnly<{kbTxID: KeybaseTransactionID, txID: TransactionID}>
export type PaymentStrategy =
  | 0 // NONE_0
  | 1 // DIRECT_1
  | 2 // RELAY_2

export type PaymentSummary = {typ: 1, stellar: ?PaymentSummaryStellar} | {typ: 2, direct: ?PaymentSummaryDirect} | {typ: 3, relay: ?PaymentSummaryRelay}
export type PaymentSummaryDirect = $ReadOnly<{kbTxID: KeybaseTransactionID, txID: TransactionID, txStatus: TransactionStatus, txErrMsg: String, fromStellar: AccountID, from: Keybase1.UserVersion, fromDeviceID: Keybase1.DeviceID, toStellar: AccountID, to?: ?Keybase1.UserVersion, amount: String, asset: Asset, displayAmount?: ?String, displayCurrency?: ?String, noteB64: String, ctime: TimeMs, rtime: TimeMs, cursorToken: String}>
export type PaymentSummaryRelay = $ReadOnly<{kbTxID: KeybaseTransactionID, txID: TransactionID, txStatus: TransactionStatus, txErrMsg: String, fromStellar: AccountID, from: Keybase1.UserVersion, fromDeviceID: Keybase1.DeviceID, to?: ?Keybase1.UserVersion, toAssertion: String, relayAccount: AccountID, amount: String, displayAmount?: ?String, displayCurrency?: ?String, ctime: TimeMs, rtime: TimeMs, boxB64: String, teamID: Keybase1.TeamID, claim?: ?ClaimSummary, cursorToken: String}>
export type PaymentSummaryStellar = $ReadOnly<{txID: TransactionID, from: AccountID, to: AccountID, amount: String, asset: Asset, operationID: Uint64, ctime: TimeMs, cursorToken: String}>
export type PaymentSummaryType =
  | 0 // NONE_0
  | 1 // STELLAR_1
  | 2 // DIRECT_2
  | 3 // RELAY_3

export type PaymentsPage = $ReadOnly<{payments?: ?Array<PaymentSummary>, cursor?: ?PageCursor}>
export type PaymentsPageLocal = $ReadOnly<{payments?: ?Array<PaymentOrErrorLocal>, cursor?: ?PageCursor}>
export type RelayClaimPost = $ReadOnly<{keybaseID: KeybaseTransactionID, dir: RelayDirection, signedTransaction: String, autoClaimToken?: ?String}>
export type RelayClaimResult = $ReadOnly<{claimStellarID: TransactionID}>
export type RelayContents = $ReadOnly<{stellarID: TransactionID, sk: SecretKey, note: String}>
export type RelayDirection =
  | 0 // CLAIM_0
  | 1 // YANK_1

export type RemoteAccountSeqnoRpcParam = $ReadOnly<{caller: Keybase1.UserVersion, accountID: AccountID}>
export type RemoteAcquireAutoClaimLockRpcParam = $ReadOnly<{caller: Keybase1.UserVersion}>
export type RemoteBalancesRpcParam = $ReadOnly<{caller: Keybase1.UserVersion, accountID: AccountID}>
export type RemoteDetailsRpcParam = $ReadOnly<{caller: Keybase1.UserVersion, accountID: AccountID}>
export type RemoteIsMasterKeyActiveRpcParam = $ReadOnly<{caller: Keybase1.UserVersion, accountID: AccountID}>
export type RemoteNextAutoClaimRpcParam = $ReadOnly<{caller: Keybase1.UserVersion}>
export type RemotePaymentDetailsRpcParam = $ReadOnly<{caller: Keybase1.UserVersion, txID: String}>
export type RemotePingRpcParam = void
export type RemoteRecentPaymentsRpcParam = $ReadOnly<{caller: Keybase1.UserVersion, accountID: AccountID, cursor?: ?PageCursor, limit: Int}>
export type RemoteReleaseAutoClaimLockRpcParam = $ReadOnly<{caller: Keybase1.UserVersion, token: String}>
export type RemoteRequestDetailsRpcParam = $ReadOnly<{caller: Keybase1.UserVersion, reqID: KeybaseRequestID}>
export type RemoteSubmitPaymentRpcParam = $ReadOnly<{caller: Keybase1.UserVersion, payment: PaymentDirectPost}>
export type RemoteSubmitRelayClaimRpcParam = $ReadOnly<{caller: Keybase1.UserVersion, claim: RelayClaimPost}>
export type RemoteSubmitRelayPaymentRpcParam = $ReadOnly<{caller: Keybase1.UserVersion, payment: PaymentRelayPost}>
export type RemoteSubmitRequestRpcParam = $ReadOnly<{caller: Keybase1.UserVersion, request: RequestPost}>
export type RequestDetails = $ReadOnly<{id: KeybaseRequestID, fromUser: Keybase1.UserVersion, toUser?: ?Keybase1.UserVersion, toAssertion: String, amount: String, asset?: ?Asset, currency?: ?OutsideCurrencyCode, fundingKbTxID: KeybaseTransactionID}>
export type RequestDetailsLocal = $ReadOnly<{id: KeybaseRequestID, fromAssertion: String, fromIsCurrentUser: Boolean, toUserType: ParticipantType, toAssertion: String, amount: String, asset?: ?Asset, currency?: ?OutsideCurrencyCode, amountDescription: String, amountStellar: String, amountStellarDescription: String, completed: Boolean, statusDescription: String, fundingKbTxID: KeybaseTransactionID}>
export type RequestPost = $ReadOnly<{toUser?: ?Keybase1.UserVersion, toAssertion: String, amount: String, asset?: ?Asset, currency?: ?OutsideCurrencyCode}>
export type SecretKey = String
export type SendAssetChoiceLocal = $ReadOnly<{asset: Asset, enabled: Boolean, left: String, right: String, subtext: String}>
export type SendBannerLocal = $ReadOnly<{level: String, message: String, proofsChanged: Boolean}>
export type SendPaymentResLocal = $ReadOnly<{kbTxID: KeybaseTransactionID, pending: Boolean}>
export type SendResultCLILocal = $ReadOnly<{kbTxID: KeybaseTransactionID, txID: TransactionID}>
export type StellarServerDefinitions = $ReadOnly<{revision: Int, currencies: {[key: string]: OutsideCurrencyDefinition}}>
export type TimeMs = Long
export type TransactionID = String
export type TransactionStatus =
  | 0 // NONE_0
  | 1 // PENDING_1
  | 2 // SUCCESS_2
  | 3 // ERROR_TRANSIENT_3
  | 4 // ERROR_PERMANENT_4

export type WalletAccountLocal = $ReadOnly<{accountID: AccountID, isDefault: Boolean, name: String, balanceDescription: String}>
export type WalletSettings = $ReadOnly<{acceptedDisclaimer: Boolean}>
type LocalBalancesLocalResult = ?Array<Balance>
type LocalBuildPaymentLocalResult = BuildPaymentResLocal
type LocalClaimCLILocalResult = RelayClaimResult
type LocalCreateWalletAccountLocalResult = AccountID
type LocalExchangeRateLocalResult = OutsideExchangeRate
type LocalExportSecretKeyLocalResult = SecretKey
type LocalFormatLocalCurrencyStringResult = String
type LocalGetAccountAssetsLocalResult = ?Array<AccountAssetLocal>
type LocalGetAvailableLocalCurrenciesResult = {[key: string]: OutsideCurrencyDefinition}
type LocalGetDisplayCurrenciesLocalResult = ?Array<CurrencyLocal>
type LocalGetDisplayCurrencyLocalResult = CurrencyLocal
type LocalGetPaymentDetailsLocalResult = PaymentDetailsLocal
type LocalGetPaymentsLocalResult = PaymentsPageLocal
type LocalGetRequestDetailsLocalResult = RequestDetailsLocal
type LocalGetSendAssetChoicesLocalResult = ?Array<SendAssetChoiceLocal>
type LocalGetWalletAccountPublicKeyLocalResult = String
type LocalGetWalletAccountSecretKeyLocalResult = SecretKey
type LocalGetWalletAccountsLocalResult = ?Array<WalletAccountLocal>
type LocalGetWalletSettingsLocalResult = WalletSettings
type LocalLinkNewWalletAccountLocalResult = AccountID
type LocalOwnAccountLocalResult = Boolean
type LocalPaymentDetailCLILocalResult = PaymentCLILocal
type LocalRecentPaymentsCLILocalResult = ?Array<PaymentOrErrorCLILocal>
type LocalSendCLILocalResult = SendResultCLILocal
type LocalSendPaymentLocalResult = SendPaymentResLocal
type LocalWalletDumpLocalResult = Bundle
type LocalWalletGetAccountsCLILocalResult = ?Array<OwnAccountCLILocal>
type RemoteAccountSeqnoResult = String
type RemoteAcquireAutoClaimLockResult = String
type RemoteBalancesResult = ?Array<Balance>
type RemoteDetailsResult = AccountDetails
type RemoteIsMasterKeyActiveResult = Boolean
type RemoteNextAutoClaimResult = ?AutoClaim
type RemotePaymentDetailsResult = PaymentDetails
type RemotePingResult = String
type RemoteRecentPaymentsResult = PaymentsPage
type RemoteRequestDetailsResult = RequestDetails
type RemoteSubmitPaymentResult = PaymentResult
type RemoteSubmitRelayClaimResult = RelayClaimResult
type RemoteSubmitRelayPaymentResult = PaymentResult
type RemoteSubmitRequestResult = KeybaseRequestID

export type IncomingCallMapType = {||}

// Not enabled calls. To enable add to enabled-calls.json: 'stellar.1.local.getPaymentDetailsLocal' 'stellar.1.local.getDisplayCurrenciesLocal' 'stellar.1.local.validateAccountIDLocal' 'stellar.1.local.changeWalletAccountNameLocal' 'stellar.1.local.setWalletAccountAsDefaultLocal' 'stellar.1.local.deleteWalletAccountLocal' 'stellar.1.local.createWalletAccountLocal' 'stellar.1.local.changeDisplayCurrencyLocal' 'stellar.1.local.getDisplayCurrencyLocal' 'stellar.1.local.getWalletSettingsLocal' 'stellar.1.local.setAcceptedDisclaimerLocal' 'stellar.1.local.getWalletAccountPublicKeyLocal' 'stellar.1.local.getWalletAccountSecretKeyLocal' 'stellar.1.local.getSendAssetChoicesLocal' 'stellar.1.local.buildPaymentLocal' 'stellar.1.local.sendPaymentLocal' 'stellar.1.local.getRequestDetailsLocal' 'stellar.1.local.balancesLocal' 'stellar.1.local.sendCLILocal' 'stellar.1.local.claimCLILocal' 'stellar.1.local.recentPaymentsCLILocal' 'stellar.1.local.paymentDetailCLILocal' 'stellar.1.local.walletInitLocal' 'stellar.1.local.walletDumpLocal' 'stellar.1.local.walletGetAccountsCLILocal' 'stellar.1.local.ownAccountLocal' 'stellar.1.local.importSecretKeyLocal' 'stellar.1.local.exportSecretKeyLocal' 'stellar.1.local.setDisplayCurrency' 'stellar.1.local.exchangeRateLocal' 'stellar.1.local.getAvailableLocalCurrencies' 'stellar.1.local.formatLocalCurrencyString' 'stellar.1.local.sendRequestCLILocal' 'stellar.1.remote.balances' 'stellar.1.remote.details' 'stellar.1.remote.recentPayments' 'stellar.1.remote.paymentDetails' 'stellar.1.remote.accountSeqno' 'stellar.1.remote.submitPayment' 'stellar.1.remote.submitRelayPayment' 'stellar.1.remote.submitRelayClaim' 'stellar.1.remote.acquireAutoClaimLock' 'stellar.1.remote.releaseAutoClaimLock' 'stellar.1.remote.nextAutoClaim' 'stellar.1.remote.isMasterKeyActive' 'stellar.1.remote.submitRequest' 'stellar.1.remote.requestDetails' 'stellar.1.remote.ping'
