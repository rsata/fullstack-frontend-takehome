import React, { useState, useEffect } from 'react'
import { Pane, majorScale, Heading, Spinner } from 'evergreen-ui'
import { EventType, EventPayload } from 'lib/analytics'
import EventTypeToggle from './EventTypeToggle'
import dynamic from 'next/dynamic'
import { Props as EditorProps } from './Editor'
const Editor = dynamic<EditorProps>((() => import('./Editor')) as any, {
  ssr: false
})

export interface Props {
  type: EventType
  payload?: EventPayload

  onChangeType: (type: EventType) => void
  onChangePayload: (event: EventPayload) => void
}

const serializePayload = (payload: EventPayload) => JSON.stringify(payload, null, 4)

type RawPayloads = {[t in EventType]: string}
const getInitialPayloads = (): RawPayloads => {
  return {
    [EventType.TRACK]: serializePayload({
      event: 'Example Event',
      properties: {},
      userId: 'test@example.com'
    }),
    [EventType.PAGE]: serializePayload({
      name: 'Page Name',
      category: null,
      properties: {},
      userId: 'test@example.com'
    }),
    [EventType.IDENTIFY]: serializePayload({
      traits: {},
      userId: 'test@example.com'
    }),
    [EventType.GROUP]: serializePayload({
      groupId: 'segment123',
      traits: {},
      userId: 'test@example.com'
    }),
    [EventType.SCREEN]: serializePayload({
      name: 'View Name',
      properties: {},
      userId: 'test@example.com'
    }),
    [EventType.ALIAS]: serializePayload({
      previousId: `test@elsewhere.com`,
      userId: 'test@example.com'
    })
  }
}

const styles = {
  wrapper: {
    marginTop: majorScale(2)
  },
  content: {
    marginTop: majorScale(1)
  },
  heading: {
    size: 400
  },
  editor: {
    paddingRight: '2px' // due to the border
  },
  loadingPane: {
    display: 'flex',
    minHeight: '484px',
    paddingY: majorScale(8),
    flex: 1
  },
  spinner: {
    size: majorScale(3),
    flexBasis: majorScale(3),
    marginX: 'auto'
  }
}

const PayloadBuilder = (props: Props) => {
  const [rawPayloads, setRawPayloads] = useState<RawPayloads | null>(null)

  useEffect(() => {
    if (rawPayloads) {
      return
    }

    const initialPayloads = getInitialPayloads()
    let defaultPayload
    try {
      defaultPayload = JSON.parse(initialPayloads[props.type])
    } catch (err) {
      // Do nothing
    }

    setRawPayloads(initialPayloads)
    props.onChangePayload(defaultPayload)
  })

  const onChangePayload = (rawPayload: string) => {
    if (!rawPayloads) {
      return
    }

    setRawPayloads({
      ...rawPayloads,
      [props.type]: rawPayload
    })

    let parsedPayload
    try {
      parsedPayload = JSON.parse(rawPayload)
      props.onChangePayload(parsedPayload)
    } catch (err) {
      // Do nothing
    }
  }

  useEffect(() => {
    if (!rawPayloads) {
      return
    }

    if (props.payload) {
      setRawPayloads({
        ...rawPayloads,
        [props.type]: serializePayload(props.payload)
      })
    } else {
      onChangePayload(rawPayloads[props.type])
    }
  }, [JSON.stringify(props.payload)])

  if (!rawPayloads) {
    return (
      <Pane {...styles.loadingPane}>
        <Spinner {...styles.spinner} />
      </Pane>
    )
  }

  return (
    <Pane {...styles.wrapper}>
      <Heading {...styles.heading}>Payload</Heading>
      <Pane {...styles.content}>
        <EventTypeToggle type={props.type} onChange={props.onChangeType} />

        <Pane {...styles.editor}>
          <Editor content={rawPayloads[props.type]} onChange={onChangePayload} />
        </Pane>
      </Pane>
    </Pane>
  )
}

export default PayloadBuilder
