// @flow
import * as React from 'react'
import {Set} from 'immutable'
import {Box2} from '../../../../common-adapters/box'
import {platformStyles} from '../../../../styles'
import * as PropProviders from '../../../../stories/prop-providers'
import {action, storiesOf} from '../../../../stories/storybook'
import Input, {type Props as InputProps} from '.'
import {isMobile} from '../../../../constants/platform'
import {stringToConversationIDKey} from '../../../../constants/types/chat2'

const provider = PropProviders.compose(PropProviders.Usernames(['max', 'cnojima', 'cdixon'], 'ayoubd'), {
  ChannelMentionHud: ownProps => {
    const channels = ['foo', 'bar']
    return {
      ...ownProps,
      channels,
    }
  },
  UserMentionHud: ownProps => {
    const users = [
      {username: 'marcopolo', fullName: 'Marco Munizaga'},
      {username: 'trex', fullName: 'Thomas Rex'},
      {username: 'chris', fullName: 'Chris Coyne'},
    ]
    return {
      ...ownProps,
      users,
    }
  },
})

type Props = {
  isEditing: boolean,
  isExploding: boolean,
  isExplodingNew: boolean,
  explodingModeSeconds: number,
  pendingWaiting: boolean,
  typing: Set<string>,
}

// On mobile, we want full width and height. On desktop, we we want to
// manually set dimensions. Not sure why fullHeight doesn't work on
// mobile, though.
const boxProps = {
  direction: 'vertical',
  fullWidth: isMobile,
  style: platformStyles({
    common: {height: 300, justifyContent: 'flex-end'},
    isElectron: {width: 500},
    isMobile: {},
  }),
}

const InputContainer = (props: Props) => {
  const inputProps: InputProps = {
    conversationIDKey: stringToConversationIDKey('fake conversation id key'),
    isEditing: props.isEditing,
    isExploding: props.isExploding,
    isExplodingNew: props.isExplodingNew,
    explodingModeSeconds: props.explodingModeSeconds,
    focusInputCounter: 0,
    clearInboxFilter: action('clearInboxFilter'),
    onAttach: (paths: Array<string>) => {
      // This will always be called with an empty array, since some
      // browsers don't have the path property set on File.
      action('onAttach').apply(null, paths)
    },
    onEditLastMessage: action('onEditLastMessage'),
    onCancelEditing: action('onCancelEditing'),
    onCancelQuoting: action('onCancelQuoting'),
    onSubmit: (text: string) => {
      action('onSubmit')(text)
    },
    pendingWaiting: props.pendingWaiting,
    typing: props.typing,

    editText: '',
    quoteCounter: 0,
    quoteText: '',

    getUnsentText: () => {
      action('getUnsentText')()
      return props.isEditing ? 'some text' : ''
    },

    selectExplodingMode: action('selectExplodingMode'),
    sendTyping: action('sendTyping'),
    setUnsentText: action('setUnsentText'),
  }

  return (
    <Box2 {...boxProps}>
      <Input {...inputProps} />
    </Box2>
  )
}

const load = () => {
  storiesOf('Chat/Conversation/Input', module)
    .addDecorator(provider)
    .add('Normal', () => (
      <InputContainer
        isEditing={false}
        pendingWaiting={false}
        typing={Set()}
        isExploding={false}
        isExplodingNew={false}
        explodingModeSeconds={0}
      />
    ))
    .add('Typing 1', () => (
      <InputContainer
        isEditing={false}
        pendingWaiting={false}
        typing={Set(['chris'])}
        isExploding={false}
        isExplodingNew={false}
        explodingModeSeconds={0}
      />
    ))
    .add('Typing 2', () => (
      <InputContainer
        isEditing={false}
        pendingWaiting={false}
        typing={Set(['chris', 'strib'])}
        isExploding={false}
        isExplodingNew={false}
        explodingModeSeconds={0}
      />
    ))
    .add('Typing 3', () => (
      <InputContainer
        isEditing={false}
        pendingWaiting={false}
        typing={Set(['chris', 'strib', 'fred'])}
        isExploding={false}
        isExplodingNew={false}
        explodingModeSeconds={0}
      />
    ))
    .add('Editing', () => (
      <InputContainer
        isEditing={true}
        pendingWaiting={false}
        typing={Set()}
        isExploding={false}
        isExplodingNew={false}
        explodingModeSeconds={0}
      />
    ))
    .add('Pending waiting', () => (
      <InputContainer
        isEditing={false}
        pendingWaiting={true}
        typing={Set()}
        isExploding={false}
        isExplodingNew={false}
        explodingModeSeconds={0}
      />
    ))
    .add('Exploding', () => (
      <InputContainer
        isEditing={false}
        pendingWaiting={false}
        typing={Set()}
        isExploding={true}
        isExplodingNew={true}
        explodingModeSeconds={0}
      />
    ))
}

export default load
