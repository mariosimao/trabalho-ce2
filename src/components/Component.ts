import { Matrix } from 'mathjs';

export default interface Component {
  conductanceMatrix(
    equationSize: number,
    currentExtraDimension: number,
  ): Matrix;

  currentSourceVector(
    equationSize: number,
    currentExtraDimension: number,
  ): Matrix;

  dimensionsAdded(): number;
}
