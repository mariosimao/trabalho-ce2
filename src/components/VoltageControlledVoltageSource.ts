import { matrix, Matrix, zeros } from "mathjs";
import MatrixHelper from "../helpers/MatrixHelper";
import Node from "../Node";
import Component from "./Component";

export default class VoltageControlledVoltageSource implements Component {
  readonly name: string;
  readonly nodes: Node[];
  readonly addedDimensions = 1;
  readonly hasSource = false;
  readonly source = null;

  private positiveNode: Node;
  private negativeNode: Node;
  private vPositiveNode: Node;
  private vNegativeNode: Node;
  private gain: number;

  public constructor(
    name: string,
    positiveNode: Node,
    negativeNode: Node,
    vPositiveNode: Node,
    vNegativeNode: Node,
    gain: number,
  ) {
    this.name = name;
    this.positiveNode = positiveNode;
    this.negativeNode = negativeNode;
    this.vPositiveNode = vPositiveNode;
    this.vNegativeNode = vNegativeNode;
    this.gain = gain;

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
        +1
      );
    }

    if (this.vPositiveNode.isNotGround()) {
      MatrixHelper.addValue(
        conductanceMatrix,
        [extraIndex, vPositive],
        + this.gain
      );
    }

    if (this.vNegativeNode.isNotGround()) {
      MatrixHelper.addValue(
        conductanceMatrix,
        [extraIndex, vNegative],
        -this.gain
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

