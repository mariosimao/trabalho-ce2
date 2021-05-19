import { complex, Complex } from "mathjs";
import Source from "./Source";

export default class CosSource implements Source {
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

  public getComplex(): Complex {
    return complex({
      r: this.amplitude,
      phi: this.angle,
    })
  }
}
