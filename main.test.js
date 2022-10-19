const assert = require("node:assert/strict")

const { calculatorStateMachine } = require('./main')

console.log("Testing the calculator:")

;(() => {
  process.stdout.write("It should perform real addition... ")

  let output = ''
  const calc = calculatorStateMachine({ out: (s) => output = s })

  calc.inputNumeric("2")
  assert.deepEqual(output, "2")
  calc.inputNumeric("3")
  assert.deepEqual(output, "23")
  calc.inputNumeric(".")
  assert.deepEqual(output, "23.")
  calc.inputNumeric("5")
  assert.deepEqual(output, "23.5")
  calc.inputOperation("+")
  assert.deepEqual(output, "23.5")
  calc.inputNumeric("7")
  assert.deepEqual(output, "7")
  calc.outputResult()
  assert.deepEqual(output, "30.5")

  process.stdout.write("passed!\n")
})()

;(() => {
  process.stdout.write("It should perform chained operations... ")

  let output = ''
  const calc = calculatorStateMachine({ out: (s) => output = s })

  calc.inputNumeric("2")
  assert.deepEqual(output, "2")
  calc.inputOperation("+")
  assert.deepEqual(output, "2")
  calc.inputNumeric("3")
  assert.deepEqual(output, "3")
  calc.inputOperation("-")
  assert.deepEqual(output, "5")
  calc.inputNumeric("1")
  assert.deepEqual(output, "1")
  calc.inputNumeric("7")
  assert.deepEqual(output, "17")
  calc.outputResult()
  assert.deepEqual(output, "-12")

  process.stdout.write("passed!\n")
})()

;(() => {
  process.stdout.write("It should perform chained and ordered operations... ")

  let output = ''
  const calc = calculatorStateMachine({ out: (s) => output = s })

  calc.inputNumeric("2")
  assert.deepEqual(output, "2")
  calc.inputOperation("+")
  assert.deepEqual(output, "2")
  calc.inputNumeric("3")
  assert.deepEqual(output, "3")
  calc.inputOperation("*")
  assert.deepEqual(output, "3")
  calc.inputNumeric("8")
  assert.deepEqual(output, "8")
  calc.outputResult()
  assert.deepEqual(output, "26")

  process.stdout.write("passed!\n")
})()

;(() => {
  process.stdout.write("It should return 'Undefined' on division by zero... ")

  let output = ''
  const calc = calculatorStateMachine({ out: (s) => output = s })

  calc.inputNumeric("2")
  assert.deepEqual(output, "2")
  calc.inputOperation("/")
  assert.deepEqual(output, "2")
  calc.inputNumeric("0")
  assert.deepEqual(output, "0")
  calc.outputResult()
  assert.deepEqual(output, "Undefined")
  process.stdout.write("passed!\n")
})()

;(() => {
  process.stdout.write("It should return 'Error' on overflow after 10 digits... ")

  let output = ''
  const calc = calculatorStateMachine({ out: (s) => output = s })

  calc.inputNumeric("2")
  assert.deepEqual(output, "2")
  calc.inputNumeric("0")
  assert.deepEqual(output, "20")
  calc.inputNumeric("0")
  assert.deepEqual(output, "200")
  calc.inputNumeric("0")
  assert.deepEqual(output, "2000")
  calc.inputNumeric("0")
  assert.deepEqual(output, "20000")
  calc.inputOperation("*")
  assert.deepEqual(output, "20000")
  calc.inputNumeric("9")
  assert.deepEqual(output, "9")
  calc.inputNumeric("9")
  assert.deepEqual(output, "99")
  calc.inputNumeric("9")
  assert.deepEqual(output, "999")
  calc.inputNumeric("9")
  assert.deepEqual(output, "9999")
  calc.inputNumeric("9")
  assert.deepEqual(output, "99999")
  calc.inputOperation("*")
  assert.deepEqual(output, "1999980000")
  calc.inputNumeric("9")
  assert.deepEqual(output, "9")
  calc.outputResult()
  assert.deepEqual(output, "Error")

  process.stdout.write("passed!\n")
})()

;(() => {
  process.stdout.write("It continues to apply right side of binary op on repeated presses of equals button... ")

  let output = ''
  const calc = calculatorStateMachine({ out: (s) => output = s })

  calc.inputNumeric("4")
  assert.deepEqual(output, "4")
  calc.inputOperation("/")
  assert.deepEqual(output, "4")
  calc.inputNumeric("2")
  assert.deepEqual(output, "2")
  calc.outputResult()
  assert.deepEqual(output, "2")
  calc.outputResult()
  assert.deepEqual(output, "1")
  calc.outputResult()
  assert.deepEqual(output, "0.5")
  calc.outputResult()
  assert.deepEqual(output, "0.25")
  calc.outputResult()
  assert.deepEqual(output, "0.125")

  process.stdout.write("passed!\n")
})()

;(() => {
  process.stdout.write("It should show the appropriate result when the user clicks between add/sub and mult/div operations in chained and ordered operations... ")

  let output = ''
  const calc = calculatorStateMachine({ out: (s) => output = s })

  calc.inputNumeric("2")
  assert.deepEqual(output, "2")
  calc.inputOperation("+")
  assert.deepEqual(output, "2")
  calc.inputNumeric("3")
  assert.deepEqual(output, "3")
  calc.inputOperation("*")
  assert.deepEqual(output, "3")
  calc.inputNumeric("8")
  assert.deepEqual(output, "8")
  calc.inputOperation("-")
  assert.deepEqual(output, "26")
  calc.inputOperation("*")
  assert.deepEqual(output, "24")
  calc.inputOperation("-")
  assert.deepEqual(output, "26")
  calc.inputOperation("*")
  assert.deepEqual(output, "24")
  calc.outputResult()
  assert.deepEqual(output, "578") // 72 on the macOS calc :((

  calc.reset()
  assert.deepEqual(output, "0")
  calc.inputNumeric("8")
  assert.deepEqual(output, "8")
  calc.inputOperation("+")
  assert.deepEqual(output, "8")
  calc.inputNumeric("9")
  assert.deepEqual(output, "9")
  calc.inputOperation("-")
  assert.deepEqual(output, "17")
  calc.inputOperation("*")
  assert.deepEqual(output, "9")
  calc.inputOperation("-")
  assert.deepEqual(output, "17")
  calc.inputOperation("*")
  assert.deepEqual(output, "9")

  process.stdout.write("passed!\n")
})()

;(() => {
  process.stdout.write("It should continue chaining operations after clicking equals... ")

  let output = ''
  const calc = calculatorStateMachine({ out: (s) => output = s })

  calc.inputNumeric("6")
  assert.deepEqual(output, "6")
  calc.inputOperation("+")
  assert.deepEqual(output, "6")
  calc.inputNumeric("4")
  assert.deepEqual(output, "4")
  calc.outputResult()
  assert.deepEqual(output, "10")
  calc.inputOperation("/")
  assert.deepEqual(output, "10")
  calc.inputNumeric("2")
  assert.deepEqual(output, "2")
  calc.outputResult()
  assert.deepEqual(output, "5")

  process.stdout.write("passed!\n")
})()

// it should let the user choose a different operand after hitting equals to see a different result
// e.g., "6+4=" returns 10, while "6+4=5=" returns 11
// doesn't pass

