#!/usr/bin/env node
/**
 * Simple validator for src/data schemas.
 * Also exportable for MCP server to reuse.
 */
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import fs from 'node:fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

function isString(x){ return typeof x === 'string' && x.trim().length > 0; }
function isArray(x){ return Array.isArray(x); }

async function loadModule(relPath){
  const abs = path.resolve(projectRoot, relPath);
  if (!fs.existsSync(abs)) throw new Error(`File not found: ${relPath}`);
  return import(pathToFileURL(abs).href);
}

function checkCatalog(catalogByLevel){
  const errors = [];
  for (const [level, arr] of Object.entries(catalogByLevel)){
    if (!isArray(arr)) { errors.push(`catalog[${level}] is not an array`); continue; }
    arr.forEach((m, i) => {
      if (!isString(m.title)) errors.push(`catalog[${level}][${i}].title missing`);
      if (!isString(m.badge)) errors.push(`catalog[${level}][${i}].badge missing`);
    });
  }
  return errors;
}

function checkPricing(pricingByLevel){
  const errors = [];
  for (const [level, arr] of Object.entries(pricingByLevel)){
    if (!isArray(arr)) { errors.push(`pricing[${level}] is not an array`); continue; }
    arr.forEach((p, i) => {
      if (!isString(p.name)) errors.push(`pricing[${level}][${i}].name missing`);
      if (!isString(p.price)) errors.push(`pricing[${level}][${i}].price missing`);
      if (!isArray(p.features)) errors.push(`pricing[${level}][${i}].features missing or not array`);
      else if (p.features.some(f => !isString(f))) errors.push(`pricing[${level}][${i}].features has non-string`);
    });
  }
  return errors;
}

function checkGoals(goals){
  const errors = [];
  for (const [goal, g] of Object.entries(goals)){
    if (typeof g.requiredHours !== 'number' || !(g.requiredHours > 0)) errors.push(`goals[${goal}].requiredHours must be > 0`);
    if (!isString(g.plan)) errors.push(`goals[${goal}].plan missing`);
  }
  return errors;
}

export async function validate({ simulateError = false } = {}){
  if (simulateError) {
    return { ok: false, errors: ['Simulated error: demonstration of failing run'], messages: [] };
  }
  const { catalogByLevel } = await loadModule('src/data/catalog.js');
  const { pricingByLevel } = await loadModule('src/data/pricing.js');
  const goalsMod = await loadModule('src/data/goals.js');

  const errors = [
    ...checkCatalog(catalogByLevel),
    ...checkPricing(pricingByLevel),
    ...checkGoals(goalsMod.goals),
  ];
  if (errors.length) return { ok: false, errors, messages: [] };
  return { ok: true, errors: [], messages: ['All data schemas are valid.'] };
}

// CLI entrypoint
if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const args = new Set(process.argv.slice(2));
  validate({ simulateError: args.has('--simulate-error') })
    .then(res => {
      if (res.ok) {
        res.messages.forEach(m => console.log(`[validate-data] ${m}`));
        process.exit(0);
      }
      res.errors.forEach(e => console.error(`[validate-data] ${e}`));
      process.exit(2);
    })
    .catch(err => {
      console.error(`[validate-data] ERROR: ${err.stack || String(err)}`);
      process.exit(3);
    });
}
