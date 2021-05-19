import { Matrix, matrix, zeros } from "mathjs";
import MatrixHelper from "../helpers/MatrixHelper";
import Node from "../Node";
import Component from "./Component";

export default class CurrentControlledVoltageSource implements Component {
  readonly name: string;
  readonly nodes: Node[];
  readonly addedDimensions = 2;
  readonly hasSource = false;
  readonly source = null;

  private positiveNode: Node;
  private negativeNode: Node;
  private iPositiveNode: Node;
  private iNegativeNode: Node;
  private transresistance: number;

  public constructor(
    name: string,
    positiveNode: Node,
    negativeNode: Node,
    iPositiveNode: Node,
    iNegativeNode: Node,
    transresistance: number,
  ) {
    this.name = name;
    this.positiveNode = positiveNode;
    this.negativeNode = negativeNode;
    this.iPositiveNode = iPositiveNode;
    this.iNegativeNode = iNegativeNode;
    this.transresistance = transresistance;

    this.nodes = [
      positiveNode,
      negativeNode,
      iPositiveNode,
      iNegativeNode,
    ];
  }

  public conductanceMatrix(
    equationSize: number,
    extraIndex: number,
  ): Matrix {
    const conductanceMatrix = matrix(zeros([equationSize, equationSize]));

    const positive = this.positiveNode.matrixNumber();
    const negative = this.negativeNode.matrixNumber();
    const iPositive = this.iPositiveNode.matrixNumber();
    const iNegative = this.iNegativeNode.matrixNumber();

    if (this.iPositiveNode.isNotGround()) {
      MatrixHelper.addValue(
        conductanceMatrix,
        [iPositive, extraIndex - 1],
        +1
      );

      MatrixHelper.addValue(
        conductanceMatrix,
        [extraIndex - 1, iPositive],
        -1
      );
    }

    if (this.iNegativeNode.isNotGround()) {
      MatrixHelper.addValue(
        conductanceMatrix,
        [iNegative, extraIndex - 1],
        -1
      );

      MatrixHelper.addValue(
        conductanceMatrix,
        [extraIndex - 1, iNegative],
        +1
      );
    }

    if (this.positiveNode.isNotGround()) {
      MatrixHelper.addValue(
        conductanceMatrix,
        [positive, extraIndex],
        +1
      );

      MatrixHelper.addValue(
        conductanceMatrix,
        [extraIndex, positive],
        -1
      );
    }

    if (this.negativeNode.isNotGround()) {
      MatrixHelper.addValue(
        conductanceMatrix,
        [negative, extraIndex],
        -1
      );

      MatrixHelper.addValue(
        conductanceMatrix,
        [extraIndex, negative],
        +1,
      );
    }

    MatrixHelper.addValue(
      conductanceMatrix,
      [extraIndex, extraIndex - 1],
      this.transresistance,
    );

    return conductanceMatrix;
  }

  public currentSourceVector(
    equationSize: number,
    currentExtraIndex: number,
  ): Matrix {
    return matrix(zeros([equationSize, 1]));
  }
}

