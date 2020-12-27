import Point from "../geometry/point";

//A class for matrices.
export default class Matrix {
  els: number[][];

  constructor(els: number[][]) {
    this.els = els;
  }

  toString(): string {
    return JSON.stringify(this.els);
  }

  width(): number {
    return this.els[0].length;
  }

  height(): number {
    return this.els.length;
  }

  static identity(size: number): Matrix {
    const entries: number[][] = [];
    for (let i = 0; i < size; i++) {
      const row: number[] = [];
      for (let j = 0; j < size; j++) row.push(i === j ? 1 : 0);
      entries.push(row);
    }
    return new Matrix(entries);
  }

  //This uses column vectors and IDK if that's consistent with three.js
  movePoint(point: Point): Point {
    const newCoordinates: number[] = [];
    if (this.width() != point.dimensions())
      throw new Error("Invalid dimensions for matrix-vector multiplication!");
    for (let i = 0; i < this.height(); i++) {
      let currentCoordinate = 0;
      for (let j = 0; j < this.width(); j++)
        currentCoordinate += this.els[i][j] * point.coordinates[j];
      newCoordinates.push(currentCoordinate);
    }
    return new Point(newCoordinates);
  }

  inverse(): Matrix {
    throw new Error("Matrix.inverse is not yet implemented");
  }

  //Todo: if the matrices get large, maybe implement a better algorithm?
  multiply(matrix: Matrix): Matrix {
    const newEntries: number[][] = [];
    if (this.width() != matrix.height())
      throw new Error("Invalid dimensions for matrix multiplication!");
    for (let i = 0; i < this.height(); i++) {
      const newRow: number[] = [];
      for (let j = 0; j < matrix.width(); j++) {
        let newEntry = 0;
        for (let k = 0; k < this.width(); k++)
          newEntry += this.els[i][k] * matrix.els[k][j];
        newRow.push(newEntry);
      }
      newEntries.push(newRow);
    }
    return new Matrix(newEntries);
  }

  //-1 is this<matrix, 0 is this==matrix, 1 is this>matrix
  compare(matrix: Matrix): number {
    if (this.width() != matrix.width() || this.height() != matrix.height())
      throw new Error("Invalid dimensions for matrix comparison!");
    for (let i = 0; i < this.height(); i++) {
      for (let j = 0; j < this.width(); j++) {
        if (this.els[i][j] > matrix.els[i][j]) return 1;
        if (this.els[i][j] < matrix.els[i][j]) return -1;
      }
    }
    return 0;
  }
}
