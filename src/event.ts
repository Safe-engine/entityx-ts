import { ComponentType, Entity } from './entity'
import { Constructor, World } from './world'

export enum EventTypes {
  ComponentAdded,
  ComponentRemoved,
}

export class EventManager<W extends World = World> {
  world: W
  constructor(world: W) {
    this.world = world
  }

  publish<T>(event: EventTypes, entity: Entity, component: T) {
    const eventName = getEventName(event, component.constructor as Constructor<T>)
    // console.log('eventName', eventName);
    if (this.world.eventsMap[eventName]) {
      this.world.eventsMap[eventName].forEach((cb) => {
        cb({ entity, component })
      })
    }
  }

  subscribe<T>(event: EventTypes, component: Constructor<T>, callback: EventReceiveCallback<T>) {
    const eventName = getEventName(event, component)
    if (!this.world.eventsMap[eventName]) {
      this.world.eventsMap[eventName] = []
    }
    const targets = this.world.eventsMap[eventName]
    targets.push(callback)
  }

  publishCustom<T>(eventName: string, data?: T) {
    // console.log('eventName', eventName);
    if (this.world.eventsCustomMap[eventName]) {
      this.world.eventsCustomMap[eventName].forEach((cb) => {
        cb(data)
      })
    }
  }

  subscribeCustom<T>(eventName: string, callback: EventCustomReceiveCallback<T>) {
    if (!this.world.eventsCustomMap[eventName]) {
      this.world.eventsCustomMap[eventName] = []
    }
    this.world.eventsCustomMap[eventName].push(callback)
  }
}
export function getEventName<T extends ComponentType>(event: EventTypes, component: Constructor<T>) {
  return `${event}_${component.name}`
}

export interface EventReceive<T> {
  component: T
  entity: Entity
}

export type EventReceiveCallback<T> = (event: EventReceive<T>) => void
export interface EventMapData {
  [key: string]: Array<EventReceiveCallback<ComponentType>>
}
export type EventCustomReceiveCallback<T> = (data: T) => void
export interface EventCustomMapData {
  [key: string]: Array<EventCustomReceiveCallback<ComponentType>>
}
