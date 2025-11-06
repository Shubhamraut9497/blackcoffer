#!/usr/bin/env node
// CommonJS version of filterData for projects using "type": "module" in package.json
const fs = require('fs');
const path = require('path');

function parseArgs(argv) {
  const args = {};
  argv.slice(2).forEach(a => {
    if (!a.startsWith('--')) return;
    const eq = a.indexOf('=');
    if (eq === -1) {
      args[a.slice(2)] = true;
    } else {
      const k = a.slice(2, eq);
      const v = a.slice(eq + 1);
      args[k] = v;
    }
  });
  return args;
}

function toNumberIfPossible(v) {
  if (v === undefined || v === null || v === '') return undefined;
  if (/^-?\d+$/.test(v)) return parseInt(v, 10);
  if (/^-?\d+\.\d+$/.test(v)) return parseFloat(v);
  return v;
}

const args = parseArgs(process.argv);
const file = path.resolve(__dirname, '..', 'jsonData.json');
if (!fs.existsSync(file)) {
  console.error('jsonData.json not found at', file);
  process.exit(2);
}

let raw = fs.readFileSync(file, 'utf8');
let data;
try {
  data = JSON.parse(raw);
} catch (err) {
  console.error('Failed to parse jsonData.json:', err.message);
  process.exit(3);
}

function matches(item) {
  const strFilters = ['topic','sector','region','country','city','pestle','source','title','insight'];
  for (const f of strFilters) {
    if (args[f]) {
      const v = args[f].toLowerCase();
      const val = (item[f] || item[f.replace('_',' ')] || '').toString().toLowerCase();
      if (args.exact === 'true' || args.exact === true) {
        if (val !== v) return false;
      } else {
        if (!val.includes(v)) return false;
      }
    }
  }

  const numFilters = [
    {argMin: 'intensity_min', argMax: 'intensity_max', key: 'intensity'},
    {argMin: 'likelihood_min', argMax: 'likelihood_max', key: 'likelihood'},
    {argMin: 'relevance_min', argMax: 'relevance_max', key: 'relevance'},
    {argMin: 'end_year_min', argMax: 'end_year_max', key: 'end_year'},
  ];
  for (const nf of numFilters) {
    const min = toNumberIfPossible(args[nf.argMin]);
    const max = toNumberIfPossible(args[nf.argMax]);
    let val = toNumberIfPossible(item[nf.key]);
    if (val === '' || val === null || val === undefined) val = undefined;
    if (min !== undefined || max !== undefined) {
      if (val === undefined) return false;
      if (min !== undefined && val < min) return false;
      if (max !== undefined && val > max) return false;
    } else if (args[nf.key]) {
      const eq = toNumberIfPossible(args[nf.key]);
      if (eq !== undefined) {
        if (val !== eq) return false;
      }
    }
  }

  if (args.end_year) {
    const ey = toNumberIfPossible(args.end_year);
    if (ey !== undefined) {
      if (toNumberIfPossible(item.end_year) !== ey) return false;
    } else {
      if ((item.end_year || '').toString().toLowerCase() !== args.end_year.toLowerCase()) return false;
    }
  }

  if (args.topics) {
    const wanted = args.topics.split(',').map(s => s.trim().toLowerCase()).filter(Boolean);
    const it = (item.topic || '').toString().toLowerCase();
    if (!wanted.some(w => it === w || it.includes(w))) return false;
  }

  if (args.sectors) {
    const wanted = args.sectors.split(',').map(s => s.trim().toLowerCase()).filter(Boolean);
    const it = (item.sector || '').toString().toLowerCase();
    if (!wanted.some(w => it === w || it.includes(w))) return false;
  }

  if (args.swot) {
    const w = args.swot.toLowerCase();
    const hay = (item.title || '') + ' ' + (item.insight || '') + ' ' + (item.sector || '');
    if (!hay.toLowerCase().includes(w)) return false;
  }

  return true;
}

let results = data.filter(matches);
const limit = toNumberIfPossible(args.limit) || toNumberIfPossible(args.l) || 100;
const offset = toNumberIfPossible(args.offset) || toNumberIfPossible(args.o) || 0;
results = results.slice(offset, offset + limit);
if (args.pretty === 'true' || args.pretty === true) {
  console.log(JSON.stringify(results, null, 2));
} else {
  console.log(JSON.stringify(results));
}
process.exit(0);
