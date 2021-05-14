import Resistor from "./components/Resistor";

const input = 'R_R2 2 4 2';

const component = Resistor.fromNetlist(input);

console.log(component.conductanceMatrix());

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
