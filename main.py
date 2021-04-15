import numpy as np

stringNetlist = """
R_R2 2 4 2
R_R1 0 1 1
R_R3 3 1 3
R_R4 2 0 4
V_V1 1 4 DC 6
R_R5 5 0 5
G_G1 0 2 5 0 1
E_E1 3 5 1 0 1
I_I1 2 5 DC 7
""".strip().split("\n")

netlist = [row.split() for row in stringNetlist]

def parseResistor(component: list, equation: dict):
    name         = component[0]
    positiveNode = int(component[1]) - 1
    negativeNode = int(component[2]) - 1
    resistance   = float(component[3])

    if (positiveNode != -1):
        equation["G"][positiveNode, positiveNode] += (1/resistance)

    if (negativeNode != -1):
        equation["G"][negativeNode, negativeNode] += (1/resistance)

    if (positiveNode != -1 and negativeNode != -1):
        equation["G"][positiveNode, negativeNode] -= (1/resistance)
        equation["G"][negativeNode, positiveNode] -= (1/resistance)

def parseCurrentSourceDc(component: list, equation: dict):
    name         = component[0]
    leavingNode  = int(component[1]) - 1
    arrivingNode = int(component[2]) - 1
    sourceType   = component[3]
    current      = float(component[4])

    if (leavingNode != -1):
        equation["i"][leavingNode] -= current

    if (arrivingNode != -1):
        equation["i"][arrivingNode] += current

def parseCurrentSource(component: list, equation: dict):
    componentName = component[0]
    sourceType = component[3]

    if (sourceType == "DC"):
        parseCurrentSourceDc(component, equation)
    else:
        # print(f"[{componentName}] Source type not supported: '{sourceType}'")
        raise RuntimeError(f"[{componentName}] Source type not supported: '{sourceType}'")

def parseVoltageSourceDc(component: list, equation: dict):
    name         = component[0]
    positiveNode = int(component[1]) - 1
    negativeNode = int(component[2]) - 1
    sourceType   = component[3]
    voltage      = float(component[4])

    equation["extraDimensions"].append(component)
    extraIndex = equation["totalNodes"] + len(equation["extraDimensions"]) - 1

    equation["i"][extraIndex] -= voltage

    if (positiveNode != -1):
        equation["G"][positiveNode, extraIndex] += 1
        equation["G"][extraIndex, positiveNode] -= 1

    if (negativeNode != -1):
        equation["G"][negativeNode, extraIndex] -= 1
        equation["G"][extraIndex, negativeNode] += 1

def parseVoltageSource(component: list, equation: dict):
    componentName = component[0]
    sourceType = component[3]

    if (sourceType == "DC"):
        parseVoltageSourceDc(component, equation)
    else:
        # print(f"[{componentName}] Source type not supported: '{sourceType}'")
        raise RuntimeError(f"[{componentName}] Source type not supported: '{sourceType}'")

def parseVoltageControlledCurrentSource(component: list, equation: dict):
    name         = component[0]
    leavingNode  = int(component[1]) - 1
    arrivingNode = int(component[2]) - 1
    vPositive    = int(component[3]) - 1
    vNegative    = int(component[4]) - 1
    gain         = float(component[5])

    if (leavingNode != -1 and vPositive != -1):
        equation["G"][leavingNode, vPositive] += gain

    if (leavingNode != -1 and vNegative != -1):
        equation["G"][leavingNode, vNegative] -= gain

    if (arrivingNode != -1 and vPositive != -1):
        equation["G"][arrivingNode, vPositive] -= gain

    if (arrivingNode != -1 and vNegative != -1):
        equation["G"][arrivingNode, vNegative] += gain

def parseVoltageControlledVoltageSource(component: list, equation: dict):
    # E[nome] [vo+] [vo-] [vi+] [vi-] [ganho de tensão | polinômio]
    name           = component[0]
    v_out_positive = int(component[1]) - 1
    v_out_negative = int(component[2]) - 1
    v_in_positive  = int(component[3]) - 1
    v_in_negative  = int(component[4]) - 1
    gain           = float(component[5])

    equation["extraDimensions"].append(component)
    extraIndex = equation["totalNodes"] + len(equation["extraDimensions"]) - 1

    if (v_out_positive != -1):
        equation["G"][v_out_positive, extraIndex] += 1
        equation["G"][extraIndex, v_out_positive] -= 1

    if (v_out_negative != -1):
        equation["G"][v_out_negative, extraIndex] -= 1
        equation["G"][extraIndex, v_out_negative] += 1

    if (v_in_positive != -1):
        equation["G"][extraIndex, v_in_positive] += 1

    if (v_in_negative != -1):
        equation["G"][extraIndex, v_in_negative] -= 1

totalNodes = 0
for component in netlist:
    node1 = int(component[1])
    node2 = int(component[2])
    totalNodes = max(totalNodes, node1, node2)

totalExtraDimensions = 0
for component in netlist:
    componentName = component[0]
    componentType = componentName[0]

    if componentType == "V":
        totalExtraDimensions += 1
    elif componentType == "E":
        totalExtraDimensions += 1

matrixSize = totalNodes + totalExtraDimensions

equation = {
    'G': np.zeros((matrixSize, matrixSize)),
    'i': np.zeros((matrixSize, 1)),
    'extraDimensions': [],
    'totalNodes': totalNodes,
    'totalExtraDimensions': totalExtraDimensions,
    'matrixSize': matrixSize
}

for component in netlist:
    componentName = component[0]
    componentType = componentName[0]

    if componentType == "R":
        parseResistor(component, equation)
    elif componentType == "I":
        parseCurrentSource(component, equation)
    elif componentType == "V":
        parseVoltageSource(component, equation)
    elif componentType == "G":
        parseVoltageControlledCurrentSource(component, equation)
    elif componentType == "E":
        parseVoltageControlledVoltageSource(component, equation)
    else:
        print(f"[{componentName}] Component type not supported: '{componentType}'")
        # raise RuntimeError(f"[{componentName}] Component type not supported: '{componentType}'")

vectorE = np.linalg.solve(equation["G"], equation["i"])

# print()
# print("G")
# print(equation["G"])
# print()
# print("i")
# print(equation["i"])
# print()
# print("e")
# print(vectorE)

print()

for index, result in enumerate(vectorE):
    if (index + 1 <= equation["totalNodes"]):
        string_result = "{0:15.3f}".format(result[0])
        print(f"e_{index + 1} = {string_result}V")

print()

for index, result in enumerate(vectorE):
    if (index + 1 > equation["totalNodes"]):
        string_result = "{0:15.3f}".format(result[0])
        print(f"j_{index + 1} = {string_result}A", end=" ")

        extraIndex = index - equation["totalNodes"]
        componentName = equation["extraDimensions"][extraIndex][0]
        print(f"@ {componentName}")
