import { initLevelSwitcher } from './components/level-switcher.js';
import { initTimeCalculator } from './components/time-calculator.js';

// Basic init on DOM ready
window.addEventListener('DOMContentLoaded', () => {
  initLevelSwitcher();
  initTimeCalculator();
});
