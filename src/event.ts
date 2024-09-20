import { ComponentType, Entity } from './entity'
import { Constructor } from './global'
import { World } from './world'

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
}
export function getEventName<T extends ComponentType>(event: EventTypes, component: Constructor<T>) {
  return `${event}_${component.name}`
}
export function ComponentAddedEvent<T extends ComponentType>(component: Constructor<T> | string) {
  if (typeof component === 'string') {
    return `${EventTypes.ComponentAdded}_${component}`
  }
  return getEventName(EventTypes.ComponentAdded, component)
}

export function ComponentRemovedEvent<T extends ComponentType>(component: Constructor<T> | string) {
  if (typeof component === 'string') {
    return `${EventTypes.ComponentRemoved}_${component}`
  }
  return getEventName(EventTypes.ComponentRemoved, component)
}

export interface EventReceive<T> {
  component: T
  entity: Entity
}
export type EventReceiveCallback<T> = (entity: EventReceive<T>) => void
export interface EventMapData {
  [key: string]: Array<EventReceiveCallback<ComponentType>>
}

export type ReceiveEvent = typeof ComponentAddedEvent | typeof ComponentRemovedEvent
