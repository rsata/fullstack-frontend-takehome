import React, { useEffect } from 'react'
import { Event } from '../../../../lib/analytics'
import { Table, Pane, Heading, Badge, Text, Button, Link, OneColumnIcon, Icon } from 'evergreen-ui'
import moment from 'moment'

const styling = {
  row: {
    height: 'auto',
    paddingY: '15px',
  },
  container: {
    width: '100%'
  },
  head: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: '20px'
  },
  body: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  time: {
    flex: 1
  },
  edit: {
    marginRight: '10px',
    textDecoration: 'none'
  }
}

interface Props {
  event: Event
  onSave: (event: Event) => void
  onEdit: (event: Event) => void
}

const EventItem = (props: Props) => (
  <Table.Row {...styling.row}>
    <Table.Cell>
      <Pane {...styling.container}>
        <Pane {...styling.head}>
          <Heading>{props.event.payload.event}</Heading>
          <Badge color='green'>{props.event.type}</Badge>
        </Pane>
        <Pane {...styling.body}>
          <Text {...styling.time}>{moment(props.event.sentAt).fromNow()}</Text>
          <Link {...styling.edit} onClick={() => props.onEdit(props.event)}><Icon icon='arrow-left' size={12} marginRight={4} />Edit</Link>
          <Button intent='success' onClick={() => props.onSave(props.event)}>Send Again</Button>
        </Pane>
      </Pane>
    </Table.Cell>
  </Table.Row>
)

export default EventItem