import { complex, Complex } from "mathjs";
import Source from "./Source";

export default class DCSource implements Source {
  private amplitude: number;

  public constructor(amplitude: number) {
    this.amplitude = amplitude;
  }

  public getAmplitude(): number {
    return this.amplitude;
  }

  public getFrequency(): number {
    return 0;
  }

  public getAngle(): number {
    return 0;
  }

  public getComplex(): Complex {
    return complex(this.amplitude, 0);
  }
}
