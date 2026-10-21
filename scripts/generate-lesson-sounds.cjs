// Original, deterministic musical cues. No downloaded audio or network required.
const fs = require('node:fs');
const path = require('node:path');
const sampleRate = 22050;
const destination = path.join(__dirname, '..', 'assets', 'audio', 'feedback');
const cues = {
  tap: [[784, 0, 0.09]],
  correct: [[523.25, 0, 0.18], [659.25, 0.12, 0.18], [783.99, 0.24, 0.24]],
  retry: [[392, 0, 0.18], [349.23, 0.15, 0.24]],
  complete: [[523.25, 0, 0.2], [659.25, 0.15, 0.2], [783.99, 0.3, 0.2], [1046.5, 0.48, 0.42]],
};
fs.mkdirSync(destination, { recursive: true });
for (const [name, notes] of Object.entries(cues)) {
  const duration = Math.max(...notes.map(([, start, length]) => start + length)) + 0.06;
  const samples = Math.ceil(duration * sampleRate);
  const wav = Buffer.alloc(44 + samples * 2);
  wav.write('RIFF', 0); wav.writeUInt32LE(wav.length - 8, 4); wav.write('WAVEfmt ', 8);
  wav.writeUInt32LE(16, 16); wav.writeUInt16LE(1, 20); wav.writeUInt16LE(1, 22);
  wav.writeUInt32LE(sampleRate, 24); wav.writeUInt32LE(sampleRate * 2, 28);
  wav.writeUInt16LE(2, 32); wav.writeUInt16LE(16, 34); wav.write('data', 36);
  wav.writeUInt32LE(samples * 2, 40);
  for (let i = 0; i < samples; i++) {
    let value = 0;
    for (const [frequency, start, length] of notes) {
      const t = i / sampleRate - start;
      if (t < 0 || t >= length) continue;
      const envelope = Math.min(1, t / 0.012) * Math.min(1, (length - t) / 0.05) * Math.exp(-3 * t / length);
      value += 0.32 * envelope * (Math.sin(2 * Math.PI * frequency * t) + 0.15 * Math.sin(4 * Math.PI * frequency * t));
    }
    wav.writeInt16LE(Math.round(Math.max(-1, Math.min(1, value)) * 32767), 44 + i * 2);
  }
  fs.writeFileSync(path.join(destination, `${name}.wav`), wav);
  console.log(`${name}.wav: ${duration.toFixed(2)}s`);
}
