import { goals, defaultGoal } from '../data/goals.js';

function clamp(val, min, max){
  return Math.max(min, Math.min(max, val));
}

function renderOptions(select){
  select.innerHTML = Object.keys(goals)
    .map(g => `<option value="${g}">${g}</option>`)
    .join('');
  select.value = defaultGoal;
}

function computeETA(hoursPerWeek, goalKey){
  const g = goals[goalKey];
  if (!g) return { weeks: null, plan: '', error: 'Выберите цель' };
  const hpw = clamp(Number(hoursPerWeek) || 0, 0, 1000);
  if (hpw < 1 || hpw > 40) {
    return { weeks: null, plan: g.plan, error: 'Часы в неделю должны быть в диапазоне 1–40' };
  }
  const weeks = Math.ceil(g.requiredHours / hpw);
  return { weeks, plan: g.plan, error: null };
}

function updateResult({weeks, plan, error}, resultEl){
  if (error){
    resultEl.innerHTML = `<div class="calc__error" role="alert">${error}</div>`;
    return;
  }
  resultEl.innerHTML = `
    <div class="calc__eta"><strong>${weeks}</strong> недель</div>
    <div class="calc__plan">${plan}</div>
  `;
}

export function initTimeCalculator(){
  const form = document.getElementById('time-calculator');
  if (!form) return;
  const hoursInput = form.querySelector('input[name="hours"]');
  const hoursNum = form.querySelector('#hours-num');
  const goalSelect = form.querySelector('select[name="goal"]');
  const resultEl = form.querySelector('.calc__result');
  const hoursValue = form.querySelector('#hours-value');

  renderOptions(goalSelect);
  // defaults
  hoursInput.value = '10';
  hoursValue.textContent = hoursInput.value;

  const recalc = () => {
    const curr = hoursNum ? Number(hoursNum.value) : Number(hoursInput.value);
    hoursValue.textContent = String(curr);
    const res = computeETA(curr, goalSelect.value);
    updateResult(res, resultEl);
  };

  hoursInput.addEventListener('input', () => {
    hoursNum.value = hoursInput.value;
    recalc();
  });
  hoursNum.addEventListener('input', () => {
    const v = clamp(Number(hoursNum.value) || 0, 0, 1000);
    hoursInput.value = String(v);
    recalc();
  });
  goalSelect.addEventListener('change', recalc);

  recalc();
}

export const __test = { computeETA };
