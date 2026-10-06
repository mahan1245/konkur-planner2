// Replaces every CDN dependency with local files so the app works fully offline.
import { cpSync, existsSync, mkdirSync, rmSync, statSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

const out = 'www/vendor';
rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });

execFileSync('npx', ['tailwindcss', '-c', 'tailwind.config.cjs', '-i', 'src/input.css', '-o', `${out}/tailwind.css`, '--minify'],
  { stdio: 'inherit', shell: process.platform === 'win32' });
cpSync('node_modules/chart.js/dist/chart.umd.js', `${out}/chart.umd.js`);
cpSync('node_modules/@fortawesome/fontawesome-free/css/all.min.css', `${out}/fa/css/all.min.css`);
cpSync('node_modules/@fortawesome/fontawesome-free/webfonts', `${out}/fa/webfonts`, { recursive: true });
// keep the package's own folder layout so the font-face CSS url(...) paths stay valid
cpSync('node_modules/vazirmatn', `${out}/vazirmatn`, { recursive: true, filter: (src) => statSync(src).isDirectory() || /\.(css|woff2)$/i.test(src) });

const required = ['tailwind.css', 'chart.umd.js', 'fa/css/all.min.css', 'vazirmatn/Vazirmatn-font-face.css'];
const missing = required.filter((f) => !existsSync(`${out}/${f}`));
if (missing.length) { console.error('فایل‌های زیر ساخته نشد:\n - ' + missing.join('\n - ')); process.exit(1); }
console.log('✔ vendor files ready');
