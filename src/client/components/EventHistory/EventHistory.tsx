import React, { useState, useEffect } from 'react'
import { Event } from 'lib/analytics'
import { Pane, Table, Button } from 'evergreen-ui'
import EventItem from './EventItem'
import EmptyState from './EmptyState'

const styling = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    overflow: 'scroll',
    width: '100%',
    height: '100%'
  },
  clear: {
    bottom: 0,
    borderTop: 'solid 1px #DDDDDD',
    width: '100%',
    paddingY: '40px',
    paddingX: '10px',
    display: 'flex',
    justifyContent: 'flex-end'
  }
}

interface Props {
  history: Event[]
  onSave: (event: Event) => void
  onEdit: (event: Event) => void
  onClear: () => void
}

const EventHistory = (props: Props) => {
  const [filter, setFilter] = useState('')
  const [eventList, setEventList] = useState(props.history)

  useEffect(() => {
    const list = props.history.filter(event => event.payload.event.toLowerCase().indexOf(filter) > -1)
    setEventList(list)
  }, [filter, props.history])

  const handleFilterChange = (query: string) => {
    setFilter(query)
  }

  if (props.history.length === 0) {
    return <EmptyState />
  }

  return (
    <Pane {...styling.container}>
      <Table>
        <Table.Head>
          <Table.SearchHeaderCell
            onChange={handleFilterChange}
            placeholder='Search events'
          />
        </Table.Head>
        <Table.Body>
          {eventList.slice(0).reverse().map((event, i) => (<EventItem key={i} event={event} onSave={props.onSave} onEdit={props.onEdit} />))}
        </Table.Body>
      </Table>
      <Pane {...styling.clear}>
        <Button intent='danger' onClick={props.onClear}>Clear History</Button>
      </Pane>
    </Pane>
  )
}

export default EventHistory