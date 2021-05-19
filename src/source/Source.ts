import { Complex } from "mathjs";

export default interface Source {
  getAmplitude(): number;
  getFrequency(): number;
  getAngle(): number;
  getComplex(): Complex;
}
