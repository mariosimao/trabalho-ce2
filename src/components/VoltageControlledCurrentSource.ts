import { Matrix, matrix, zeros } from "mathjs";
import MatrixHelper from "../helpers/MatrixHelper";
import Node from "../Node";
import Component from "./Component";

export default class VoltageControlledCurrentSource implements Component {
  readonly name: string;
  readonly nodes: Node[];
  readonly addedDimensions = 0;
  readonly hasSource = false;
  readonly source = null;

  private positiveNode: Node;
  private negativeNode: Node;
  private vPositiveNode: Node;
  private vNegativeNode: Node;
  private transconductance: number;

  public constructor(
    name: string,
    positiveNode: Node,
    negativeNode: Node,
    vPositiveNode: Node,
    vNegativeNode: Node,
    transconductance: number,
  ) {
    this.name = name;
    this.positiveNode = positiveNode;
    this.negativeNode = negativeNode;
    this.vPositiveNode = vPositiveNode;
    this.vNegativeNode = vNegativeNode;
    this.transconductance = transconductance;

    this.nodes = [
      positiveNode,
      negativeNode,
      vPositiveNode,
      vNegativeNode,
    ];
  }

  public conductanceMatrix(
    equationSize: number,
    currentExtraIndex: number,
  ): Matrix {
    const conductanceMatrix = matrix(zeros([equationSize, equationSize]));

    const positive = this.positiveNode.matrixNumber();
    const negative = this.negativeNode.matrixNumber();
    const vPositive = this.vPositiveNode.matrixNumber();
    const vNegative = this.vNegativeNode.matrixNumber();

    if (this.positiveNode.isNotGround() && this.vPositiveNode.isNotGround()) {
      MatrixHelper.addValue(
        conductanceMatrix,
        [positive, vPositive],
        + this.transconductance
      );
    }

    if (this.positiveNode.isNotGround() && this.vNegativeNode.isNotGround()) {
      MatrixHelper.addValue(
        conductanceMatrix,
        [positive, vNegative],
        - this.transconductance);
    }

    if (this.negativeNode.isNotGround() && this.vPositiveNode.isNotGround()) {
      MatrixHelper.addValue(
        conductanceMatrix,
        [negative, vPositive],
        - this.transconductance
      );
    }

    if (this.negativeNode.isNotGround() && this.vNegativeNode.isNotGround()) {
      MatrixHelper.addValue(
        conductanceMatrix,
        [negative, vNegative],
        - this.transconductance
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

