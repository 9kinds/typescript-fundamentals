import { HasEmail } from "./1-basics";

/**
 * (1) Generics allow us to parameterize types in the same way that
 * -   functions parameterize values
 */

// param determines the value of x
function wrappedValue(x: any) {
  return {
    value: x
  };
}

// type param determines the type of x
interface WrappedValue<X> {
  value: X;
}

let val: WrappedValue<string[]> = { value: [] };
val.value;

/**
 * we can name these params whatever we want, but a common convention
 * is to use capital letters starting with `T` (a C++ convention from "templates")
 */

/**
 * (2) Type parameters can have default types
 * -   just like function parameters can have default values
 */

// for Array.prototype.filter
interface FilterFunction<T = any> {
  (val: T): boolean;
}

const stringFilter: FilterFunction<string> = val => typeof val === "string";
stringFilter(0); // 🚨 ERROR
stringFilter("abc"); // ✅ OK

// can be used with any value
const truthyFilter: FilterFunction = val => !!val;
truthyFilter(0); // false
truthyFilter(1); // true
truthyFilter(""); // false
truthyFilter(["abc"]); // true

/**
 * (3) You don't have to use exactly your type parameter as an arg
 * -   things that are based on your type parameter are fine too
 */

function resolveOrTimeout<T>(promise: Promise<T>, timeout: number): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    // start the timeout, reject when it triggers
    const task = setTimeout(() => reject("time up!"), timeout);

    promise.then(val => {
      // cancel the timeout
      clearTimeout(task);

      // resolve with the value
      resolve(val);
    });
  });
}
resolveOrTimeout(fetch(""), 3000);

/**
 * (4) Type parameters can have constraints
 */

function arrayToDict<T extends { id: string }>(array: T[]): { [k: string]: T } {
  const out: { [k: string]: T } = {};
  array.forEach(val => {
    out[val.id] = val;
  });
  return out;
}
let values: {id: string, name: string}[] = [];

let out = arrayToDict(values).foo.;

// const myDict = arrayToDict([
//   { id: "a", value: "first", lisa: "Huang" },
//   { id: "b", value: "second" }
// ]);

/**
 * (5) Type parameters are associated with scopes, just like function arguments
 */

function startTuple<T>(a: T) {
  return function finishTuple<U>(b: U) {
    return [a, b] as [T, U];
  };
}
const myTuple = startTuple(["first"])(42);

/**
 * (6) When to use generics
 *
 * - Generics are necessary when we want to describe a relationship between
 * - two or more types (i.e., a function argument and return type).
 *
 * - aside from interfaces and type aliases, If a type parameter is used only once
 * - it can probably be eliminated
 */

interface Shape {
  draw();
}
interface Circle extends Shape {
  radius: number;
}

function drawShapes1<S extends Shape>(shapes: S[]): S[] {
  return shapes.map(s => {
      s.draw();
      return s;
  });
}

let circles: Circle[] = [];
// drawShapes1(circles).map(c => c.

function drawShapes2(shapes: Shape[]) {
  // this is simpler. Above type param is not necessary
  shapes.forEach(s => s.draw());
}

async function getRecord<T>(url): Promise<T> {
    const returnVal = await (await fetch(url)).json();
    return returnVal;
}
getRecord<Circle>('http://shape.me/circle').then(c => c.radius);