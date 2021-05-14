import DCSource from "./DCSource";
import SinSource from "./SinSource";
import Source from "./Source";

export default class SourceFactory {
  public static fromString(line: string): Source {
    const values = line.trim().split(' ');

    switch (values[0]) {
      case 'DC':
        const dcAmplitude = parseFloat(values[1]);
        return new DCSource(dcAmplitude);
      case 'SIN':
        const sinAmplitude = parseFloat(values[2]);
        const sinFrequency = parseFloat(values[3]);
        const sinAngle = parseFloat(values[6])

        return new SinSource(sinAmplitude, sinFrequency, sinAngle);
      default:
        break;
    }
  }
}
