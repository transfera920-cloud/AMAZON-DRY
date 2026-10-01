import React from 'react';
import { ZONES } from '../data/constants';
import { Shield, BookOpen, Compass, Activity, CheckCircle2, AlertTriangle, ArrowRight, Droplets, Clock } from 'lucide-react';

interface HomeTabProps {
  onNavigate: (tabId: string) => void;
}

export const HomeTab: React.FC<HomeTabProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-12">
      {/* Hero Section with the ONLY <h1> of the page */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-[#162c23] to-[#0f2019] border border-[#1e3b30] p-6 sm:p-10 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-[#4ade80]/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-4xl space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[#22c55e]/15 text-[#4ade80] border border-[#22c55e]/30">
            <Shield className="w-3.5 h-3.5" />
            <span>亞馬遜國家山岳協會・官方安全技術標準</span>
          </div>

          <h1 className="font-serif-tc text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            登山全域乾燥管理實務教案
          </h1>

          <p className="text-base sm:text-lg text-[#9ab3a6] leading-relaxed max-w-3xl">
            高山失溫的真凶是「濕」而非「冷」。本教案由亞馬遜國家山岳協會制定，涵蓋登山行進防線、營地乾燥分區（Z/A/B/C/D）、水分帳本、裝備防潮與防污染解除實務，確保多日縱走極致乾爽與安全。
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => onNavigate('curriculum')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#16a34a] hover:bg-[#15803d] text-white font-medium text-sm transition-all shadow-lg shadow-[#16a34a]/25 focus:ring-2 focus:ring-[#4ade80] cursor-pointer"
            >
              <BookOpen className="w-4 h-4" />
              <span>研讀 34 章實務教案</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => onNavigate('scenario')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#162c23] hover:bg-[#1e3b30] text-[#f0f6f2] font-medium text-sm border border-[#2e5746] transition-all cursor-pointer"
            >
              <Compass className="w-4 h-4 text-[#4ade80]" />
              <span>10 大實戰情境演練</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('dashboard')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#162c23] hover:bg-[#1e3b30] text-[#f0f6f2] font-medium text-sm border border-[#2e5746] transition-all cursor-pointer"
            >
              <Activity className="w-4 h-4 text-[#38bdf8]" />
              <span>進入水分帳本主控台</span>
            </button>
          </div>
        </div>
      </section>

      {/* Core Concept: 5 Zones Z / A / B / C / D */}
      <section className="space-y-6">
        <div className="border-b border-[#1e3b30] pb-4">
          <h2 className="font-serif-tc text-2xl sm:text-3xl font-bold text-white tracking-wide flex items-center gap-2.5">
            <Droplets className="w-6 h-6 text-[#38bdf8]" />
            <span>核心架構：五大乾燥分區體系（Zones Z / A / B / C / D）</span>
          </h2>
          <p className="text-sm text-[#9ab3a6] mt-1.5">
            嚴禁混淆分區邊界。以實體隔離阻斷毛細擴散與手部接觸引發的連鎖交叉污染。
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {Object.values(ZONES).map((zone) => (
            <div
              key={zone.id}
              className="rounded-xl p-5 border transition-all hover:border-opacity-100 flex flex-col justify-between"
              style={{
                backgroundColor: zone.bgColor,
                borderColor: zone.borderColor
              }}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span
                    className="font-serif-tc text-xs font-bold px-2.5 py-1 rounded-md text-white uppercase tracking-wider"
                    style={{ backgroundColor: zone.borderColor }}
                  >
                    Zone {zone.id}
                  </span>
                  <span className="text-xs font-semibold" style={{ color: zone.color }}>
                    {zone.badge}
                  </span>
                </div>

                <h3 className="font-serif-tc text-base font-bold text-white">
                  {zone.name}
                </h3>

                <p className="text-xs text-[#d1e0d7] leading-relaxed">
                  {zone.description}
                </p>

                <div className="space-y-1.5 pt-2 border-t border-white/10">
                  <p className="text-[11px] font-semibold text-[#9ab3a6] uppercase tracking-wider">
                    涵蓋核心物件：
                  </p>
                  <ul className="text-xs text-[#f0f6f2] space-y-1 pl-3 list-disc marker:text-[#4ade80]">
                    {zone.items.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-white/10 text-xs">
                <span className="font-semibold text-white">管理鐵律：</span>
                <span className="text-[#e2ece6] ml-1">{zone.rule}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Golden 5 Minutes Protocol */}
      <section className="rounded-2xl bg-[#0f2019] border border-[#1e3b30] p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#fbbf24]/15 border border-[#fbbf24]/30 flex items-center justify-center">
            <Clock className="w-5 h-5 text-[#fbbf24]" />
          </div>
          <div>
            <h2 className="font-serif-tc text-xl sm:text-2xl font-bold text-white">
              抵達營地「黃金 5 分鐘」SOP
            </h2>
            <p className="text-xs text-[#9ab3a6]">
              劇烈運動停止後體溫驟降的關鍵生死窗口，必須強制全員依序執行。
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-[#162c23] border border-[#1e3b30] space-y-2">
            <div className="w-6 h-6 rounded-full bg-[#16a34a] text-white flex items-center justify-center text-xs font-bold">1</div>
            <h3 className="font-serif-tc text-sm font-bold text-white">避雨屏障建立</h3>
            <p className="text-xs text-[#9ab3a6] leading-relaxed">
              優先架設外帳或避雨天幕。外帳未固定前，嚴禁卸下背包中的 Zone Z 核心裝備。
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#162c23] border border-[#1e3b30] space-y-2">
            <div className="w-6 h-6 rounded-full bg-[#16a34a] text-white flex items-center justify-center text-xs font-bold">2</div>
            <h3 className="font-serif-tc text-sm font-bold text-white">前庭過渡剝除</h3>
            <p className="text-xs text-[#9ab3a6] leading-relaxed">
              在前庭脫下泥濘登山鞋（Zone D）與滴水雨衣褲（Zone C），絕不可帶入內帳。
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#162c23] border border-[#1e3b30] space-y-2">
            <div className="w-6 h-6 rounded-full bg-[#16a34a] text-white flex items-center justify-center text-xs font-bold">3</div>
            <h3 className="font-serif-tc text-sm font-bold text-white">體表與手部乾爽</h3>
            <p className="text-xs text-[#9ab3a6] leading-relaxed">
              以吸水巾擦乾頭面、手部與雙腳，手部未達絕對乾燥前，嚴禁碰觸純乾備用防水袋。
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#162c23] border border-[#1e3b30] space-y-2">
            <div className="w-6 h-6 rounded-full bg-[#16a34a] text-white flex items-center justify-center text-xs font-bold">4</div>
            <h3 className="font-serif-tc text-sm font-bold text-white">Zone Z 乾衣更換</h3>
            <p className="text-xs text-[#9ab3a6] leading-relaxed">
              迅速換下微濕排汗內層，換穿純乾羊毛底層與乾燥羊毛襪，換下衣物立即密封隔離。
            </p>
          </div>
        </div>
      </section>

      {/* Three Functional Blocks Navigation */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div
          onClick={() => onNavigate('curriculum')}
          className="group cursor-pointer rounded-xl bg-[#0f2019] hover:bg-[#162c23] border border-[#1e3b30] hover:border-[#4ade80]/50 p-6 transition-all space-y-3 flex flex-col justify-between"
        >
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-xl bg-[#162c23] group-hover:bg-[#16a34a]/20 border border-[#2e5746] flex items-center justify-center transition-colors">
              <BookOpen className="w-6 h-6 text-[#4ade80]" />
            </div>
            <h2 className="font-serif-tc text-xl font-bold text-white group-hover:text-[#4ade80] transition-colors">
              34 章全域乾燥實務教案
            </h2>
            <p className="text-xs text-[#9ab3a6] leading-relaxed">
              完整收錄認知、分區、打包、行進、營地、帳內、換裝、睡眠、乾衣、污染、撤營、多日與緊急應變共 34 章深度內容。
            </p>
          </div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#4ade80] pt-2">
            <span>瀏覽完整 34 章節</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        <div
          onClick={() => onNavigate('scenario')}
          className="group cursor-pointer rounded-xl bg-[#0f2019] hover:bg-[#162c23] border border-[#1e3b30] hover:border-[#4ade80]/50 p-6 transition-all space-y-3 flex flex-col justify-between"
        >
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-xl bg-[#162c23] group-hover:bg-[#16a34a]/20 border border-[#2e5746] flex items-center justify-center transition-colors">
              <Compass className="w-6 h-6 text-[#4ade80]" />
            </div>
            <h2 className="font-serif-tc text-xl font-bold text-white group-hover:text-[#4ade80] transition-colors">
              10 大高山實戰情境演練
            </h2>
            <p className="text-xs text-[#9ab3a6] leading-relaxed">
              白石池豪雨紮營、南湖圈谷 2°C 泥濘、奇萊出汗失溫等 10 個經典嚴苛案例，每案 6 題交互測驗與深度解析。
            </p>
          </div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#4ade80] pt-2">
            <span>進入情境演練測驗</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        <div
          onClick={() => onNavigate('dashboard')}
          className="group cursor-pointer rounded-xl bg-[#0f2019] hover:bg-[#162c23] border border-[#1e3b30] hover:border-[#38bdf8]/50 p-6 transition-all space-y-3 flex flex-col justify-between"
        >
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-xl bg-[#162c23] group-hover:bg-[#38bdf8]/20 border border-[#2e5746] flex items-center justify-center transition-colors">
              <Activity className="w-6 h-6 text-[#38bdf8]" />
            </div>
            <h2 className="font-serif-tc text-xl font-bold text-white group-hover:text-[#38bdf8] transition-colors">
              多日動態水分帳本管理台
            </h2>
            <p className="text-xs text-[#9ab3a6] leading-relaxed">
              Day 新增/複製/刪除、分區狀態監控、行進防線檢核、帳篷反潮警示、乾變濕事件、受潮人工確認解除隔離與水分赤字計算。
            </p>
          </div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#38bdf8] pt-2">
            <span>開啟水分帳本管理</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </section>
    </div>
  );
};
