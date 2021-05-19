import { add, lusolve, matrix, round, zeros } from "mathjs";
import ComponentFactory from "./components/ComponentFactory";

const trabalho1 = `R_R2 2 4 2
R_R1 0 1 1
R_R3 3 1 3
R_R4 2 0 4
V_V1 1 4 DC 6
R_R5 5 0 5
G_G1 0 2 5 0 1
E_E1 3 5 1 0 1
I_I1 2 5 DC 7`;

const p1e1 = `I_ig 1 0 COS (0 10 500 0 0 2.61799 0)
C_C1 1 0 0.0000025
H_H1 2 1 1 0 10
L_L1 2 3 0.001
R_R1 3 0 20`;

const lista1exercicio3a = `V_V1 1 0 DC 1
V_V2 2 3 DC 2
R_R1 0 2 1
R_R2 0 3 2
R_R3 3 1 2
G_G1 1 2 3 0 3`

const lista1exercicio3c = `H_H1 1 4 3 4 10
F_F1 0 1 1 2 2
V_V1 3 0 DC 10
R_R1 2 0 1
R_R2 4 0 2
R_R3 3 2 1`;

// SIN (<nível contínuo> <amplitude> <frequência> <atraso> <atenuação> <ângulo> <ciclos>)
const lista2exercicio1a = `V_V1 1 0 COS (0 10 100 0 0 0 0)
R_R1 1 2 10
C_C1 2 0 10
L_L1 2 3 1
R_R2 3 0 20`

const input = lista2exercicio1a;

const components = input.trim().split('\n').map((line) => {
  const component = ComponentFactory.fromNetlistLine(line);

  return component;
});

const nodeNumbers = new Set();
components.map((c) => {
  c.nodes.map(n => nodeNumbers.add(n.originalNumber));
})

nodeNumbers.delete(0);

let frequency = 0;
components.map(c => c.hasSource ? frequency = c.source.getFrequency() : null);

const originalEquationSize = nodeNumbers.size;
let modifiedEquationSize = originalEquationSize;
components.map((c) => {
  modifiedEquationSize += c.addedDimensions;
});

let conductanceMatrix = matrix(zeros([
  modifiedEquationSize,
  modifiedEquationSize,
]));
let currentVector = matrix(zeros([modifiedEquationSize, 1]));
let currentExtraIndex = originalEquationSize - 1;
const labels = [];
for (let i = 1; i <= originalEquationSize; i++) {
  labels.push(`Node ${i+1} (V)`);
}
components.forEach((c, i) => {
  for (let ci = 0; ci < c.addedDimensions; ci++) {
    labels.push(`${c.name} (A)`);
  }

  currentExtraIndex = currentExtraIndex + c.addedDimensions;

  const componentConductanceMatrix = c.conductanceMatrix(
    modifiedEquationSize,
    currentExtraIndex,
    frequency
  );

  const componentCurrentVector = c.currentSourceVector(
    modifiedEquationSize,
    currentExtraIndex
  );

  // @ts-ignore
  conductanceMatrix = add(conductanceMatrix, componentConductanceMatrix);
  // @ts-ignore
  currentVector = add(currentVector, componentCurrentVector);
})

// console.table(conductanceMatrix.toArray());
// console.table(currentVector.toArray());

const voltageVector = lusolve(conductanceMatrix, currentVector);

// @ts-ignore
console.table(voltageVector.toArray().reduce(
  (p, e, i) => {
    const re = round((e[0].re + Number.EPSILON) * 1000000000) / 1000000000;
    const im = round((e[0].im + Number.EPSILON) * 1000000000) / 1000000000;

    const label = labels[i];
    p[label] = `${re} ${im}i`;

    return p;
  }, []
));


// Básico

