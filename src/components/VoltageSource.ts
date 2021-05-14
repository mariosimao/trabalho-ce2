import { Matrix, matrix } from 'mathjs';
import Node from '../Node';
import Source from '../source/Source';
import Component from './Component';

export default class VoltageSource implements Component {
  private name: string;
  private positiveNode: Node;
  private negativeNode: Node;
  private source: Source;

  public constructor(
    name: string,
    positiveNode: Node,
    negativeNode: Node,
    source: Source,
  ) {
    this.name = name;
    this.positiveNode = positiveNode;
    this.negativeNode = negativeNode;
    this.source = source;
  }

  conductanceMatrix(
    equationSize: number,
    currentExtraDimension: number,
  ): Matrix {
    const conductanceMatrix = matrix([equationSize, equationSize]);

    const extraDimension = currentExtraDimension + 1;

    const positiveNode = this.positiveNode.matrixNumber();
    const negativeNode = this.negativeNode.matrixNumber();

    if (this.positiveNode.isNotGround()) {
      conductanceMatrix.set([positiveNode, extraDimension], 1);
      conductanceMatrix.set([extraDimension, positiveNode], -1);
    }

    if (this.negativeNode.isNotGround()) {
      conductanceMatrix.set([negativeNode, extraDimension], -1);
      conductanceMatrix.set([extraDimension, negativeNode], 1);
    }

    return conductanceMatrix;
  }

  currentSourceVector(
    equationSize: number,
    currentExtraDimension: number,
  ): Matrix {
    const vector = matrix([equationSize, 0]);

    const extraDimension = currentExtraDimension + 1;

    vector.set([extraDimension, 0], this.source.getAmplitude());

    return vector;
  }

  dimensionsAdded(): number {
    return 1;
  }
}
