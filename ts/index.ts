interface Point {
  x: number;
  y: number;
}

// type keys = "x" | "y"
type keys = keyof Point;

function get<T extends object, K extends keyof T>(o: T, name: K): T[K] {
  return o[name];
}

const obj = {
  a: 1,
  b: 2,
};

get(obj, "a");

type Partial1<T> = {
  [P in keyof T]?: T[P];
};

type Required1<T> = {
  [P in keyof T]-?: T[P];
};

type Pick1<T, K extends keyof T> = {
  [P in K]: T[P];
};
