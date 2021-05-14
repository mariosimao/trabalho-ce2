import { Matrix, matrix } from 'mathjs';
import Node from '../Node';
import Source from '../source/Source';
import Component from './Component';

export default class CurrentSource implements Component {
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

  conductanceMatrix(): Matrix {
    return matrix();
  }

  currentSourceVector(): Matrix {
    const vector = matrix();

    const positiveNode = this.positiveNode.matrixNumber();
    const negativeNode = this.negativeNode.matrixNumber();

    if (this.positiveNode.isNotGround()) {
      vector.set(
        [positiveNode, 0],
        (-1) * this.source.getAmplitude(),
      );
    }

    if (this.negativeNode.isNotGround()) {
      vector.set(
        [negativeNode, 0],
        this.source.getAmplitude(),
      );
    }

    return vector;
  }

  dimensionsAdded(): number {
    return 0;
  }
}
