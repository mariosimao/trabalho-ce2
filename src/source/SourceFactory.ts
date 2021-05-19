import DCSource from "./DCSource";
import CosSource from "./CosSource";
import Source from "./Source";

export default class SourceFactory {
  public static fromString(line: string): Source {
    const values = line.trim().split(' ');

    switch (values[0]) {
      case 'DC':
        const dcAmplitude = parseFloat(values[1]);
        return new DCSource(dcAmplitude);
      case 'COS':
        const cosAmplitude = parseFloat(values[2]);
        const cosFrequency = parseFloat(values[3]);
        const cosAngle = parseFloat(values[6])

        return new CosSource(cosAmplitude, cosFrequency, cosAngle);
      default:
        throw new Error("Could not parse source");
    }
  }
}
