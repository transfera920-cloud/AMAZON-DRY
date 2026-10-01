import React, { useState } from 'react';
import { CHAPTERS } from '../data/chapters';
import { BookOpen, CheckCircle, AlertCircle, ArrowUpRight, Search, Filter } from 'lucide-react';

export const CurriculumTab: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('全部');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = ['全部', '基礎認知', '分區體系', '裝備打包', '行進防線', '動態調控', '營地防線', '帳內管理', '水分隔離', '睡眠防護', '裝備復原', '污染管理', '撤營移動', '多日縱走', '緊急應變', '總結心法'];

  const filteredChapters = CHAPTERS.filter((ch) => {
    const matchesCategory = selectedCategory === '全部' || ch.category === selectedCategory;
    const matchesSearch =
      ch.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ch.scenario.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ch.action.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-[#162c23] via-[#0f2019] to-[#162c23] border border-[#1e3b30] p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#16a34a]/20 border border-[#4ade80]/30 flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-[#4ade80]" />
          </div>
          <div>
            <h2 className="font-serif-tc text-2xl sm:text-3xl font-bold text-white tracking-wide">
              全域乾燥管理實務教案（共 34 章）
            </h2>
            <p className="text-xs sm:text-sm text-[#9ab3a6] mt-0.5">
              亞馬遜國家山岳協會核心訓練規範・從打包、行進、進帳到多日水分收支完整體系
            </p>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="pt-2 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9ab3a6]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜尋章節關鍵字（如：睡袋、反潮、黃金5分鐘、箭竹）..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#0a1510] border border-[#1e3b30] text-sm text-[#f0f6f2] placeholder-[#9ab3a6]/60 focus:outline-none focus:border-[#4ade80] focus:ring-1 focus:ring-[#4ade80]"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            <Filter className="w-4 h-4 text-[#9ab3a6] shrink-0 hidden sm:block" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 rounded-xl bg-[#0a1510] border border-[#1e3b30] text-sm text-[#f0f6f2] focus:outline-none focus:border-[#4ade80]"
              aria-label="依分類篩選章節"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Quick chapter jumping links */}
        <div className="pt-2 flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1">
          {CHAPTERS.map((ch) => (
            <a
              key={ch.id}
              href={`#${ch.id}`}
              className="px-2 py-0.5 rounded text-[11px] font-mono bg-[#0a1510] hover:bg-[#162c23] text-[#9ab3a6] hover:text-[#4ade80] border border-[#1e3b30] transition-colors"
              title={ch.title}
            >
              Ch.{ch.number < 10 ? `0${ch.number}` : ch.number}
            </a>
          ))}
        </div>
      </div>

      {/* Chapters List: CRITICAL requirement: ALL 34 chapters MUST exist in the DOM as <section id="ch-XX"> with <h2>, <h3>, <p> */}
      <div className="space-y-6">
        {CHAPTERS.map((chapter) => {
          // If filtered out by search, we keep it in DOM with styling rather than unmounting,
          // guaranteeing 100% presence in the DOM for search engines and technical SEO!
          const isVisible = filteredChapters.some((c) => c.id === chapter.id);

          return (
            <section
              key={chapter.id}
              id={chapter.id}
              className={`rounded-2xl bg-[#0f2019] border border-[#1e3b30] p-6 sm:p-8 space-y-6 scroll-mt-24 transition-opacity ${
                isVisible ? 'opacity-100' : 'hidden'
              }`}
            >
              {/* Chapter Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1e3b30] pb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-[#162c23] text-[#4ade80] border border-[#2e5746]">
                      Chapter {chapter.number < 10 ? `0${chapter.number}` : chapter.number}
                    </span>
                    <span className="text-xs text-[#9ab3a6] px-2 py-0.5 rounded bg-[#162c23]/60">
                      {chapter.category}
                    </span>
                  </div>
                  {/* Semantic <h2> for chapter title */}
                  <h2 className="font-serif-tc text-xl sm:text-2xl font-bold text-white tracking-wide">
                    {chapter.title}
                  </h2>
                </div>

                <a
                  href={`#${chapter.id}`}
                  className="self-start sm:self-auto text-xs text-[#9ab3a6] hover:text-[#4ade80] flex items-center gap-1 font-mono transition-colors"
                  aria-label={`章節錨點 ${chapter.id}`}
                >
                  <span>#{chapter.id}</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Subsections: semantic <h3> and <p> */}
              <div className="grid grid-cols-1 gap-4">
                {/* Scenario */}
                <div className="p-4 rounded-xl bg-[#162c23]/80 border border-[#1e3b30] space-y-1.5">
                  <h3 className="font-serif-tc text-xs font-bold text-[#fbbf24] uppercase tracking-wider flex items-center gap-1.5">
                    <span>【情境描述】</span>
                  </h3>
                  <p className="text-sm text-[#f0f6f2] leading-relaxed">
                    {chapter.scenario}
                  </p>
                </div>

                {/* Why */}
                <div className="p-4 rounded-xl bg-[#162c23]/50 border border-[#1e3b30] space-y-1.5">
                  <h3 className="font-serif-tc text-xs font-bold text-[#f87171] uppercase tracking-wider flex items-center gap-1.5">
                    <span>【成因分析】為什麼會發生</span>
                  </h3>
                  <p className="text-sm text-[#d1e0d7] leading-relaxed">
                    {chapter.why}
                  </p>
                </div>

                {/* Action */}
                <div className="p-4 rounded-xl bg-[#162c23] border border-[#2e5746] space-y-1.5">
                  <h3 className="font-serif-tc text-xs font-bold text-[#4ade80] uppercase tracking-wider flex items-center gap-1.5">
                    <span>【實際作法】防範與應對步驟</span>
                  </h3>
                  <p className="text-sm text-[#f0f6f2] font-medium leading-relaxed">
                    {chapter.action}
                  </p>
                </div>

                {/* Specific correct/wrong blocks for Chapter 4 and Chapter 12 */}
                {chapter.correct && (
                  <div className="p-4 rounded-xl bg-[#16a34a]/10 border border-[#16a34a]/40 space-y-1">
                    <h3 className="font-serif-tc text-xs font-bold text-[#4ade80] flex items-center gap-1.5">
                      <CheckCircle className="w-4 h-4 text-[#4ade80]" />
                      <span>【正確示範】</span>
                    </h3>
                    <p className="text-sm text-[#f0f6f2] leading-relaxed pl-5">
                      {chapter.correct}
                    </p>
                  </div>
                )}

                {chapter.wrong && (
                  <div className="p-4 rounded-xl bg-[#dc2626]/10 border border-[#dc2626]/40 space-y-1">
                    <h3 className="font-serif-tc text-xs font-bold text-[#f87171] flex items-center gap-1.5">
                      <AlertCircle className="w-4 h-4 text-[#f87171]" />
                      <span>【常見錯誤】</span>
                    </h3>
                    <p className="text-sm text-[#f0f6f2] leading-relaxed pl-5">
                      {chapter.wrong}
                    </p>
                  </div>
                )}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
};
