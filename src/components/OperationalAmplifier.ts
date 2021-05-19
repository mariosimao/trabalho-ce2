import { matrix, Matrix, zeros } from 'mathjs';
import Component from './Component';
import Node from '../Node';
import MatrixHelper from '../helpers/MatrixHelper';

export default class OperationalAmplifier implements Component {
  readonly name: string;
  readonly nodes: Node[];
  readonly addedDimensions = 1;
  readonly hasSource = false;
  readonly source = null;

  private positiveNode: Node;
  private negativeNode: Node;
  private vPositiveNode: Node;
  private vNegativeNode: Node;

  constructor(
    name: string,
    positiveNode: Node,
    negativeNode: Node,
    vPositiveNode: Node,
    vNegativeNode: Node,
  ) {
    this.name = name;
    this.positiveNode = positiveNode;
    this.negativeNode = negativeNode;
    this.vPositiveNode = vPositiveNode;
    this.vNegativeNode = vNegativeNode;

    this.nodes = [positiveNode, negativeNode, vPositiveNode, vNegativeNode];
  }

  conductanceMatrix(
    equationSize: number,
    currentExtraIndex: number,
    frequency: number,
  ): Matrix {
    const conductanceMatrix = matrix(zeros([equationSize, equationSize]));

    const extraIndex = currentExtraIndex;

    const positive = this.positiveNode.matrixNumber();
    const negative = this.negativeNode.matrixNumber();
    const vPositive = this.vPositiveNode.matrixNumber();
    const vNegative = this.vNegativeNode.matrixNumber();

    if (this.positiveNode.isNotGround()) {
      MatrixHelper.addValue(
        conductanceMatrix,
        [positive, extraIndex],
        +1
      );
    }

    if (this.negativeNode.isNotGround()) {
      MatrixHelper.addValue(
        conductanceMatrix,
        [negative, extraIndex],
        -1
      );
    }

    if (this.vPositiveNode.isNotGround()) {
      MatrixHelper.addValue(
        conductanceMatrix,
        [extraIndex, vPositive],
        +1
      );
    }

    if (this.vNegativeNode.isNotGround()) {
      MatrixHelper.addValue(
        conductanceMatrix,
        [extraIndex, vNegative],
        -1
      );
    }

    return conductanceMatrix;
  }

  currentSourceVector(
    equationSize: number,
    currentExtraIndex: number,
  ): Matrix {
    return  matrix(zeros([equationSize, 1]));
  }
}
