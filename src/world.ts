import { EntityManager, EntityMapData } from './entity'
import { EventManager, EventMapData } from './event'
import { SystemManager, SystemMapData } from './system'

export class World {
  public counter = 0
  public entitiesMap: EntityMapData = {}
  public systemsMap: SystemMapData = {}
  public eventsMap: EventMapData = {}
  entities: EntityManager
  systems: SystemManager
  events: EventManager
  constructor() {
    this.entities = new EntityManager(this)
    this.systems = new SystemManager(this)
    this.events = new EventManager(this)
  }
}

// export const world = new World();
