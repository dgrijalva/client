// @flow
import * as React from 'react'
import Text from './text'
import {StyleSheet} from 'react-native'
import BackButton from './back-button'
import Box from './box'
import {collapseStyles, globalStyles, globalColors, globalMargins, statusBarHeight} from '../styles'
import type {Props} from './header-hoc.types'

export const HeaderHocHeader = ({
  headerStyle,
  customComponent,
  title,
  onCancel,
  onBack,
  theme = 'light',
}: Props) => (
  <Box style={collapseStyles([_headerStyle, _headerStyleThemed[theme], headerStyle])}>
    {customComponent}
    {!!title && (
      <Box style={_titleStyle}>
        <Text type="BodyBig">{title}</Text>
      </Box>
    )}
    {onCancel && (
      <Text type="BodyBigLink" style={_buttonStyle} onClick={onCancel}>
        Cancel
      </Text>
    )}
    {onBack && (
      <BackButton iconColor={_backButtonIconColorThemed[theme]} style={_buttonStyle} onClick={onBack} />
    )}
  </Box>
)

function HeaderHoc<P: {}>(WrappedComponent: React.ComponentType<P>) {
  const HeaderHocWrapper = (props: P & Props) => (
    <Box style={_containerStyle}>
      <HeaderHocHeader {...props} />
      <Box style={_wrapperStyle}>
        <Box style={_wrapper2Style}>
          <WrappedComponent {...(props: P)} />
        </Box>
      </Box>
    </Box>
  )

  return HeaderHocWrapper
}

const _backButtonIconColorThemed = {
  dark: globalColors.white,
  light: globalColors.black_40,
}

const _containerStyle = {
  ...globalStyles.flexBoxColumn,
  position: 'relative',
  height: '100%',
  width: '100%',
}

const _wrapper2Style = {
  ...globalStyles.fillAbsolute,
}

const _wrapperStyle = {
  flexGrow: 1,
}

const _buttonStyle = {
  paddingBottom: 8,
  paddingLeft: globalMargins.small,
  paddingRight: globalMargins.small,
  paddingTop: 8,
}

const _headerStyle = {
  ...globalStyles.flexBoxRow,
  alignItems: 'center',
  borderBottomColor: globalColors.black_05,
  borderBottomWidth: StyleSheet.hairlineWidth,
  justifyContent: 'flex-start',
  minHeight: globalMargins.xlarge - statusBarHeight,
  paddingRight: globalMargins.small,
  position: 'relative',
}

const _headerStyleThemed = {
  dark: {
    backgroundColor: globalColors.darkBlue3,
  },
  light: {
    backgroundColor: globalColors.white,
  },
}

const _titleStyle = {
  ...globalStyles.flexBoxRow,
  alignItems: 'center',
  bottom: 0,
  flex: 1,
  justifyContent: 'center',
  left: 0,
  position: 'absolute', // This is always centered so we never worry about items to the left/right. If you have overlap or other issues you likely have to fix the content
  right: 0,
  top: 0,
}

export default HeaderHoc
