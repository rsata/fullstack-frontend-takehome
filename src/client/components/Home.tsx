import React, { useReducer, useState } from 'react'
import { Pane, toaster } from 'evergreen-ui'
import EventBuilder, { BuilderState, Action, reduceAction, ActionType } from './EventBuilder'
import { Event } from 'lib/analytics'
import { sendEvent, getEventName } from 'lib/analytics'
import { EventType } from '../../lib/analytics'
import EventHistory from './EventHistory'

const styling = {
  background: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'no-wrap',
    height: '100vh',
    overflow: 'hidden'
  },
  builder: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexGrow: 1,
    height: '100%',
    overflow: 'scroll'
  },
  history: {
    display: 'flex',
    width: '500px',
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderLeft: 'solid 2px #DDDDDD'
  }
}

const Home = () => {
  const [builder, dispatch] = useReducer<BuilderState, Action>(reduceAction, {
    type: EventType.TRACK
  })
  const [history, updateHistory] = useState<Event[]>([])

  const onSave = async (event: Event) => {
    await sendEvent(event)
    await updateHistory([...history, event])
    toaster.success(`Sent '${getEventName(event)}' ${event.type.toLocaleLowerCase()} call`, {
      duration: 2
    })
  }

  const onEdit = (event: Event) => {
    dispatch({ type: ActionType.SET_TYPE, newType: event.type })
    dispatch({ type: ActionType.SET_PAYLOAD, payload: event.payload })
  }

  const onClear = async () => {
    await updateHistory([])
  }

  return (
    <Pane {...styling.background}>
      <Pane {...styling.builder}>
        <EventBuilder builder={builder} dispatch={dispatch} onSave={onSave}/>
      </Pane>
      <Pane {...styling.history}>
        <EventHistory history={history} onSave={onSave} onEdit={onEdit} onClear={onClear} />
      </Pane>
    </Pane>
  )
}

export default Home
