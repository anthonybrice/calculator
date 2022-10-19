function calculatorStateMachine({ out }) {
  const states = {
    start: 0,
    firstOperand: 1,
    operation: 2,
    secondOperand: 3,
    error: 5,
    thirdOperand: 6,
    secondOperation: 7,
    reduced: 8,
    operationWithBuffer: 9,
    secondOperandWithoutBuffer: 10
  }

  let state = states.start
  let firstOperand = "0"
  let secondOperand = "0"
  let thirdOperand = "0"

  // this extra state lets the user see different results depending on the next operation in a chained expression
  let resultBuffer = null
  let intermediateResult = null
  let operation = null
  let secondOperation = null
  let potentialOperation = null
  let potentialSecondOperation = null

  const machine = {
    reset: () => {
      state = states.start
      firstOperand = "0"
      secondOperand = "0"
      thirdOperand = "0"
      resultBuffer = null
      intermediateResult = null
      operation = null
      secondOperation = null
      potentialOperation = null
      potentialSecondOperation = null
      output("0")
    },

    inputNumeric: (input) => {
      switch (state) {
        case states.start:
        case states.firstOperand:
          state = states.firstOperand
          firstOperand = append(firstOperand, input)
          output(firstOperand)
          break

        case states.reduced:
          secondOperand = "0"
        case states.operation:
        case states.operationWithBuffer:
        case states.secondOperand:
          if (resultBuffer) {
            firstOperand = resultBuffer
            secondOperand = "0"
            operation = potentialOperation
            secondOperation = potentialSecondOperation
            resultBuffer = null
            potentialOperation = null
            potentialSecondOperation = null
          }
          state = states.secondOperand
          secondOperand = append(secondOperand, input)
          output(secondOperand)
          break

        case states.secondOperation:
        case states.secondOperandWithoutBuffer:
        case states.thirdOperand:
          if (resultBuffer && intermediateResult) {
            firstOperand = resultBuffer
            secondOperand = thirdOperand
            thirdOperand = "0"
            operation = potentialOperation
            resultBuffer = null
            intermediateResult = null
            potentialOperation = null
            potentialSecondOperation = null
          } else if (resultBuffer) {
            secondOperand = resultBuffer
            thirdOperand = "0"
            operation = potentialOperation
            secondOperation = potentialSecondOperation
            resultBuffer = null
            intermediateResult = null
            potentialOperation = null
            potentialSecondOperation = null
          }
          state = states.thirdOperand
          thirdOperand = append(thirdOperand, input)
          output(thirdOperand)
          break
      }

      function append(operand, input) {
        if (operand === "0") {
          if (input === ".") return "0."
          else return input
        } else if (input !== "." || (input === "." && !operand.includes("."))) {
          return operand.concat(input)
        }
      }
    },

    inputOperation: (input) => {
      switch (state) {
        case states.start:
        case states.reduced:
          secondOperand = "0"
        case states.firstOperand:
          state = states.operation
          operation = input
          break

        case states.operation:
        case states.secondOperandWithoutBuffer:
        case states.secondOperand:
          if (
            input === "+" ||
            input === "-" ||
            operation === "*" ||
            (operation === "/" && (input === "*" || input === "/"))
          ) {
            resultBuffer = compute(
              Number(firstOperand),
              Number(secondOperand),
              operation
            ).toString()
            output(resultBuffer)
            state = states.operation
            potentialOperation = input
          } else {
            state = states.secondOperandWithoutBuffer
            output(secondOperand)
            resultBuffer = null
            secondOperation = input
          }
          break

        case states.operationWithBuffer:
        case states.secondOperation:
        case states.thirdOperand:
          if (input === "*" || input === "/") {
            resultBuffer = compute(
              Number(secondOperand),
              Number(thirdOperand),
              secondOperation
            ).toString()
            intermediateResult = null
            output(resultBuffer)
            potentialSecondOperation = input
            state = states.secondOperation
          } else {
            intermediateResult = compute(
              Number(secondOperand),
              Number(thirdOperand),
              secondOperation
            )
            resultBuffer = compute(
              Number(firstOperand),
              intermediateResult,
              operation
            ).toString()
            output(resultBuffer)
            potentialOperation = input
            state = states.operationWithBuffer
          }
          break
      }
    },

    outputResult: () => {
      let reduced

      switch (state) {
        case states.start:
          reduced = "0"
          break

        case states.firstOperand:
          reduced = firstOperand
          break

        case states.operation:
        case states.operationWithBuffer:
          if (resultBuffer) {
            firstOperand = resultBuffer
            secondOperand = "0"
            operation = potentialOperation
            secondOperation = potentialSecondOperation
            resultBuffer = null
            potentialOperation = null
            potentialSecondOperation = null
          }
          secondOperand = firstOperand
        case states.reduced:
        case states.secondOperand:
          reduced = compute(
            Number(firstOperand),
            Number(secondOperand),
            operation
          ).toString()
          firstOperand = reduced
          state = states.reduced
          break

        case states.secondOperation:
        case states.secondOperandWithoutBuffer:
          if (resultBuffer && intermediateResult) {
            firstOperand = resultBuffer
            secondOperand = "0"
            thirdOperand = "0"
            operation = potentialOperation
            resultBuffer = null
            intermediateResult = null
            potentialOperation = null
            potentialSecondOperation = null
          } else if (resultBuffer) {
            secondOperand = resultBuffer
            secondOperation = potentialSecondOperation
            resultBuffer = null
            intermediateResult = null
            potentialOperation = null
            potentialSecondOperation = null
          }
          thirdOperand = secondOperand
        case states.thirdOperand:
          const y = compute(
            Number(secondOperand),
            Number(thirdOperand),
            secondOperation
          )
          reduced = compute(Number(firstOperand), y, operation).toString()
          firstOperand = reduced
          secondOperand = thirdOperand
          operation = secondOperation
          thirdOperand = "0"
          secondOperation = null
          state = states.reduced
          break
      }

      output(reduced)
    }
  }

  function compute(x, y, operation) {
    switch (operation) {
      case "+":
        return x + y
      case "-":
        return x - y
      case "*":
        return x * y
      case "/":
        if (y === 0) {
          state = states.error
          return "Undefined"
        }
        return x / y
    }
  }

  function output(s) {
    if (s.length > 10) {
      state = states.error
      s = "Error"
    }

    out(s)
  }

  return machine
}

const ioCalc = calculatorStateMachine({
  out: (s) => (document.getElementById("calculator-output").innerText = s)
})

// for testing
// module isn't defined in the browser, so we suppress the error that would print to the console
try {
  module.exports = { calculatorStateMachine }
} catch (e) {}
