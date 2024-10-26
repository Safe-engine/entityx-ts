/* eslint-disable @typescript-eslint/no-explicit-any */
// import { ComponentType } from 'safex/gworld/components/EnhancedComponent'
import { EventTypes } from './event'
import { Constructor } from './global'
import { World } from './world'

interface Components {
  [key: string]: any
}

export class ComponentType { }

export interface EntityMapData {
  [key: string]: Entity
}
export class Entity {
  // Generate a pseudo random ID
  id = 0
  components: Components = {}
  world: World
  constructor(world: World, id) {
    this.world = world
    this.id = id
  }

  getComponent = <T extends ComponentType>(component: Constructor<T>): T => {
    // if (typeof component === 'string') {
    //   return this.components[component]
    // }
    return this.components[component.name]
  }

  assign = <T extends ComponentType>(instance: T): T => {
    // Add component data to the entity
    // NOTE: The component must have a name property (which is defined as
    // a prototype prototype of a component function)
    // cc.log(component.name, component.create);
    // const instance = component.create(...args);
    const component = instance.constructor.name
    this.components[component] = instance
    this.world.events.publish(EventTypes.ComponentAdded, this, instance)
    return instance
  }

  remove = <T extends ComponentType>(component: Constructor<T>): void => {
    // Remove component data by removing the reference to it
    const instance = this.components[component.name]
    this.world.events.publish(EventTypes.ComponentRemoved, this, instance)
    delete this.components[component.name]
  }

  removeAllComponent() {
    const { components } = this
    Object.keys(components).forEach((key) => {
      const component = components[key]
      this.world.events.publish(EventTypes.ComponentRemoved, this, component)
      delete this.components[key]
    })
  }

  destroy() {
    this.world.entities.destroy(this.id)
  }
}

export class EntityManager {
  world: World
  entitiesPool: number[] = []
  constructor(world: World) {
    this.world = world
  }

  create() {
    let id: number
    if (this.entitiesPool.length > 0) {
      id = this.entitiesPool.pop()
    } else {
      id = this.world.counter++
    }
    const ett = new Entity(this.world, id)
    this.world.entitiesMap[ett.id] = ett
    return ett
  }

  // createOrGet(id: number, offset: number) {
  //   const index = id + offset
  //   if (this.valid(index)) {
  //     return this.get(index)
  //   }
  //   if (index >= this.world.counter) {
  //     this.world.counter = index + 1
  //   }
  //   const ett = new Entity(this.world, index)
  //   this.world.entitiesMap[ett.id] = ett
  //   return ett
  // }

  get(index: number) {
    return this.world.entitiesMap[index]
  }

  valid(index: number) {
    return this.world.entitiesMap[index]
  }

  entities_with_components<T extends ComponentType>(
    component: Constructor<T>,
  ): Entity[] {
    return Object.values(this.world.entitiesMap).filter(
      ({ components }) => components[component.name],
    )
  }

  destroy(id: number) {
    const ett = this.world.entitiesMap[id]
    if (ett) {
      ett.removeAllComponent()
    }
    this.entitiesPool.push(id)
    delete this.world.entitiesMap[id]
  }

  reset() {
    Object.values(this.world.entitiesMap).forEach((ett) => {
      ett.destroy()
    })
  }
}
