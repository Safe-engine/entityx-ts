import { EntityManager } from './entity'
import { EventManager, EventReceive } from './event'
import { Constructor } from './global'
import { World } from './world'

export interface System {
  configure(event_manager: EventManager)

  receive(type: string, event: EventReceive)

  update(entities: EntityManager, events: EventManager, dt: number)
}

export class SystemManager {
  world: World
  constructor(world: World) {
    this.world = world
  }

  isRegistered(name: string) {
    return this.world.systemsMap[name]
  }

  get<T extends System>(sys: Constructor<T>): T {
    return this.world.systemsMap[sys.name] as T
  }

  configureOnce<T extends System>(sys: Constructor<T>) {
    return this.world.systemsMap[sys.name].configure(this.world.events)
  }

  add<T extends System>(sys: Constructor<T>) {
    this.world.systemsMap[sys.name] = new sys()
  }

  configure() {
    Object.values(this.world.systemsMap).forEach((sys) => {
      sys.configure(this.world.events)
    })
  }

  update<T extends System>(system: Constructor<T>, dt: number) {
    const sys = this.world.systemsMap[system.name]
    const entities = this.world.entities
    const events = this.world.events
    sys.update(entities, events, dt)
  }
}

export interface SystemMapData {
  [key: string]: System
}
