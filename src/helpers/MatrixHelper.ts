import { add, Matrix } from "mathjs";

export default class MatrixHelper {
  public static addValue(
    matrix: Matrix,
    indexes: number[],
    value: any
  ): Matrix {
    const newValue = add(matrix.get(indexes), value);
    matrix.set(indexes, newValue);

    return matrix;
  }
}
