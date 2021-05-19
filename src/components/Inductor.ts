import { Complex, complex, matrix, Matrix, zeros } from 'mathjs';
import Component from './Component';
import Node from '../Node';
import MatrixHelper from '../helpers/MatrixHelper';

export default class Inductor implements Component {
  readonly name: string;
  readonly nodes: Node[];
  readonly addedDimensions = 1;
  readonly hasSource = false;
  readonly source = null;

  private positiveNode: Node;
  private negativeNode: Node;
  private inductance: number;

  constructor(
    name: string,
    positiveNode: Node,
    negativeNode: Node,
    inductance: number,
  ) {
    this.name = name;
    this.positiveNode = positiveNode;
    this.negativeNode = negativeNode;
    this.inductance = inductance;

    this.nodes = [positiveNode, negativeNode];
  }

  private impedance(frequency: number): Complex {
    return complex(0, frequency * this.inductance);
  }

  conductanceMatrix(
    equationSize: number,
    extraIndex: number,
    frequency: number,
  ): Matrix {
    const conductanceMatrix = matrix(zeros([equationSize, equationSize]));

    const positive = this.positiveNode.matrixNumber();
    const negative = this.negativeNode.matrixNumber();

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

    MatrixHelper.addValue(
      conductanceMatrix,
      [extraIndex, extraIndex],
      this.impedance(frequency)
    );

    return conductanceMatrix;
  }

  currentSourceVector(
    equationSize: number,
    currentExtraIndex: number,
  ): Matrix {
    return  matrix(zeros([equationSize, 1]));
  }
}
