import React from 'react';
import { ShieldCheck, Mountain, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-20 border-t border-[#1e3b30] bg-[#07100c] text-[#9ab3a6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Column */}
          <div className="md:col-span-2 space-y-4">
            <div>
              <a
                href="https://amazon-hike.com/"
                className="font-serif-tc text-xl font-bold text-white hover:text-[#4ade80] transition-colors inline-block"
              >
                亞馬遜國家山岳協會
              </a>
              <p className="text-xs text-[#9ab3a6] font-mono tracking-wider uppercase mt-0.5">
                Amazon Alpine Association
              </p>
            </div>
            <p className="text-sm leading-relaxed text-[#9ab3a6] max-w-md">
              以科學化濕度管理、防失溫技術防線與嚴格的裝備操作紀律，守護每一位高山攀登者與縱走探險者的生命安全。全域乾燥，是登頂前最重要的保命契約。
            </p>
            <div className="pt-2">
              <a
                href="https://amazon-hike.com/"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-[#4ade80] hover:text-[#86efac] underline underline-offset-4 transition-colors"
              >
                <span>訪問亞馬遜國家山岳協會官方入口</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <p className="text-sm font-semibold text-[#f0f6f2] font-serif-tc tracking-wide">
              教案核心模組
            </p>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#curriculum" className="hover:text-white transition-colors">
                  34 章全域乾燥實務教案
                </a>
              </li>
              <li>
                <a href="#scenario" className="hover:text-white transition-colors">
                  10 大高山實戰情境演練
                </a>
              </li>
              <li>
                <a href="#dashboard" className="hover:text-white transition-colors">
                  多日動態水分帳本管理台
                </a>
              </li>
              <li>
                <a href="https://amazon-hike.com/" className="hover:text-white transition-colors">
                  協會山岳技術認證專區
                </a>
              </li>
            </ul>
          </div>

          {/* Safety Notice */}
          <div className="space-y-3">
            <p className="text-sm font-semibold text-[#f0f6f2] font-serif-tc tracking-wide">
              乾燥防線金律
            </p>
            <div className="p-3.5 rounded-lg bg-[#0f2019] border border-[#1e3b30] text-xs leading-relaxed text-[#9ab3a6] space-y-1.5">
              <div className="flex items-center gap-1.5 text-[#4ade80] font-medium">
                <ShieldCheck className="w-4 h-4" />
                <span>Zone Z 零容忍準則</span>
              </div>
              <p>羽絨睡袋與備用乾衣為不可替代之生命核心。未確認手部乾燥前，切勿開啟氣密防水袋。</p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-[#1e3b30]/60 flex flex-col sm:flex-row items-center justify-between text-xs gap-4">
          <p>© {new Date().getFullYear()} 亞馬遜國家山岳協會 版權所有。All Rights Reserved.</p>
          <div className="flex items-center gap-4">
            <a href="https://amazon-hike.com/" className="hover:text-[#f0f6f2] transition-colors">
              協會首頁
            </a>
            <span className="text-[#1e3b30]">•</span>
            <a href="https://amazon-hike.com/chapter24/" className="text-[#4ade80] hover:underline">
              教案版本 Chapter 24 (正式版)
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
