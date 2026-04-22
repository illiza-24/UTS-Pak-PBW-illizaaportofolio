// ---- State ----
let currentInput = '';
let lastResult   = null;
let isResult     = false;
let angleMode    = 'DEG';
let openParens   = 0;

// ---- Elemen DOM ----
const displayResult  = document.getElementById('result');
const displayExpr    = document.getElementById('expression');
const angleModeLabel = document.getElementById('angleMode');

// ---- Helper ----
function updateDisplay(value, expr) {
  displayResult.textContent = value;
  displayResult.classList.remove('error');
  if (expr !== undefined) displayExpr.textContent = expr;
}

function showError(msg) {
  displayResult.textContent = msg;
  displayResult.classList.add('error');
}

function prettyPrint(expr) {
  return expr
    .replace(/Math\.PI/g, 'π')
    .replace(/Math\.E/g, 'e')
    .replace(/\*\*/g, '^')
    .replace(/\*/g, '×')
    .replace(/\//g, '÷');
}

// ---- Input angka ----
function inputNumber(num) {
  if (isResult) { currentInput = num; isResult = false; }
  else currentInput += num;
  displayExpr.textContent = prettyPrint(currentInput);
  displayResult.textContent = currentInput;
  displayResult.classList.remove('error');
}

// ---- Titik desimal ----
function inputDot() {
  const lastNum = currentInput.split(/[\+\-\*\/\(]/).pop();
  if (lastNum.includes('.')) return;
  if (isResult) { currentInput = '0.'; isResult = false; }
  else currentInput = currentInput === '' ? '0.' : currentInput + '.';
  displayExpr.textContent = prettyPrint(currentInput);
  displayResult.textContent = currentInput;
  displayResult.classList.remove('error');
}

// ---- Operator ----
function inputOperator(op) {
  if (isResult) { currentInput = String(lastResult); isResult = false; }
  if (currentInput === '' && op !== '-') return;
  const lastChar = currentInput.slice(-1);
  if (['+', '-', '*', '/'].includes(lastChar)) currentInput = currentInput.slice(0, -1);
  currentInput += op;
  const opDisplay = { '+': '+', '-': '−', '*': '×', '/': '÷' }[op];
  displayExpr.textContent = prettyPrint(currentInput);
  displayResult.textContent = opDisplay;
  displayResult.classList.remove('error');
}

// ---- Fungsi: sin, cos, tan, sqrt, log, ln ----
function inputFunction(fn) {
  if (isResult && lastResult !== null) {
    currentInput = fn + '(' + lastResult + ')';
    isResult = false;
  } else {
    currentInput += fn + '(';
    openParens++;
  }
  displayExpr.textContent = currentInput;
  displayResult.textContent = fn + '(';
  displayResult.classList.remove('error');
}

// ---- Pangkat xʸ ----
function inputPower() {
  if (currentInput === '' && lastResult === null) return;
  if (isResult) { currentInput = String(lastResult); isResult = false; }
  currentInput += '**';
  displayExpr.textContent = prettyPrint(currentInput);
  displayResult.textContent = 'xʸ';
  displayResult.classList.remove('error');
}

// ---- Kuadrat x² ----
function inputSquare() {
  if (isResult && lastResult !== null) {
    currentInput = '(' + lastResult + ')**2';
    isResult = false;
  } else {
    if (currentInput === '') return;
    currentInput = '(' + currentInput + ')**2';
  }
  displayExpr.textContent = prettyPrint(currentInput);
  displayResult.textContent = 'x²';
  displayResult.classList.remove('error');
}

// ---- Kurung () ----
function inputParenthesis() {
  if (isResult) { currentInput = String(lastResult); isResult = false; }
  if (openParens === 0) { currentInput += '('; openParens++; }
  else { currentInput += ')'; openParens--; }
  displayExpr.textContent = currentInput;
  displayResult.textContent = currentInput;
  displayResult.classList.remove('error');
}

// ---- Konstanta π dan e ----
function inputConstant(c) {
  const map   = { pi: 'Math.PI', e: 'Math.E' };
  const label = { pi: 'π', e: 'e' };
  if (isResult) { currentInput = map[c]; isResult = false; }
  else currentInput += map[c];
  displayExpr.textContent = prettyPrint(currentInput);
  displayResult.textContent = label[c];
  displayResult.classList.remove('error');
}

// ---- Persen % ----
function inputPercent() {
  if (currentInput === '' && lastResult === null) return;

  if (isResult) {
    const val = parseFloat(lastResult) / 100;
    currentInput  = String(val);
    lastResult    = currentInput;
    displayExpr.textContent   = lastResult + '%';
    displayResult.textContent = currentInput;
    displayResult.classList.remove('error');
    return;
  }

  const match = currentInput.match(/^(.*)([\+\-\*\/])([^+\-*/]+)$/);
  if (match) {
    const baseExpr = match[1];          // "200"
    const op       = match[2];          // "+"
    const numStr   = match[3];          // "50"
    const base     = parseFloat(baseExpr);
    const num      = parseFloat(numStr);
    if (!isNaN(base) && !isNaN(num)) {
      const pct = (base * num) / 100;
      currentInput = baseExpr + op + pct;
      displayExpr.textContent   = prettyPrint(baseExpr) + op + numStr + '%';
      displayResult.textContent = String(pct);
      displayResult.classList.remove('error');
      return;
    }
  }

  // Tidak ada operator maka langsung /100
  const val = parseFloat(currentInput) / 100;
  if (isNaN(val)) return;
  displayExpr.textContent   = currentInput + '%';
  currentInput              = String(val);
  displayResult.textContent = currentInput;
  displayResult.classList.remove('error');
}

// ---- Toggle DEG / RAD ----
function toggleAngle() {
  angleMode = angleMode === 'DEG' ? 'RAD' : 'DEG';
  angleModeLabel.textContent = angleMode;
}

// ---- AC ----
function clearAll() {
  currentInput = ''; lastResult = null; isResult = false; openParens = 0;
  updateDisplay('0', '');
}

function deleteLast() {
  if (isResult) { clearAll(); return; }
  if      (currentInput.endsWith('Math.PI')) currentInput = currentInput.slice(0, -7);
  else if (currentInput.endsWith('Math.E'))  currentInput = currentInput.slice(0, -6);
  else if (currentInput.endsWith('**'))      currentInput = currentInput.slice(0, -2);
  else {
    const fnMatch = currentInput.match(/(sin|cos|tan|sqrt|log|ln)\($/);
    if (fnMatch) {
      currentInput = currentInput.slice(0, -fnMatch[0].length);
      openParens = Math.max(0, openParens - 1);
    } else {
      const last = currentInput.slice(-1);
      if (last === ')') openParens++;
      if (last === '(') openParens = Math.max(0, openParens - 1);
      currentInput = currentInput.slice(0, -1);
    }
  }
  updateDisplay(currentInput || '0', prettyPrint(currentInput));
}

// ---- Hitung = ----
function calculate() {
  if (currentInput === '') return;

  let expr = currentInput;
  for (let i = 0; i < openParens; i++) expr += ')';
  openParens = 0;

  displayExpr.textContent = prettyPrint(expr) + ' =';

  try {
    let evalExpr = expr
      .replace(/\bsqrt\(/g, 'Math.sqrt(')
      .replace(/\blog\(/g,  'Math.log10(')
      .replace(/\bln\(/g,   'Math.log(');

    let result;

    if (angleMode === 'DEG') {
      evalExpr = evalExpr
        .replace(/\bsin\(/g, '_sin_(')
        .replace(/\bcos\(/g, '_cos_(')
        .replace(/\btan\(/g, '_tan_(');

      const fn = new Function('_sin_', '_cos_', '_tan_', 'Math',
        '"use strict"; return (' + evalExpr + ');'
      );
      result = fn(
        (x) => Math.sin(x * Math.PI / 180),
        (x) => Math.cos(x * Math.PI / 180),
        (x) => Math.tan(x * Math.PI / 180),
        Math
      );
    } else {
      evalExpr = evalExpr
        .replace(/\bsin\(/g, 'Math.sin(')
        .replace(/\bcos\(/g, 'Math.cos(')
        .replace(/\btan\(/g, 'Math.tan(');

      const fn = new Function('Math', '"use strict"; return (' + evalExpr + ');');
      result = fn(Math);
    }

    if (!isFinite(result)) throw new Error('Inf');
    if (isNaN(result))     throw new Error('NaN');

    if (Math.abs(result) < 1e-10) result = 0;

    const formatted = parseFloat(result.toPrecision(10)).toString();
    lastResult   = formatted;
    currentInput = formatted;
    isResult     = true;

    displayResult.textContent = formatted;
    displayResult.classList.remove('error');

  } catch (err) {
    showError('Error');
    currentInput = '';
    isResult     = false;
  }
}

// ---- Keyboard ----
document.addEventListener('keydown', function(e) {
  if (e.key >= '0' && e.key <= '9')           inputNumber(e.key);
  else if (e.key === '.')                      inputDot();
  else if (e.key === '+')                      inputOperator('+');
  else if (e.key === '-')                      inputOperator('-');
  else if (e.key === '*')                      inputOperator('*');
  else if (e.key === '/') { e.preventDefault(); inputOperator('/'); }
  else if (e.key === 'Enter' || e.key === '=') calculate();
  else if (e.key === 'Backspace')              deleteLast();
  else if (e.key === 'Escape')                 clearAll();
  else if (e.key === '(' || e.key === ')')     inputParenthesis();
  else if (e.key === '%')                      inputPercent();
});
