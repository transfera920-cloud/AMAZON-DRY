import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { CHAPTERS } from '../src/data/chapters';
import { ZONES } from '../src/data/constants';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distIndexPath = path.resolve(__dirname, '../dist/index.html');

if (!fs.existsSync(distIndexPath)) {
  console.error('dist/index.html not found! Prerender must be run after vite build.');
  process.exit(1);
}

let htmlContent = fs.readFileSync(distIndexPath, 'utf-8');

// Build semantic prerender markup
const prerenderHtml = `
  <div class="min-h-screen bg-[#0a1510] text-[#f0f6f2] flex flex-col font-sans">
    <header class="border-b border-[#1e3b30] bg-[#0a1510]/95 px-4 py-4">
      <div class="max-w-7xl mx-auto flex items-center justify-between">
        <a href="https://amazon-hike.com/" class="flex items-center gap-2 font-serif font-bold text-white text-lg">
          亞馬遜國家山岳協會
        </a>
        <span class="text-xs text-[#4ade80] px-2.5 py-1 rounded bg-[#162c23] border border-[#2e5746]">
          全域乾燥管理實務教案
        </span>
      </div>
    </header>

    <main class="max-w-7xl mx-auto px-4 py-8 space-y-12">
      <!-- Only one h1 on the page -->
      <section class="rounded-2xl bg-gradient-to-b from-[#162c23] to-[#0f2019] border border-[#1e3b30] p-8 space-y-4">
        <h1 class="font-serif text-3xl sm:text-5xl font-black text-white leading-tight">
          登山全域乾燥管理實務教案
        </h1>
        <p class="text-base text-[#9ab3a6] leading-relaxed max-w-3xl">
          高山失溫的真凶是「濕」而非「冷」。本教案由亞馬遜國家山岳協會制定，涵蓋登山行進防線、營地乾燥分區（Z/A/B/C/D）、水分帳本、裝備防潮與防污染解除實務，確保多日縱走極致乾爽與安全。
        </p>
      </section>

      <!-- 5 Zones overview -->
      <section class="space-y-4">
        <h2 class="font-serif text-2xl font-bold text-white">核心架構：五大乾燥分區體系（Zones Z / A / B / C / D）</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          ${Object.values(ZONES)
            .map(
              (z) => `
            <div class="p-4 rounded-xl border border-[#1e3b30] bg-[#0f2019] space-y-2">
              <span class="text-xs font-bold px-2 py-0.5 rounded text-white" style="background-color: ${z.borderColor}">
                Zone ${z.id}
              </span>
              <h3 class="font-serif font-bold text-white text-base">${z.name}</h3>
              <p class="text-xs text-[#9ab3a6]">${z.description}</p>
              <p class="text-xs text-[#f0f6f2] font-semibold">管理鐵律：<span class="text-[#d1e0d7] font-normal">${z.rule}</span></p>
            </div>
          `
            )
            .join('')}
        </div>
      </section>

      <!-- All 34 Chapters for 100% SEO static crawlability -->
      <section class="space-y-6">
        <h2 class="font-serif text-2xl font-bold text-white">全域乾燥管理 34 章教案清單</h2>
        <div class="space-y-6">
          ${CHAPTERS.map(
            (ch) => `
            <section id="${ch.id}" class="rounded-xl bg-[#0f2019] border border-[#1e3b30] p-6 space-y-4">
              <div class="flex items-center gap-2">
                <span class="text-xs font-mono font-bold px-2 py-0.5 rounded bg-[#162c23] text-[#4ade80]">
                  Chapter ${ch.number < 10 ? `0${ch.number}` : ch.number}
                </span>
                <span class="text-xs text-[#9ab3a6]">${ch.category}</span>
              </div>
              <h2 class="font-serif text-xl font-bold text-white">${ch.title}</h2>
              <div class="space-y-3">
                <div class="space-y-1">
                  <h3 class="text-xs font-bold text-[#fbbf24]">【情境描述】</h3>
                  <p class="text-sm text-[#f0f6f2]">${ch.scenario}</p>
                </div>
                <div class="space-y-1">
                  <h3 class="text-xs font-bold text-[#f87171]">【成因分析】</h3>
                  <p class="text-sm text-[#d1e0d7]">${ch.why}</p>
                </div>
                <div class="space-y-1">
                  <h3 class="text-xs font-bold text-[#4ade80]">【實際作法】</h3>
                  <p class="text-sm text-[#f0f6f2] font-medium">${ch.action}</p>
                </div>
                ${
                  ch.correct
                    ? `
                  <div class="space-y-1">
                    <h3 class="text-xs font-bold text-[#4ade80]">【正確示範】</h3>
                    <p class="text-sm text-[#f0f6f2]">${ch.correct}</p>
                  </div>
                `
                    : ''
                }
                ${
                  ch.wrong
                    ? `
                  <div class="space-y-1">
                    <h3 class="text-xs font-bold text-[#f87171]">【常見錯誤】</h3>
                    <p class="text-sm text-[#f0f6f2]">${ch.wrong}</p>
                  </div>
                `
                    : ''
                }
              </div>
            </section>
          `
          ).join('')}
        </div>
      </section>
    </main>

    <footer class="mt-16 border-t border-[#1e3b30] bg-[#07100c] px-4 py-8 text-center text-xs text-[#9ab3a6]">
      <p class="mb-2">
        <a href="https://amazon-hike.com/" class="text-white hover:text-[#4ade80] font-bold">亞馬遜國家山岳協會</a>
        ・Amazon Alpine Association
      </p>
      <p>© ${new Date().getFullYear()} 亞馬遜國家山岳協會 版權所有。</p>
    </footer>
  </div>
`;

// Inject into #root
const rootMarker = '<div id="root">';
if (htmlContent.includes(rootMarker)) {
  const rootIndex = htmlContent.indexOf(rootMarker);
  const afterRoot = htmlContent.indexOf('</div>', rootIndex);

  // Replace content of #root
  htmlContent =
    htmlContent.substring(0, rootIndex + rootMarker.length) +
    prerenderHtml +
    htmlContent.substring(afterRoot);

  fs.writeFileSync(distIndexPath, htmlContent, 'utf-8');
  console.log('✓ Successfully prerendered 34 chapters, <h1>, and semantic SEO content into dist/index.html!');
} else {
  console.warn('Could not find <div id="root"> in dist/index.html');
}
