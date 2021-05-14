import Source from "./Source";

export default class SinSource implements Source {
  private amplitude: number;
  private frequency: number;
  private angle: number;

  public constructor(
    amplitude: number,
    frequency: number,
    angle: number,
  ) {
    this.amplitude = amplitude;
    this.frequency = frequency;
    this.angle = angle;
  }

  public getAmplitude(): number {
    return this.amplitude;
  }

  public getFrequency(): number {
    return this.frequency;
  }

  public getAngle(): number {
    return this.angle;
  }
}
