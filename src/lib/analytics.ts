import { toaster } from 'evergreen-ui'
import { last } from 'lodash'

export interface Event {
  id: string
  type: EventType
  payload: EventPayload
  sentAt: Date
}

export interface EventPayload {
  [key: string]: any
}

export enum EventType {
  TRACK = 'track',
  PAGE = 'page',
  IDENTIFY = 'identify',
  GROUP = 'group',
  SCREEN = 'screen',
  ALIAS = 'alias'
}

export const getEventName = (event: Event): string => {
  if (event.type === EventType.TRACK) {
    return event.payload.event
  } else if (event.type === EventType.PAGE || event.type === EventType.SCREEN) {
    return event.payload.name
  } else if (event.type === EventType.GROUP) {
    return event.payload.groupId
  } else {
    return event.payload.userId
  }
}

export const sendEvent = async (event: Event) => {
  // Fake implementation of sending the event to the Segment API
  // Not required for the purpose of the take home
}

export const validatePayload = (type: EventType, payload: EventPayload): boolean => {
  if (payload === null) {
    return false
  }

  if (type === EventType.TRACK && !payload.event) {
    return false
  }

  if ((type === EventType.PAGE || type === EventType.SCREEN) && !payload.name) {
    return false
  }

  return true
}