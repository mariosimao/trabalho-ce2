import { matrix, Matrix, zeros } from 'mathjs';
import Component from './Component';
import Node from '../Node';
import MatrixHelper from '../helpers/MatrixHelper';

export default class IdealTransformer implements Component {
  readonly name: string;
  readonly nodes: Node[];
  readonly addedDimensions = 1;
  readonly hasSource = false;
  readonly source = null;

  private positiveNode1: Node;
  private negativeNode1: Node;
  private positiveNode2: Node;
  private negativeNode2: Node;
  private relation: number;

  constructor(
    name: string,
    positiveNode1: Node,
    negativeNode1: Node,
    positiveNode2: Node,
    negativeNode2: Node,
    relation: number,
  ) {
    this.name = name;
    this.positiveNode1 = positiveNode1;
    this.negativeNode1 = negativeNode1;
    this.relation = relation;

    this.nodes = [
      positiveNode1,
      negativeNode1,
      positiveNode2,
      negativeNode2,
    ];
  }

  conductanceMatrix(
    equationSize: number,
    currentExtraIndex: number,
    frequency: number,
  ): Matrix {
    const conductanceMatrix = matrix(zeros([equationSize, equationSize]));

    const positive1 = this.positiveNode1.matrixNumber();
    const negative1 = this.negativeNode1.matrixNumber();
    const positive2 = this.positiveNode2.matrixNumber();
    const negative2 = this.negativeNode2.matrixNumber();

    if (this.positiveNode1.isNotGround()) {
      MatrixHelper.addValue(
        conductanceMatrix,
        [positive1, currentExtraIndex],
        - this.relation,
      );

      MatrixHelper.addValue(
        conductanceMatrix,
        [currentExtraIndex, positive1],
        + this.relation,
      );
    }

    if (this.negativeNode1.isNotGround()) {
      MatrixHelper.addValue(
        conductanceMatrix,
        [negative1, currentExtraIndex],
        + this.relation,
      );

      MatrixHelper.addValue(
        conductanceMatrix,
        [currentExtraIndex, negative1],
        - this.relation,
      );
    }

    if (this.positiveNode2.isNotGround()) {
      MatrixHelper.addValue(
        conductanceMatrix,
        [positive2, currentExtraIndex],
        + 1
      );

      MatrixHelper.addValue(
        conductanceMatrix,
        [currentExtraIndex, positive2],
        - 1
      );
    }

    if (this.negativeNode2.isNotGround()) {
      MatrixHelper.addValue(
        conductanceMatrix,
        [negative2, currentExtraIndex],
        - 1
      );

      MatrixHelper.addValue(
        conductanceMatrix,
        [currentExtraIndex, negative2],
        + 1
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
