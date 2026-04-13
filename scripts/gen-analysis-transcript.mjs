import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const rawPath = path.join(root, 'src', 'data', 'analysis-transcript-raw.txt');
const outPath = path.join(root, 'src', 'data', 'analysis-example-transcript.json');

let raw = fs.readFileSync(rawPath, 'utf8').trim();
raw = raw.replace(/<\/user_query>\s*$/i, '').trim();

const lineRe = /^(клиент\s+\d+|оператор)\s*:\s*(.*)$/iu;

function parseTranscript(text) {
  const chunks = text.split(/\n(?=Диалог\s+\d+)/u);
  const dialogs = [];
  for (const chunk of chunks) {
    const lines = chunk.split('\n');
    if (!lines.length) continue;
    const title = lines[0].trim();
    if (!/^Диалог\s+\d+/u.test(title)) continue;
    const turns = [];
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      const m = line.match(lineRe);
      if (!m) continue;
      const labelRaw = m[1].replace(/\s+/g, ' ').trim();
      const label = /^оператор$/iu.test(labelRaw) ? 'оператор' : labelRaw;
      const role = /^оператор$/iu.test(labelRaw) ? 'operator' : 'client';
      turns.push({ role, label, text: m[2] });
    }
    dialogs.push({ title, lines: turns });
  }
  return dialogs;
}

const data = parseTranscript(raw);
fs.writeFileSync(outPath, JSON.stringify(data), 'utf8');
console.log('dialogs', data.length, 'out', outPath);
for (const d of data) {
  console.log(' ', d.title, 'lines', d.lines.length);
}
