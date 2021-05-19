import { matrix, zeros } from "mathjs";
import Node from "../Node";
import Resistor from "./Resistor";

function createResistor() {
  return new Resistor(
    'R_R1',
    new Node(0),
    new Node(1),
    1
  );
}

it('should not add extra dimensions to the equation', () => {
  const resistor = createResistor();

  expect(resistor.addedDimensions).toBe(0);
})

it('should not contain current sources', () => {
  const resistor = createResistor();

  expect(resistor.currentSourceVector(3, 0))
    .toStrictEqual(matrix(zeros([3, 0])));
})

it('should not add grounded negative node to equation', () => {
  const resistor = new Resistor(
    'R_R1',
    new Node(0),
    new Node(3),
    2
  );

  expect(resistor.conductanceMatrix(3, 0, 0))
    .toStrictEqual(matrix([
      [0, 0, 0  ],
      [0, 0, 0  ],
      [0, 0, 1/2],
    ]))
})

it('should not add grounded positive node to equation', () => {
  const resistor = new Resistor(
    'R_R1',
    new Node(2),
    new Node(0),
    2
  );

  expect(resistor.conductanceMatrix(3, 0, 0))
    .toStrictEqual(matrix([
      [0, 0  , 0],
      [0, 1/2, 0],
      [0, 0  , 0],
    ]))
})

it('should add conductances to the equation', () => {
  const resistor = new Resistor(
    'R_R1',
    new Node(2),
    new Node(4),
    5
  );

  expect(resistor.conductanceMatrix(4, 0, 0))
    .toStrictEqual(matrix([
      [0, 0   , 0, 0   ],
      [0, 0.2 , 0, -0.2],
      [0, 0   , 0, 0   ],
      [0, -0.2, 0, 0.2 ],
    ]))
})
