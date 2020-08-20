# TypeScript要点

## Interfaces vs Types区别

### 1. Objects / Functions-对象/函数

两者都可以用来描述对象的形状或函数签名。但是语法不同。

Interface

```typescript
interface Point {
  x: number;
  y: number;
}

interface SetPoint {
  (x: number, y: number): void;
}
```

Type alias

```typescript
type Point = {
  x: number;
  y: number;
};

type SetPoint = (x: number, y: number) => void;
```

### 2. Other Types-其它类型

与接口不同，类型别名还可以用于其他类型，如基本、联合和元组。

```typescript
// primitive
type Name = string;

// object
type PartialPointX = { x: number; };
type PartialPointY = { y: number; };

// union
type PartialPoint = PartialPointX | PartialPointY;

// tuple
type Data = [number, string];
```

### 3. Extend-继承

两者都可以继承，但是语法不同。另外，请注意接口和类型别名并不是互斥的。接口可以扩展类型别名，反之亦然。

Interface extends interface

```typescript
interface PartialPointX { x: number; }
interface Point extends PartialPointX { y: number; }
```

Type alias extends type alias

```typescript
type PartialPointX = { x: number; };
type Point = PartialPointX & { y: number; };
```

Interface extends type alias

```typescript
type PartialPointX = { x: number; };
interface Point extends PartialPointX { y: number; }
```

Type alias extends interface

```typescript
interface PartialPointX { x: number; }
type Point = PartialPointX & { y: number; };
```

### Implements-实现

类可以以完全相同的方式实现接口或类型别名。请注意，类和接口被认为是静态模板。因此，它们不能实现/扩展命名联合类型的类型别名。

```typescript
interface Point {
  x: number;
  y: number;
}

class SomePoint implements Point {
  x = 1;
  y = 2;
}

type Point2 = {
  x: number;
  y: number;
};

class SomePoint2 implements Point2 {
  x = 1;
  y = 2;
}

type PartialPoint = { x: number; } | { y: number; };

// FIXME: can not implement a union type
class SomePartialPoint implements PartialPoint {
  x = 1;
  y = 2;
}
```

### 5. Declaration merging-声明合并

与类型别名不同，接口可以定义多次，并将被视为单个接口(合并了所有声明的成员)。

```typescript
interface Point { x: number; }
interface Point { y: number; }

const point: Point = { x: 1, y: 2 };
```
