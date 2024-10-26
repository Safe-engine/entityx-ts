import { EntityManager, EntityMapData } from './entity'
import { EventCustomMapData, EventManager, EventMapData } from './event'
import { SystemManager, SystemMapData } from './system'

export class World {
  public counter = 0
  public entitiesMap: EntityMapData = {}
  public systemsMap: SystemMapData = {}
  public eventsMap: EventMapData = {}
  public eventsCustomMap: EventCustomMapData = {}
  entities: EntityManager
  systems: SystemManager
  events: EventManager
  constructor() {
    this.entities = new EntityManager(this)
    this.systems = new SystemManager(this)
    this.events = new EventManager(this)
  }
}
