import React, { useEffect } from 'react'
import { Heading, Pane, Card, majorScale, toaster, Text, Link } from 'evergreen-ui'
import PayloadBuilder from './PayloadBuilder'
import SendButton from './SendButton'
import { Event, EventType, validatePayload } from 'lib/analytics'
import uuid from 'uuid/v4'

export interface Props {
  onSave: (event: Event) => void

  builder: BuilderState
  dispatch: (action: Action) => void
}

const styles = {
  background: {
    elevation: 1,
    minWidth: majorScale(90),
    background: 'white',
    padding: majorScale(2),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'scroll'
  },
  content: {
    minWidth: majorScale(70),
    marginTop: majorScale(3),
    marginBottom: majorScale(2)
  },
  header: {
    size: 800,
    textAlign: 'center'
  },
  subheader: {
    size: 300,
    textAlign: 'center',
    marginTop: majorScale(1)
  },
  sendWrapper: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
  }
}

export enum ActionType {
  SET_TYPE,
  SET_PAYLOAD
}

export type Action =
  { type: ActionType.SET_TYPE, newType: EventType } |
  { type: ActionType.SET_PAYLOAD, payload: any }

export type BuilderState = Partial<Event> & {
  type: EventType
}

export const reduceAction = (event: BuilderState, action: Action): BuilderState => {
  const updates: Partial<BuilderState> = {}

  if (action.type === ActionType.SET_TYPE) {
    updates.type = action.newType
  } else if (action.type === ActionType.SET_PAYLOAD) {
    updates.payload = action.payload
  } else {
    throw new Error('Unsupported action: ' + action)
  }

  return {
    ...event,
    ...updates
  }
}

const EventBuilder = (props: Props) => {
  const { builder, dispatch } = props

  const onChangeType = (type: any) => {
    dispatch({ type: ActionType.SET_TYPE, newType: type })
  }
  const onChangePayload = (payload: any) => {
    dispatch({ type: ActionType.SET_PAYLOAD, payload })
  }

  const canSend = builder.payload && builder.type && validatePayload(builder.type, builder.payload)

  const onSend = () => {
    if (canSend) {
      const event: Event = {
        id: uuid(),
        type: builder.type!,
        payload: builder.payload!,
        sentAt: new Date()
      }
      props.onSave(event)
    }
  }

  return (
    <Card {...styles.background}>
      <Pane {...styles.content}>
        <Heading {...styles.header}>Fake Event Dispatch</Heading>
        <Heading {...styles.subheader}>Send test events to your Segment source</Heading>

        <PayloadBuilder type={builder.type} payload={builder.payload} onChangeType={onChangeType} onChangePayload={onChangePayload} />

        <Pane {...styles.sendWrapper}>
          <SendButton disabled={!canSend} onClick={onSend} />
        </Pane>
      </Pane>
    </Card>
  )
}

export default EventBuilder
