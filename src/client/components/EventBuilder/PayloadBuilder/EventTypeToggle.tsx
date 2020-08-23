import React from 'react'
import { Pane, SegmentedControl } from 'evergreen-ui'
import { EventType } from 'lib/analytics'

interface Props {
  type: EventType
  onChange: (eventType: EventType) => void
}

const options = [
  {
    label: 'Track',
    value: EventType.TRACK
  },
  {
    label: 'Page',
    value: EventType.PAGE
  },
  {
    label: 'Identify',
    value: EventType.IDENTIFY
  },
  {
    label: 'Group',
    value: EventType.GROUP
  },
  {
    label: 'Screen',
    value: EventType.SCREEN
  },
  {
    label: 'Alias',
    value: EventType.ALIAS
  }
]

const styles = {
  content: {
    display: 'flex',
    flexDirection: 'row',
    paddingLeft: '1px'
  },
  heading: {
    size: '400'
  }
}

const EventTypeToggle = (props: Props) => {
  return (
    <Pane {...styles.content}>
      <SegmentedControl width='100%' options={options} value={props.type} onChange={props.onChange} />
    </Pane>
  )
}

export default EventTypeToggle
