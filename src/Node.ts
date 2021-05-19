export default class Node {
  originalNumber: number;

  constructor(nodeNumber: number) {
    this.originalNumber = nodeNumber;
  }

  isGround(): boolean {
    return this.originalNumber === 0;
  }

  isNotGround(): boolean {
    return !this.isGround();
  }

  matrixNumber(): number {
    return this.originalNumber - 1;
  }
}
