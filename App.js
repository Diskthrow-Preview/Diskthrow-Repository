import React, { useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView } from "react-native";
import { StatusBar } from "expo-status-bar";

const BUTTONS = [
  ["AC", "back", "/", "*"],
  ["7", "8", "9", "-"],
  ["4", "5", "6", "+"],
  ["1", "2", "3", "="],
  ["0", ".", "", ""],
];

export default function App() {
  const [display, setDisplay] = useState("0");
  const [expression, setExpression] = useState("");
  const [leftValue, setLeftValue] = useState(null);
  const [pendingOp, setPendingOp] = useState(null);
  const [justEvaluated, setJustEvaluated] = useState(false);

  const opSymbol = (op) => {
    if (op === "/") return "÷";
    if (op === "*") return "×";
    if (op === "-") return "−";
    return "+";
  };

  const applyOp = (a, op, b) => {
    if (op === "+") return a + b;
    if (op === "-") return a - b;
    if (op === "*") return a * b;
    if (op === "/") return b === 0 ? NaN : a / b;
    return b;
  };

  const handleNumber = (num) => {
    if (justEvaluated) {
      setDisplay(num);
      setExpression("");
      setJustEvaluated(false);
      return;
    }
    setDisplay(display === "0" ? num : display + num);
  };

  const handleDot = () => {
    if (justEvaluated) {
      setDisplay("0.");
      setExpression("");
      setJustEvaluated(false);
      return;
    }
    if (!display.includes(".")) {
      setDisplay(display + ".");
    }
  };

  const handleClear = () => {
    setDisplay("0");
    setExpression("");
    setLeftValue(null);
    setPendingOp(null);
    setJustEvaluated(false);
  };

  const handleBackspace = () => {
    if (justEvaluated) return;
    if (display.length > 1) {
      setDisplay(display.slice(0, -1));
    } else {
      setDisplay("0");
    }
  };

  const handleOperator = (op) => {
    const current = parseFloat(display);
    if (pendingOp && leftValue !== null && !justEvaluated) {
      const result = applyOp(leftValue, pendingOp, current);
      setLeftValue(result);
      setExpression(`${result} ${opSymbol(op)}`);
      setDisplay(String(result));
    } else {
      setLeftValue(current);
      setExpression(`${display} ${opSymbol(op)}`);
    }
    setPendingOp(op);
    setJustEvaluated(false);
    setDisplay("0");
  };

  const handleEquals = () => {
    if (pendingOp === null || leftValue === null) return;
    const current = parseFloat(display);
    const result = applyOp(leftValue, pendingOp, current);
    setExpression(`${leftValue} ${opSymbol(pendingOp)} ${current} =`);
    setDisplay(Number.isNaN(result) ? "Error" : String(result));
    setPendingOp(null);
    setLeftValue(null);
    setJustEvaluated(true);
  };

  const handlePress = (key) => {
    if (key === "") return;
    if (key === "AC") return handleClear();
    if (key === "back") return handleBackspace();
    if (key === ".") return handleDot();
    if (key === "=") return handleEquals();
    if (["+", "-", "*", "/"].includes(key)) return handleOperator(key);
    return handleNumber(key);
  };

  const labelFor = (key) => {
    if (key === "back") return "⌫";
    if (key === "/") return "÷";
    if (key === "*") return "×";
    if (key === "-") return "−";
    return key;
  };

  const styleFor = (key) => {
    if (key === "") return styles.hidden;
    if (key === "AC" || key === "back") return styles.functionButton;
    if (["/", "*", "-", "+", "="].includes(key)) return styles.operatorButton;
    return styles.numberButton;
  };

  const textStyleFor = (key) => {
    if (key === "AC" || key === "back") return styles.functionText;
    if (["/", "*", "-", "+", "="].includes(key)) return styles.operatorText;
    return styles.numberText;
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.display}>
        <Text style={styles.expressionText}>{expression || " "}</Text>
        <Text style={styles.displayText} numberOfLines={1} adjustsFontSizeToFit>
          {display}
        </Text>
      </View>
      <View style={styles.keypad}>
        {BUTTONS.map((row, rowIndex) => (
          <View style={styles.row} key={rowIndex}>
            {row.map((key, colIndex) => (
              <TouchableOpacity
                key={colIndex}
                style={[
                  styles.button,
                  styleFor(key),
                  key === "0" ? styles.zeroButton : null,
                ]}
                onPress={() => handlePress(key)}
                disabled={key === ""}
                activeOpacity={0.7}
              >
                <Text style={textStyleFor(key)}>{labelFor(key)}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1C1C1E",
    justifyContent: "flex-end",
  },
  display: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  expressionText: {
    color: "#8E8E93",
    fontSize: 20,
    textAlign: "right",
    marginBottom: 8,
  },
  displayText: {
    color: "#FFFFFF",
    fontSize: 64,
    fontWeight: "300",
    textAlign: "right",
  },
  keypad: {
    paddingHorizontal: 12,
    paddingBottom: 24,
  },
  row: {
    flexDirection: "row",
    marginBottom: 12,
  },
  button: {
    flex: 1,
    height: 72,
    borderRadius: 36,
    marginHorizontal: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  zeroButton: {
    flex: 2.2,
    alignItems: "flex-start",
    paddingLeft: 28,
  },
  hidden: {
    backgroundColor: "transparent",
  },
  numberButton: {
    backgroundColor: "#333333",
  },
  functionButton: {
    backgroundColor: "#A5A5A5",
  },
  operatorButton: {
    backgroundColor: "#FF9F0A",
  },
  numberText: {
    color: "#FFFFFF",
    fontSize: 28,
  },
  functionText: {
    color: "#000000",
    fontSize: 24,
    fontWeight: "500",
  },
  operatorText: {
    color: "#FFFFFF",
    fontSize: 32,
    fontWeight: "500",
  },
});
