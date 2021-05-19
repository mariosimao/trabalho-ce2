import Node from "../Node";
import SourceFactory from "../source/SourceFactory";
import Capacitor from "./Capacitor";
import Component from "./Component";
import CurrentControlledCurrentSource from "./CurrentControlledCurrentSource";
import CurrentControlledVoltageSource from "./CurrentControlledVoltageSource";
import CurrentSource from "./CurrentSource";
import IdealTransformer from "./IdealTransformer";
import Inductor from "./Inductor";
import OperationalAmplifier from "./OperationalAmplifier";
import Resistor from "./Resistor";
import VoltageControlledCurrentSource from "./VoltageControlledCurrentSource";
import VoltageControlledVoltageSource from "./VoltageControlledVoltageSource";
import VoltageSource from "./VoltageSource";

export default class ComponentFactory {
  public static fromNetlistLine(line: string): Component {
    const values = line.trim().split(' ');

    switch (line[0]) {
      case 'R':
        return new Resistor(
          values[0],
          new Node(parseInt(values[1])),
          new Node(parseInt(values[2])),
          parseFloat(values[3]),
        )
      case 'G':
        return new VoltageControlledCurrentSource(
          values[0],
          new Node(parseInt(values[1])),
          new Node(parseInt(values[2])),
          new Node(parseInt(values[3])),
          new Node(parseInt(values[4])),
          parseFloat(values[5]),
        );
      case 'E':
        return new VoltageControlledVoltageSource(
          values[0],
          new Node(parseInt(values[1])),
          new Node(parseInt(values[2])),
          new Node(parseInt(values[3])),
          new Node(parseInt(values[4])),
          parseFloat(values[5]),
        );
      case 'F':
        return new CurrentControlledCurrentSource(
          values[0],
          new Node(parseInt(values[1])),
          new Node(parseInt(values[2])),
          new Node(parseInt(values[3])),
          new Node(parseInt(values[4])),
          parseFloat(values[5]),
        );
      case 'H':
        return new CurrentControlledVoltageSource(
          values[0],
          new Node(parseInt(values[1])),
          new Node(parseInt(values[2])),
          new Node(parseInt(values[3])),
          new Node(parseInt(values[4])),
          parseFloat(values[5]),
        );
      case 'I':
        const iSourceArray = [...values];
        iSourceArray.splice(0, 3);
        const iSource = SourceFactory.fromString(iSourceArray.join(' '));

        return new CurrentSource(
          values[0],
          new Node(parseInt(values[1])),
          new Node(parseInt(values[2])),
          iSource,
        );
      case 'V':
        const vSourceArray = [...values];
        vSourceArray.splice(0, 3);
        const vSource = SourceFactory.fromString(vSourceArray.join(' '));

        return new VoltageSource(
          values[0],
          new Node(parseInt(values[1])),
          new Node(parseInt(values[2])),
          vSource,
        );
      case 'C':
        return new Capacitor(
          values[0],
          new Node(parseInt(values[1])),
          new Node(parseInt(values[2])),
          parseFloat(values[3]),
        );
      case 'L':
        return new Inductor(
          values[0],
          new Node(parseInt(values[1])),
          new Node(parseInt(values[2])),
          parseFloat(values[3]),
        );
      case 'O':
        return new OperationalAmplifier(
          values[0],
          new Node(parseInt(values[1])),
          new Node(parseInt(values[2])),
          new Node(parseInt(values[3])),
          new Node(parseInt(values[4])),
        );
      case 'K':
        return new IdealTransformer(
          values[0],
          new Node(parseInt(values[1])),
          new Node(parseInt(values[2])),
          new Node(parseInt(values[3])),
          new Node(parseInt(values[4])),
          parseFloat(values[5]),
        )
      default:
        break;
    }
  }
}
