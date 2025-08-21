# entityx-ts

`entityx-ts` is an Entity Component System (ECS) library for TypeScript, designed for high performance and flexibility.  
It is used in projects like [safex-pixi](https://github.com/Safe-engine/safex-pixi) for game and interactive application development.

## Installation

```bash
npm install entityx-ts
```

## Basic Usage

### 1. Create an Entity

```ts
import { World } from 'entityx-ts';

const world = new World();
const entity = world.entities.create();
```

### 2. Define Components

```ts
class Position {
    constructor(public x: number, public y: number) {}
}

class Velocity {
    constructor(public dx: number, public dy: number) {}
}
```

### 3. Add Components to Entities

```ts
entity.assign(new Position(0, 0));
entity.assign(new Velocity(1, 1));
```

### 4. Create Systems

```ts
class MovementSystem {
    update(world: World) {
        for (const entity of entities.entities_with_components(Position, Velocity)) {
            const pos = entity.getComponent(Position);
            const vel = entity.getComponent(Velocity);
            pos.x += vel.dx;
            pos.y += vel.dy;
        }
    }
}
```

### 5. Run the World

```ts


function gameLoop() {
    const movementSystem = world.systems.get(MovementSystem);
    movementSystem.update(dt);
    requestAnimationFrame(gameLoop);
}

gameLoop();
```

## Integration with safex-pixi

`safex-pixi` uses `entityx-ts` to manage game entities and components, enabling scalable and maintainable game logic.  
Refer to [safex-pixi](https://github.com/Safe-engine/safex-pixi) for advanced usage and integration examples.

## Resources

- [API Documentation](https://github.com/Safe-engine/entityx-ts)
- [safex-pixi Example](https://github.com/Safe-engine/safex-pixi)
