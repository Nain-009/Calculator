const display = document.getElementById('display');
let expression = '';
let lastOperator = null;
let operandStack = [];

/**
 * Append a number to the display
 * @param {string} num - The number to append
 */
function appendNumber(num) {
    // Prevent multiple decimal points
    if (num === '.' && display.value.includes('.')) {
        return;
    }

    // Prevent leading zeros
    if (display.value === '0' && num !== '.') {
        display.value = num;
        expression = num;
        return;
    }

    display.value += num;
    expression += num;
}

/**
 * Append an operator to the expression
 * @param {string} operator - The operator to append (+, -, *, /)
 */
function appendOperator(operator) {
    if (display.value === '' && operator !== '-') {
        return;
    }

    // Handle negative numbers
    if (display.value === '' && operator === '-') {
        display.value = '-';
        expression = '-';
        return;
    }

    // If there's an existing operator, calculate first
    if (lastOperator !== null && !isLastCharOperator()) {
        calculate();
    }

    expression += operator;
    lastOperator = operator;
    display.value += ' ' + operator + ' ';
}

/**
 * Check if the last character in the expression is an operator
 * @returns {boolean} True if last character is an operator
 */
function isLastCharOperator() {
    const lastChar = expression[expression.length - 1];
    return ['+', '-', '*', '/'].includes(lastChar);
}

/**
 * Calculate the result of the expression
 */
function calculate() {
    try {
        if (expression.trim() === '') {
            return;
        }

        // Evaluate the expression
        let result = Function('"use strict"; return (' + expression + ')')();

        // Format the result to avoid floating point errors
        result = parseFloat(result.toFixed(10));

        display.value = result;
        expression = result.toString();
        lastOperator = null;
    } catch (error) {
        display.value = 'Error';
        expression = '';
        lastOperator = null;
    }
}

/**
 * Clear the display and reset the calculator
 */
function clearDisplay() {
    display.value = '';
    expression = '';
    lastOperator = null;
    operandStack = [];
}

/**
 * Delete the last character from the display
 */
function deleteLastChar() {
    if (display.value === '') {
        return;
    }

    // Handle spaces before operators
    if (display.value.endsWith(' ')) {
        display.value = display.value.slice(0, -3); // Remove " operator "
        expression = expression.slice(0, -1); // Remove operator from expression
        lastOperator = null;
    } else {
        display.value = display.value.slice(0, -1);
        expression = expression.slice(0, -1);
    }

    // Update lastOperator
    if (isLastCharOperator()) {
        lastOperator = expression[expression.length - 1];
    }
}

/**
 * Toggle the sign of the current number
 */
function toggleSign() {
    if (display.value === '' || display.value === '0') {
        return;
    }

    if (display.value.startsWith('-')) {
        display.value = display.value.slice(1);
        expression = expression.slice(1);
    } else {
        display.value = '-' + display.value;
        expression = '-' + expression;
    }
}

/**
 * Keyboard support for the calculator
 */
document.addEventListener('keydown', function(event) {
    const key = event.key;

    if (key >= '0' && key <= '9') {
        appendNumber(key);
    } else if (key === '.') {
        appendNumber('.');
    } else if (key === '+' || key === '-' || key === '*' || key === '/') {
        event.preventDefault();
        appendOperator(key);
    } else if (key === 'Enter' || key === '=') {
        event.preventDefault();
        calculate();
    } else if (key === 'Escape') {
        clearDisplay();
    } else if (key === 'Backspace') {
        event.preventDefault();
        deleteLastChar();
    }
});