// Resistor:  R<nome> <nó+> <nó-> <resistência> ou <polinômio>
// VCCS:      G<nome> <io+> <io-> <vi+> <vi-> <transcondutância> ou <polinômio>
// VCVC:      E<nome> <vo+> <vo-> <vi+> <vi-> <ganho de tensão> ou <polinômio>
// CCCS:      F<nome> <io+> <io-> <ii+> <ii-> <ganho de corrente> ou <polinômio>
// CCVS:      H<nome> <vo+> <vo-> <ii+> <ii-> <transresistência> ou <polinômio>
// Fonte I:   I<nome> <io+> <io-> <tipo de fonte>
// Fonte V:   V<nome> <vo+> <vo-> <tipo de fonte>
// Capacitor: C<nome> <nó+> <nó-> <capacitância> [IC=<tensão inicial>]
// Indutor:   L<nome> <nó+> <nó-> <indutância> [IC=<corrente inicial>]
// Diodo:     D<nome> <nó+> <nó-> <Is> <VT> ou [Vd]
// Trans. BJT:Q<nome> <nóc> <nób> <nóe> <tipo> [<alfa> <alfar> <Isbe> <VTbe> <Isbc> <VTbc> <VA>]
// Amp. op.:  O<nome> <vo1> <vo2> <vi1> <vi2>
// Trans. MOS:M<nome> <nód> <nóg> <nós> <nób> <tipo> [L=<comprimento> W=<largura>] [<K> <VT0> <Lambda>
// <Gama> <Fi> <Ld>]
// Indutor 1: X<nome> <nó+> <nó-> <indutância> [IC=<corrente inicial>]
// Indutância mútua: K<nome> <L1> <L2> <coeficiente de acoplamento>
// Transformador ideal: K<nome> <nó1+> <nó1-> <nó2+> <nó2-> <relação de espiras>
// Chave:     S<nome> <nó+> <nó-> <nóctrl+> <nóctrl-> <gon> <goff> <vref> <deltav> ou <vref>
// Chave dupla: P<nome> <nó1> <nó2> <nó comum> <nóctrl> <gon> <goff> <vref> <deltav> ou <vref>
// Resistor não linear por partes: N<nome> <nó+> <nó-> <4 pontos vi ji >
// Capacitor controlado a tensão: B<nome> <nó+> <nó-> <controle+> <controle-> <capacitância por tensão>
// [IC=<carga inicial>]
// Multiplicador de tensão: &<nome> <vo+> <vo-> <ei1> <ei2> <ganho>
// Divisor de tensão: /<nome> <vo+> <vo-> <ei1> <ei2> <ganho>
// Girador:   Y<nome> <nó1+> <nó1-> <nó2+> <nó2-> <resistência de giração>
// Inversor:  ><nome> <nóentrada> <nósaída> <Parâmetros>
// AND:       )<nome> <nósaída> <nóentrada> <nóentrada> <Parâmetros>
// NAND:      (<nome> <nóentrada> <nóentrada> <nósaída> <Parâmetros>
// OR:        }<nome> <nóentrada> <nóentrada> <nósaída> <Parâmetros>
// NOR        {<nome> <nóentrada> <nóentrada> <nósaída> <Parâmetros>
// XOR:       ]<nome> <nóentrada> <nóentrada> <nósaída> <Parâmetros>
// NXOR:      [<nome> <nóentrada> <nóentrada> <nósaída> <Parâmetros>
// Flip-Flop D: %<nome> <nóQ+> <nóQ-> <nóD> <nóCk> [!<nome sr>] <Parâmetros>
// Extensor s/r: !<nome> <nóS> <nóR> <V> <Cin>
// Monoestável: @<nome> <nóQ+> <nóQ-> <nóT> <nóR> <Parâmetros> <tempo>

// Avançado


// Tipos de fonte "V" ou "I":
// DC <valor>
// SIN (<nível contínuo> <amplitude> <frequência> <atraso> <atenuação> <ângulo> <ciclos>)
// PULSE (<amplitude inicial> <amplitude final> <atraso> <tempo de subida>
// <tempo de descida> <tempo ligada> <período> <número de ciclos>)
// NOISE <amplitude>
