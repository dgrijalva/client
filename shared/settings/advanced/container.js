// @flow
import * as ConfigGen from '../../actions/config-gen'
import {createTrace, createProcessorProfile} from '../../actions/settings-gen'
import {navigateAppend, navigateUp} from '../../actions/route-tree'
import {HeaderHoc} from '../../common-adapters'
import * as Constants from '../../constants/settings'
import {compose} from 'recompose'
import Advanced from './index'
import {connect, type TypedState} from '../../util/container'

const mapStateToProps = (state: TypedState) => ({
  openAtLogin: state.config.openAtLogin,
  processorProfileInProgress: Constants.processorProfileInProgress(state),
  traceInProgress: Constants.traceInProgress(state),
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  onBack: () => dispatch(navigateUp()),
  onDBNuke: () => dispatch(navigateAppend(['dbNukeConfirm'])),
  onProcessorProfile: (durationSeconds: number) => dispatch(createProcessorProfile({durationSeconds})),
  onSetOpenAtLogin: (open: boolean) => dispatch(ConfigGen.createSetOpenAtLogin({open, writeFile: true})),
  onTrace: (durationSeconds: number) => dispatch(createTrace({durationSeconds})),
})

const connectedAdvanced = compose(connect(mapStateToProps, mapDispatchToProps), HeaderHoc)(Advanced)
export default connectedAdvanced
