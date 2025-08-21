import { EntityManager } from './entity'
import { EventManager } from './event'
import { Constructor, World } from './world'

export interface System {
  configure?(event_manager: EventManager)
  update?(entities: EntityManager, events: EventManager, dt: number)
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

  addThenConfigure<T extends System>(sys: Constructor<T>) {
    const newSystem = new sys()
    this.world.systemsMap[sys.name] = newSystem
    newSystem.configure(this.world.events)
    return newSystem
  }

  add<T extends System>(sys: Constructor<T>) {
    return this.world.systemsMap[sys.name] = new sys()
  }

  configure() {
    Object.values(this.world.systemsMap).forEach((sys) => {
      if (sys.configure) {
        sys.configure(this.world.events)
      }
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
