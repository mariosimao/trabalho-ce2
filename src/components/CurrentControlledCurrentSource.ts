import { Matrix, matrix, zeros } from "mathjs";
import MatrixHelper from "../helpers/MatrixHelper";
import Node from "../Node";
import Component from "./Component";

export default class CurrentControlledCurrentSource implements Component {
  readonly name: string;
  readonly nodes: Node[];
  readonly addedDimensions = 1;
  readonly hasSource = false;
  readonly source = null;

  private positiveNode: Node;
  private negativeNode: Node;
  private iPositiveNode: Node;
  private iNegativeNode: Node;
  private gain: number;

  public constructor(
    name: string,
    positiveNode: Node,
    negativeNode: Node,
    iPositiveNode: Node,
    iNegativeNode: Node,
    gain: number,
  ) {
    this.name = name;
    this.positiveNode = positiveNode;
    this.negativeNode = negativeNode;
    this.iPositiveNode = iPositiveNode;
    this.iNegativeNode = iNegativeNode;
    this.gain = gain;

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

    if (this.positiveNode.isNotGround()) {
      MatrixHelper.addValue(
        conductanceMatrix,
        [positive, extraIndex],
        +this.gain
      );
    }

    if (this.negativeNode.isNotGround()) {
      MatrixHelper.addValue(
        conductanceMatrix,
        [negative, extraIndex],
        -this.gain,
      );
    }

    if (this.iPositiveNode.isNotGround()) {
      MatrixHelper.addValue(
        conductanceMatrix,
        [iPositive, extraIndex],
        +1,
      );

      MatrixHelper.addValue(
        conductanceMatrix,
        [extraIndex, iPositive],
        -1,
      );
    }

    if (this.iNegativeNode.isNotGround()) {
      MatrixHelper.addValue(
        conductanceMatrix,
        [iNegative, extraIndex],
        -1,
      );

      MatrixHelper.addValue(
        conductanceMatrix,
        [extraIndex, iNegative],
        +1,
      );
    }

    return conductanceMatrix;
  }

  public currentSourceVector(
    equationSize: number,
    currentExtraIndex: number,
  ): Matrix {
    return matrix(zeros([equationSize, 1]));
  }
}

