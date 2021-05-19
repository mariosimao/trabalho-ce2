import { complex, Matrix, matrix, zeros } from 'mathjs';
import MatrixHelper from '../helpers/MatrixHelper';
import Node from '../Node';
import Source from '../source/Source';
import Component from './Component';

export default class VoltageSource implements Component {
  readonly name: string;
  readonly nodes: Node[];
  readonly addedDimensions = 1;
  readonly hasSource = true;
  readonly source: Source;

  private positiveNode: Node;
  private negativeNode: Node;

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

    this.nodes = [positiveNode, negativeNode];
  }

  conductanceMatrix(
    equationSize: number,
    currentExtraIndex: number,
  ): Matrix {
    const conductanceMatrix = matrix(zeros([equationSize, equationSize]));

    const extraIndex = currentExtraIndex;

    const positiveNode = this.positiveNode.matrixNumber();
    const negativeNode = this.negativeNode.matrixNumber();

    if (this.positiveNode.isNotGround()) {
      MatrixHelper.addValue(
        conductanceMatrix,
        [positiveNode, extraIndex],
        +1
      );
      MatrixHelper.addValue(
        conductanceMatrix,
        [extraIndex, positiveNode],
        -1
      );
    }

    if (this.negativeNode.isNotGround()) {
      MatrixHelper.addValue(
        conductanceMatrix,
        [negativeNode, extraIndex],
        -1
      );
      MatrixHelper.addValue(
        conductanceMatrix,
        [extraIndex, negativeNode],
        +1
      );
    }

    return conductanceMatrix;
  }

  currentSourceVector(
    equationSize: number,
    currentExtraIndex: number,
  ): Matrix {
    const vector = matrix(zeros([equationSize, 1]));

    const extraIndex = currentExtraIndex;

    MatrixHelper.addValue(
      vector,
      [extraIndex, 0],
      // @ts-ignore
      complex(
        -this.source.getComplex().re,
        -this.source.getComplex().im,
      )
    )

    return vector;
  }
}
