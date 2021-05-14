import Node from "../Node";
import SourceFactory from "../source/SourceFactory";
import Component from "./Component";
import CurrentSource from "./CurrentSource";
import Resistor from "./Resistor";

export default class ComponentFactory {
  public static fromNetlistLine(line: string): Component {
    const values = line.trim().split(' ');

    switch (line[0]) {
      case 'R':
        return Resistor.fromNetlist(line);
      case 'I':
        const source = SourceFactory.fromString(line);

        return new CurrentSource(
          values[0],
          new Node(parseInt(values[1])),
          new Node(parseInt(values[2])),
          source,
        )
      default:
        break;
    }
  }
}
