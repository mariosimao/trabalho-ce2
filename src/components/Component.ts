import { Matrix } from 'mathjs';
import Node from '../Node';
import Source from '../source/Source';

export default interface Component {
  name: string;
  nodes: Node[];
  addedDimensions: number;
  hasSource: boolean;
  source: Source | null;

  conductanceMatrix(
    equationSize: number,
    currentExtraIndex: number,
    frequency: number,
  ): Matrix;

  currentSourceVector(
    equationSize: number,
    currentExtraIndex: number,
  ): Matrix;
}
