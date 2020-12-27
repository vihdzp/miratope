import { Matrix } from "./matrix";

export class Flag<T> {
  number: number;
  element: [T, Matrix];

  constructor(number: number, element: [T, Matrix]) {
    this.number = number;
    this.element = element;
  }

  toString(): string {
    return this.number + "," + this.element;
  }
}

export type Simplifier<T> = { [key: string]: Flag<T> };
export type FlagClass = [number, number[]][];
