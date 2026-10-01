import React, { useState } from 'react';
import { SCENARIOS } from '../data/scenarios';
import { Compass, CheckCircle2, XCircle, RotateCcw, HelpCircle, MapPin, ChevronRight } from 'lucide-react';

export const ScenarioTab: React.FC = () => {
  const [activeScenarioId, setActiveScenarioId] = useState<string>(SCENARIOS[0].id);
  // Answers state: key `${scenarioId}_${questionId}` -> chosen option index
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});

  const currentScenario = SCENARIOS.find((s) => s.id === activeScenarioId) || SCENARIOS[0];

  const handleSelectOption = (scenarioId: string, questionId: number, optionIndex: number) => {
    setUserAnswers((prev) => ({
      ...prev,
      [`${scenarioId}_${questionId}`]: optionIndex,
    }));
  };

  const handleResetQuestion = (scenarioId: string, questionId: number) => {
    setUserAnswers((prev) => {
      const next = { ...prev };
      delete next[`${scenarioId}_${questionId}`];
      return next;
    });
  };

  const handleResetAllInScenario = (scenarioId: string) => {
    setUserAnswers((prev) => {
      const next = { ...prev };
      currentScenario.questions.forEach((q) => {
        delete next[`${scenarioId}_${q.id}`];
      });
      return next;
    });
  };

  return (
    <div className="space-y-8">
      {/* Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-[#162c23] via-[#0f2019] to-[#162c23] border border-[#1e3b30] p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#4ade80]/20 border border-[#4ade80]/30 flex items-center justify-center">
            <Compass className="w-5 h-5 text-[#4ade80]" />
          </div>
          <div>
            <h2 className="font-serif-tc text-2xl sm:text-3xl font-bold text-white tracking-wide">
              10 大高山實戰情境演練
            </h2>
            <p className="text-xs sm:text-sm text-[#9ab3a6] mt-0.5">
              真實環境決策模擬・作答後即時顯示深度專業解析・可重複演練
            </p>
          </div>
        </div>

        {/* Scenarios Selector Tabs */}
        <div className="pt-2 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {SCENARIOS.map((sc) => {
            const isActive = sc.id === activeScenarioId;
            return (
              <button
                key={sc.id}
                type="button"
                onClick={() => setActiveScenarioId(sc.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
                  isActive
                    ? 'bg-[#16a34a] text-white shadow-md shadow-[#16a34a]/30 border border-[#4ade80]/50'
                    : 'bg-[#0a1510] text-[#9ab3a6] hover:text-white hover:bg-[#162c23] border border-[#1e3b30]'
                }`}
                aria-label={`切換至 ${sc.title}`}
              >
                <span className="font-mono font-bold">案例 {sc.number}</span>
                <span className="hidden sm:inline">{sc.title.split('：')[1]?.slice(0, 8)}...</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Current Scenario Card */}
      <div className="rounded-2xl bg-[#0f2019] border border-[#1e3b30] p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1e3b30] pb-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded bg-[#162c23] text-[#4ade80] text-xs font-mono font-bold border border-[#2e5746]">
                CASE #{currentScenario.number < 10 ? `0${currentScenario.number}` : currentScenario.number}
              </span>
              <span className="text-xs text-[#9ab3a6] flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#fbbf24]" />
                {currentScenario.environment}
              </span>
            </div>
            <h2 className="font-serif-tc text-xl sm:text-2xl font-bold text-white tracking-wide">
              {currentScenario.title}
            </h2>
            <p className="text-sm text-[#d1e0d7] leading-relaxed max-w-3xl">
              {currentScenario.description}
            </p>
          </div>

          <button
            type="button"
            onClick={() => handleResetAllInScenario(currentScenario.id)}
            className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium text-[#9ab3a6] hover:text-white bg-[#162c23] hover:bg-[#1e3b30] border border-[#1e3b30] transition-colors cursor-pointer"
            aria-label="清空並重置本案所有作答"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>重置本案作答</span>
          </button>
        </div>

        {/* 6 Questions List */}
        <div className="space-y-8">
          {currentScenario.questions.map((q, qIndex) => {
            const answerKey = `${currentScenario.id}_${q.id}`;
            const selectedOption = userAnswers[answerKey];
            const isAnswered = selectedOption !== undefined;
            const isCorrect = isAnswered && selectedOption === q.correctIndex;

            return (
              <div
                key={q.id}
                className="rounded-xl bg-[#162c23]/60 border border-[#1e3b30] p-5 sm:p-6 space-y-4"
              >
                {/* Question Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-[#162c23] text-[#4ade80] border border-[#2e5746] flex items-center justify-center text-xs font-mono font-bold shrink-0 mt-0.5">
                      Q{q.id}
                    </span>
                    <h3 className="font-serif-tc text-base font-bold text-white leading-snug">
                      {q.question}
                    </h3>
                  </div>

                  {isAnswered && (
                    <button
                      type="button"
                      onClick={() => handleResetQuestion(currentScenario.id, q.id)}
                      className="text-xs text-[#9ab3a6] hover:text-[#4ade80] flex items-center gap-1 shrink-0 p-1 cursor-pointer"
                      title="重新作答本題"
                      aria-label={`重新作答第 ${q.id} 題`}
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">重新作答</span>
                    </button>
                  )}
                </div>

                {/* 4 Options */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  {q.options.map((option, optIdx) => {
                    const isSelected = selectedOption === optIdx;
                    const isTargetCorrect = optIdx === q.correctIndex;

                    let btnStyle = 'bg-[#0a1510] hover:bg-[#162c23] text-[#d1e0d7] border-[#1e3b30]';

                    if (isAnswered) {
                      if (isTargetCorrect) {
                        btnStyle = 'bg-[#16a34a]/20 text-[#4ade80] border-[#16a34a] font-medium';
                      } else if (isSelected && !isTargetCorrect) {
                        btnStyle = 'bg-[#dc2626]/20 text-[#f87171] border-[#dc2626] line-through';
                      } else {
                        btnStyle = 'bg-[#0a1510]/60 text-[#9ab3a6]/60 border-[#1e3b30]/50';
                      }
                    }

                    return (
                      <button
                        key={optIdx}
                        type="button"
                        onClick={() => handleSelectOption(currentScenario.id, q.id, optIdx)}
                        className={`text-left p-3.5 rounded-xl border text-xs sm:text-sm leading-relaxed transition-all flex items-start gap-2.5 cursor-pointer ${btnStyle}`}
                        aria-label={`選項 ${String.fromCharCode(65 + optIdx)}: ${option}`}
                      >
                        <span className="w-5 h-5 rounded-md bg-[#162c23] border border-[#2e5746] flex items-center justify-center font-mono text-[11px] shrink-0 mt-0.5">
                          {String.fromCharCode(65 + optIdx)}
                        </span>
                        <span className="flex-1">{option}</span>
                        {isAnswered && isTargetCorrect && (
                          <CheckCircle2 className="w-4 h-4 text-[#4ade80] shrink-0 mt-0.5" />
                        )}
                        {isAnswered && isSelected && !isTargetCorrect && (
                          <XCircle className="w-4 h-4 text-[#f87171] shrink-0 mt-0.5" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Explanation Box - displayed immediately after answering */}
                {isAnswered && (
                  <div
                    className={`mt-4 p-4 rounded-xl border text-xs leading-relaxed space-y-1.5 transition-all ${
                      isCorrect
                        ? 'bg-[#16a34a]/10 border-[#16a34a]/40 text-[#f0f6f2]'
                        : 'bg-[#fbbf24]/10 border-[#fbbf24]/40 text-[#f0f6f2]'
                    }`}
                  >
                    <div className="flex items-center gap-2 font-serif-tc font-bold">
                      {isCorrect ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-[#4ade80]" />
                          <span className="text-[#4ade80]">解答正確！實務解析：</span>
                        </>
                      ) : (
                        <>
                          <HelpCircle className="w-4 h-4 text-[#fbbf24]" />
                          <span className="text-[#fbbf24]">作答解析（正確答案為 {String.fromCharCode(65 + q.correctIndex)}）：</span>
                        </>
                      )}
                    </div>
                    <p className="text-[#d1e0d7] pl-6">{q.explanation}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
