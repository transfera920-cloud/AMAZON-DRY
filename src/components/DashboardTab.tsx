import React, { useState, useEffect } from 'react';
import {
  DayLedgerData,
  LedgerStore,
  DryToWetIncident,
  ContaminationCase,
  ZoneId,
} from '../types';
import {
  ZONES,
  ENV_RISK_OPTIONS,
  SOURCE_OPTIONS,
  SEVERITY_OPTIONS,
  DRIP_LOCATIONS,
} from '../data/constants';
import {
  Activity,
  Plus,
  Copy,
  Trash2,
  Save,
  AlertTriangle,
  ShieldCheck,
  Droplets,
  CloudRain,
  Flame,
  CheckCircle2,
  Clock,
  Tent,
  RefreshCw,
  Lock,
  Unlock,
} from 'lucide-react';

const LOCAL_STORAGE_KEY = 'amazon_moisture_ledger';

const createDefaultDay = (dayNum: number): DayLedgerData => ({
  dayNumber: dayNum,
  date: new Date().toISOString().split('T')[0],
  routeSegment: `第 ${dayNum} 天縱走路線`,
  weatherSummary: '陣雨伴隨濃霧，高濕度',
  envRisks: [ENV_RISK_OPTIONS[0], ENV_RISK_OPTIONS[1]],
  zones: {
    Z: { status: 'safe', moistureLevel: '0%（純乾）', notes: '羽絨睡袋與備用衣物雙層密封，未受潮' },
    A: { status: 'safe', moistureLevel: '15%（行進出汗）', notes: '起步微冷，通風良好' },
    B: { status: 'safe', moistureLevel: '5%（帳內微露）', notes: '睡墊與地布保持乾爽隔離' },
    C: { status: 'warning', moistureLevel: '60%（表層流淌水）', notes: '雨衣雨褲懸掛前庭滴水' },
    D: { status: 'alert', moistureLevel: '100%（泥濘重浸潤）', notes: '登山鞋全濕，置於前庭外側' },
  },
  marchingDefense: {
    baseLayerDrying: true,
    ventPitsOpen: true,
    paceAdjustedForSweat: true,
    glovesProtection: true,
    notes: '行進中全開腋下拉鍊，配速控制於有氧心率區，出汗量適中。',
  },
  goldenFiveMinutes: {
    completedImmediately: true,
    rainJacketRemovedBeforeTent: true,
    dryZoneBagSealed: true,
    warmLayersDoffedInside: true,
    notes: '進帳前確實於前庭脫除濕鞋與雨衣，手部徹底擦乾後方開啟睡袋。',
  },
  coreGear: {
    sleepingBagDry: true,
    downJacketDry: true,
    spareClothesDry: true,
    insoleMoisturePercent: 85,
  },
  tentManagement: {
    outerCondensation: 'moderate',
    innerDripping: false,
    dripLocations: [DRIP_LOCATIONS[0]],
    tarpVented: true,
    footboxClearOfFly: true,
    alertMessage: '夜晚溪谷濕度高，請維持天窗開啟並準備鹿皮巾擦拭帳壁。',
  },
  dryToWetIncidents: [
    {
      id: 'inc-1',
      timestamp: '15:30',
      item: '右腳羊毛襪',
      source: SOURCE_OPTIONS[3],
      severity: SEVERITY_OPTIONS[1],
      actionTaken: '更換純乾睡眠襪，將濕襪放入前庭密封污衣袋隔離。',
    },
  ],
  contaminations: [
    {
      id: 'cont-1',
      item: '保溫瓶外壁水氣沾染中層薄刷毛',
      contaminatedBy: '水壺表面冷凝水',
      quarantineZone: 'Zone C 隔離待檢區',
      isManuallyResolved: false,
      resolvedNote: '',
    },
  ],
  moistureBudget: {
    estimatedSweatLiters: 1.2,
    ambientHumidityPercent: 95,
    absorbedMoistureGrams: 350,
    remainingDryBuffer: '良好（75% 乾燥緩衝空間）',
  },
  dayNotes: '全員核心防線完整，明早預計 05:00 執行雨中拔營倒序打包流程。',
});

const getInitialStore = (): LedgerStore => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && Array.isArray(parsed.days) && parsed.days.length > 0) {
          return parsed;
        }
      } catch (err) {
        console.error('Failed to parse amazon_moisture_ledger', err);
      }
    }
  }
  return {
    days: [createDefaultDay(1)],
    currentDayIndex: 0,
    updatedAt: new Date().toISOString(),
  };
};

export const DashboardTab: React.FC = () => {
  const [store, setStore] = useState<LedgerStore>(getInitialStore);
  const [saveToast, setSaveToast] = useState(false);

  // New incident inputs
  const [newItem, setNewItem] = useState('');
  const [newSource, setNewSource] = useState(SOURCE_OPTIONS[0]);
  const [newSeverity, setNewSeverity] = useState(SEVERITY_OPTIONS[0]);
  const [newAction, setNewAction] = useState('');

  // New contamination case inputs
  const [newContamItem, setNewContamItem] = useState('');
  const [newContamSource, setNewContamSource] = useState('');

  // Save to LocalStorage whenever store updates
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(store));
  }, [store]);

  const currentDay = store.days[store.currentDayIndex] || store.days[0];

  const updateCurrentDay = (updater: (prev: DayLedgerData) => DayLedgerData) => {
    setStore((prev) => {
      const nextDays = [...prev.days];
      nextDays[prev.currentDayIndex] = updater(nextDays[prev.currentDayIndex]);
      return {
        ...prev,
        days: nextDays,
        updatedAt: new Date().toISOString(),
      };
    });
  };

  const handleAddDay = () => {
    const nextDayNum = store.days.length + 1;
    const newDay = createDefaultDay(nextDayNum);
    setStore((prev) => ({
      ...prev,
      days: [...prev.days, newDay],
      currentDayIndex: prev.days.length,
      updatedAt: new Date().toISOString(),
    }));
  };

  const handleDuplicateDay = () => {
    const cloned = JSON.parse(JSON.stringify(currentDay)) as DayLedgerData;
    cloned.dayNumber = store.days.length + 1;
    cloned.routeSegment = `${cloned.routeSegment}（複製品）`;
    setStore((prev) => ({
      ...prev,
      days: [...prev.days, cloned],
      currentDayIndex: prev.days.length,
      updatedAt: new Date().toISOString(),
    }));
  };

  const handleDeleteDay = () => {
    if (store.days.length <= 1) {
      alert('至少需保留一日水分帳本紀錄。');
      return;
    }
    if (!confirm(`確定要刪除 Day ${currentDay.dayNumber} 的水分帳本紀錄嗎？`)) return;

    setStore((prev) => {
      const filtered = prev.days.filter((_, idx) => idx !== prev.currentDayIndex);
      return {
        ...prev,
        days: filtered,
        currentDayIndex: Math.max(0, prev.currentDayIndex - 1),
        updatedAt: new Date().toISOString(),
      };
    });
  };

  const handleManualSave = () => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(store));
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2500);
  };

  // Add Dry-To-Wet Incident
  const handleAddIncident = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.trim()) return;
    const newInc: DryToWetIncident = {
      id: `inc-${Date.now()}`,
      timestamp: new Date().toTimeString().slice(0, 5),
      item: newItem.trim(),
      source: newSource,
      severity: newSeverity,
      actionTaken: newAction.trim() || '已實施乾濕隔離。',
    };
    updateCurrentDay((day) => ({
      ...day,
      dryToWetIncidents: [...day.dryToWetIncidents, newInc],
    }));
    setNewItem('');
    setNewAction('');
  };

  const handleDeleteIncident = (id: string) => {
    updateCurrentDay((day) => ({
      ...day,
      dryToWetIncidents: day.dryToWetIncidents.filter((i) => i.id !== id),
    }));
  };

  // Add Contamination Case
  const handleAddContamination = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContamItem.trim()) return;
    const newCase: ContaminationCase = {
      id: `cont-${Date.now()}`,
      item: newContamItem.trim(),
      contaminatedBy: newContamSource.trim() || '不明冷凝水',
      quarantineZone: 'Zone C 隔離待檢區',
      isManuallyResolved: false,
    };
    updateCurrentDay((day) => ({
      ...day,
      contaminations: [...day.contaminations, newCase],
    }));
    setNewContamItem('');
    setNewContamSource('');
  };

  // Toggle Manual Confirmation Release for Contamination
  const handleToggleManualRelease = (caseId: string, currentStatus: boolean) => {
    const nextStatus = !currentStatus;
    updateCurrentDay((day) => ({
      ...day,
      contaminations: day.contaminations.map((c) => {
        if (c.id === caseId) {
          return {
            ...c,
            isManuallyResolved: nextStatus,
            resolvedAt: nextStatus ? new Date().toTimeString().slice(0, 5) : undefined,
            resolvedNote: nextStatus ? '領隊已觸覺查驗確認 100% 乾燥，核准移回純乾區。' : '',
          };
        }
        return c;
      }),
    }));
  };

  const handleDeleteContamination = (id: string) => {
    updateCurrentDay((day) => ({
      ...day,
      contaminations: day.contaminations.filter((c) => c.id !== id),
    }));
  };

  return (
    <div className="space-y-8">
      {/* Top Banner & Day Management Bar */}
      <div className="rounded-2xl bg-gradient-to-r from-[#162c23] via-[#0f2019] to-[#162c23] border border-[#1e3b30] p-6 sm:p-8 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#38bdf8]/20 border border-[#38bdf8]/30 flex items-center justify-center">
              <Activity className="w-5 h-5 text-[#38bdf8]" />
            </div>
            <div>
              <h2 className="font-serif-tc text-2xl sm:text-3xl font-bold text-white tracking-wide">
                多日水分帳本管理主控台
              </h2>
              <p className="text-xs sm:text-sm text-[#9ab3a6] mt-0.5">
                全域乾燥動態追蹤・儲存於 LocalStorage ({LOCAL_STORAGE_KEY})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleManualSave}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium bg-[#16a34a] hover:bg-[#15803d] text-white transition-colors cursor-pointer shadow-sm"
              aria-label="手動儲存至 LocalStorage"
            >
              <Save className="w-3.5 h-3.5" />
              <span>儲存帳本</span>
            </button>
            {saveToast && (
              <span className="text-xs text-[#4ade80] font-medium animate-pulse">
                ✓ 已儲存！
              </span>
            )}
          </div>
        </div>

        {/* Day Switcher Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#1e3b30]">
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {store.days.map((day, idx) => (
              <button
                key={day.dayNumber}
                type="button"
                onClick={() => setStore((prev) => ({ ...prev, currentDayIndex: idx }))}
                className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                  store.currentDayIndex === idx
                    ? 'bg-[#38bdf8] text-[#0a1510] shadow-md shadow-[#38bdf8]/30'
                    : 'bg-[#0a1510] text-[#9ab3a6] hover:text-white hover:bg-[#162c23] border border-[#1e3b30]'
                }`}
                aria-label={`切換至第 ${day.dayNumber} 天`}
              >
                Day {day.dayNumber}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleAddDay}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#162c23] hover:bg-[#1e3b30] text-[#4ade80] border border-[#2e5746] transition-colors cursor-pointer"
              aria-label="新增一日帳本"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>新增 Day</span>
            </button>
            <button
              type="button"
              onClick={handleDuplicateDay}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#162c23] hover:bg-[#1e3b30] text-[#38bdf8] border border-[#2e5746] transition-colors cursor-pointer"
              aria-label="複製當前日帳本"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>複製</span>
            </button>
            <button
              type="button"
              onClick={handleDeleteDay}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#162c23] hover:bg-[#dc2626]/30 text-[#f87171] border border-[#dc2626]/30 transition-colors cursor-pointer"
              aria-label="刪除當前日帳本"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>刪除</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Modules */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols on lg): Status & Defenses */}
        <div className="lg:col-span-2 space-y-6">
          {/* Day Basic Info */}
          <div className="rounded-xl bg-[#0f2019] border border-[#1e3b30] p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-[#1e3b30] pb-3">
              <h3 className="font-serif-tc text-base font-bold text-white flex items-center gap-2">
                <span>Day {currentDay.dayNumber} 行程與氣象</span>
              </h3>
              <span className="text-xs text-[#9ab3a6] font-mono">
                最後更新: {new Date(store.updatedAt).toLocaleTimeString()}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-[#9ab3a6] mb-1">路線區段 / 宿營點</label>
                <input
                  type="text"
                  value={currentDay.routeSegment}
                  onChange={(e) =>
                    updateCurrentDay((d) => ({ ...d, routeSegment: e.target.value }))
                  }
                  className="w-full px-3 py-2 rounded-lg bg-[#0a1510] border border-[#1e3b30] text-sm text-[#f0f6f2] focus:outline-none focus:border-[#4ade80]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#9ab3a6] mb-1">天氣與降雨概況</label>
                <input
                  type="text"
                  value={currentDay.weatherSummary}
                  onChange={(e) =>
                    updateCurrentDay((d) => ({ ...d, weatherSummary: e.target.value }))
                  }
                  className="w-full px-3 py-2 rounded-lg bg-[#0a1510] border border-[#1e3b30] text-sm text-[#f0f6f2] focus:outline-none focus:border-[#4ade80]"
                />
              </div>
            </div>

            {/* Environmental Risks Checklist */}
            <div className="pt-2 border-t border-[#1e3b30] space-y-2">
              <label className="block text-xs font-semibold text-[#fbbf24] uppercase tracking-wider">
                今日環境風險評估（可多選）
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {ENV_RISK_OPTIONS.map((risk) => {
                  const isChecked = currentDay.envRisks.includes(risk);
                  return (
                    <label
                      key={risk}
                      className={`flex items-center gap-2.5 p-2 rounded-lg text-xs cursor-pointer border transition-colors ${
                        isChecked
                          ? 'bg-[#162c23] border-[#4ade80]/50 text-[#f0f6f2]'
                          : 'bg-[#0a1510]/50 border-[#1e3b30] text-[#9ab3a6]'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {
                          updateCurrentDay((d) => {
                            const next = isChecked
                              ? d.envRisks.filter((r) => r !== risk)
                              : [...d.envRisks, risk];
                            return { ...d, envRisks: next };
                          });
                        }}
                        className="rounded border-[#1e3b30] text-[#16a34a] focus:ring-0 cursor-pointer"
                      />
                      <span>{risk}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Zones Status Overview */}
          <div className="rounded-xl bg-[#0f2019] border border-[#1e3b30] p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-[#1e3b30] pb-3">
              <h3 className="font-serif-tc text-base font-bold text-white flex items-center gap-2">
                <Droplets className="w-4 h-4 text-[#38bdf8]" />
                <span>分區狀態監控（Zone Z / A / B / C / D）</span>
              </h3>
              <span className="text-xs text-[#9ab3a6]">嚴格執行乾濕分界</span>
            </div>

            <div className="space-y-3">
              {(['Z', 'A', 'B', 'C', 'D'] as ZoneId[]).map((zoneId) => {
                const zoneData = currentDay.zones[zoneId];
                const zoneConfig = ZONES[zoneId];
                return (
                  <div
                    key={zoneId}
                    className="p-3.5 rounded-lg border flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    style={{
                      backgroundColor: zoneConfig.bgColor,
                      borderColor: zoneConfig.borderColor,
                    }}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span
                          className="font-mono text-xs font-bold px-2 py-0.5 rounded text-white"
                          style={{ backgroundColor: zoneConfig.borderColor }}
                        >
                          Zone {zoneId}
                        </span>
                        <span className="text-xs font-semibold text-white">
                          {zoneConfig.badge}
                        </span>
                      </div>
                      <p className="text-xs text-[#d1e0d7]">{zoneData.notes}</p>
                    </div>

                    <div className="flex items-center gap-3 self-end sm:self-auto">
                      <span className="text-xs font-mono text-[#f0f6f2] bg-[#0a1510]/60 px-2 py-1 rounded border border-white/10">
                        {zoneData.moistureLevel}
                      </span>
                      <select
                        value={zoneData.status}
                        onChange={(e) => {
                          const val = e.target.value as 'safe' | 'warning' | 'alert';
                          updateCurrentDay((d) => ({
                            ...d,
                            zones: {
                              ...d.zones,
                              [zoneId]: { ...d.zones[zoneId], status: val },
                            },
                          }));
                        }}
                        className="px-2.5 py-1 rounded text-xs bg-[#0a1510] text-[#f0f6f2] border border-[#1e3b30] focus:outline-none"
                      >
                        <option value="safe">正常安全 (Safe)</option>
                        <option value="warning">受潮警示 (Warning)</option>
                        <option value="alert">極端危險 (Alert)</option>
                      </select>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Marching Defense Line & Golden 5 Minutes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Marching Defense */}
            <div className="rounded-xl bg-[#0f2019] border border-[#1e3b30] p-5 space-y-3">
              <h3 className="font-serif-tc text-sm font-bold text-white flex items-center gap-2">
                <Flame className="w-4 h-4 text-[#4ade80]" />
                <span>行進防線檢核（寧冷勿汗）</span>
              </h3>

              <div className="space-y-2 text-xs">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={currentDay.marchingDefense.baseLayerDrying}
                    onChange={(e) =>
                      updateCurrentDay((d) => ({
                        ...d,
                        marchingDefense: {
                          ...d.marchingDefense,
                          baseLayerDrying: e.target.checked,
                        },
                      }))
                    }
                    className="rounded text-[#16a34a]"
                  />
                  <span>底層排汗保持微乾，無大汗浸透</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={currentDay.marchingDefense.ventPitsOpen}
                    onChange={(e) =>
                      updateCurrentDay((d) => ({
                        ...d,
                        marchingDefense: {
                          ...d.marchingDefense,
                          ventPitsOpen: e.target.checked,
                        },
                      }))
                    }
                    className="rounded text-[#16a34a]"
                  />
                  <span>腋下及胸前散熱拉鍊主動開啟</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={currentDay.marchingDefense.paceAdjustedForSweat}
                    onChange={(e) =>
                      updateCurrentDay((d) => ({
                        ...d,
                        marchingDefense: {
                          ...d.marchingDefense,
                          paceAdjustedForSweat: e.target.checked,
                        },
                      }))
                    }
                    className="rounded text-[#16a34a]"
                  />
                  <span>配速控制於有氧心率，未爆心跳出汗</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={currentDay.marchingDefense.glovesProtection}
                    onChange={(e) =>
                      updateCurrentDay((d) => ({
                        ...d,
                        marchingDefense: {
                          ...d.marchingDefense,
                          glovesProtection: e.target.checked,
                        },
                      }))
                    }
                    className="rounded text-[#16a34a]"
                  />
                  <span>手套防水且袖口內藏，維持末梢知覺</span>
                </label>
              </div>

              <textarea
                value={currentDay.marchingDefense.notes}
                onChange={(e) =>
                  updateCurrentDay((d) => ({
                    ...d,
                    marchingDefense: { ...d.marchingDefense, notes: e.target.value },
                  }))
                }
                rows={2}
                placeholder="行進調控備註..."
                className="w-full p-2 rounded-lg bg-[#0a1510] border border-[#1e3b30] text-xs text-[#f0f6f2] focus:outline-none"
              />
            </div>

            {/* Golden 5 Minutes */}
            <div className="rounded-xl bg-[#0f2019] border border-[#1e3b30] p-5 space-y-3">
              <h3 className="font-serif-tc text-sm font-bold text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#fbbf24]" />
                <span>抵達營地「黃金 5 分鐘」SOP</span>
              </h3>

              <div className="space-y-2 text-xs">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={currentDay.goldenFiveMinutes.completedImmediately}
                    onChange={(e) =>
                      updateCurrentDay((d) => ({
                        ...d,
                        goldenFiveMinutes: {
                          ...d.goldenFiveMinutes,
                          completedImmediately: e.target.checked,
                        },
                      }))
                    }
                    className="rounded text-[#fbbf24]"
                  />
                  <span>抵達 5 分鐘內落實換裝，阻斷熱量流失</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={currentDay.goldenFiveMinutes.rainJacketRemovedBeforeTent}
                    onChange={(e) =>
                      updateCurrentDay((d) => ({
                        ...d,
                        goldenFiveMinutes: {
                          ...d.goldenFiveMinutes,
                          rainJacketRemovedBeforeTent: e.target.checked,
                        },
                      }))
                    }
                    className="rounded text-[#fbbf24]"
                  />
                  <span>進入內帳前於前庭脫除滴水雨衣與泥鞋</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={currentDay.goldenFiveMinutes.dryZoneBagSealed}
                    onChange={(e) =>
                      updateCurrentDay((d) => ({
                        ...d,
                        goldenFiveMinutes: {
                          ...d.goldenFiveMinutes,
                          dryZoneBagSealed: e.target.checked,
                        },
                      }))
                    }
                    className="rounded text-[#fbbf24]"
                  />
                  <span>確認雙手手部擦乾後才開啟 Zone Z 睡袋</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={currentDay.goldenFiveMinutes.warmLayersDoffedInside}
                    onChange={(e) =>
                      updateCurrentDay((d) => ({
                        ...d,
                        goldenFiveMinutes: {
                          ...d.goldenFiveMinutes,
                          warmLayersDoffedInside: e.target.checked,
                        },
                      }))
                    }
                    className="rounded text-[#fbbf24]"
                  />
                  <span>換穿純乾羊毛底層並封閉帳門開始保暖</span>
                </label>
              </div>

              <textarea
                value={currentDay.goldenFiveMinutes.notes}
                onChange={(e) =>
                  updateCurrentDay((d) => ({
                    ...d,
                    goldenFiveMinutes: { ...d.goldenFiveMinutes, notes: e.target.value },
                  }))
                }
                rows={2}
                placeholder="營地換裝備註..."
                className="w-full p-2 rounded-lg bg-[#0a1510] border border-[#1e3b30] text-xs text-[#f0f6f2] focus:outline-none"
              />
            </div>
          </div>

          {/* Dry to Wet Incidents Log */}
          <div className="rounded-xl bg-[#0f2019] border border-[#1e3b30] p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-[#1e3b30] pb-3">
              <h3 className="font-serif-tc text-base font-bold text-white flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-[#fb923c]" />
                <span>乾的變濕事件紀錄（受潮原因與搶救措施）</span>
              </h3>
              <span className="text-xs text-[#9ab3a6]">
                共 {currentDay.dryToWetIncidents.length} 筆事件
              </span>
            </div>

            {/* List */}
            <div className="space-y-2.5">
              {currentDay.dryToWetIncidents.map((inc) => (
                <div
                  key={inc.id}
                  className="p-3 rounded-lg bg-[#162c23] border border-[#1e3b30] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[#38bdf8] font-bold">{inc.timestamp}</span>
                      <span className="font-semibold text-white">{inc.item}</span>
                      <span className="px-1.5 py-0.5 rounded bg-[#0a1510] text-[#fbbf24] border border-[#1e3b30]">
                        {inc.source}
                      </span>
                    </div>
                    <p className="text-[#9ab3a6]">
                      <span className="text-[#f87171]">{inc.severity}</span> — 處置：{inc.actionTaken}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDeleteIncident(inc.id)}
                    className="self-end sm:self-auto text-xs text-[#f87171] hover:underline p-1 cursor-pointer"
                  >
                    刪除紀錄
                  </button>
                </div>
              ))}
            </div>

            {/* Add Incident Form */}
            <form onSubmit={handleAddIncident} className="p-3.5 rounded-lg bg-[#0a1510] border border-[#1e3b30] space-y-3">
              <p className="text-xs font-semibold text-[#fb923c]">＋ 記錄新發生的受潮事件</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <input
                  type="text"
                  value={newItem}
                  onChange={(e) => setNewItem(e.target.value)}
                  placeholder="受潮裝備品項（如：備用保暖帽）"
                  className="px-3 py-1.5 rounded-lg bg-[#162c23] border border-[#1e3b30] text-xs text-[#f0f6f2] focus:outline-none"
                  required
                />
                <select
                  value={newSource}
                  onChange={(e) => setNewSource(e.target.value)}
                  className="px-2 py-1.5 rounded-lg bg-[#162c23] border border-[#1e3b30] text-xs text-[#f0f6f2] focus:outline-none"
                >
                  {SOURCE_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
                <select
                  value={newSeverity}
                  onChange={(e) => setNewSeverity(e.target.value)}
                  className="px-2 py-1.5 rounded-lg bg-[#162c23] border border-[#1e3b30] text-xs text-[#f0f6f2] focus:outline-none"
                >
                  {SEVERITY_OPTIONS.map((sev) => (
                    <option key={sev} value={sev}>
                      {sev}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newAction}
                  onChange={(e) => setNewAction(e.target.value)}
                  placeholder="應急處置行動（如：擰乾後放入隔離袋）"
                  className="flex-1 px-3 py-1.5 rounded-lg bg-[#162c23] border border-[#1e3b30] text-xs text-[#f0f6f2] focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-[#fb923c] text-[#0a1510] font-bold text-xs hover:bg-[#f97316] transition-colors cursor-pointer"
                >
                  新增事件
                </button>
              </div>
            </form>
          </div>

          {/* Moisture Contamination Management & Manual Release */}
          <div className="rounded-xl bg-[#0f2019] border border-[#1e3b30] p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-[#1e3b30] pb-3">
              <h3 className="font-serif-tc text-base font-bold text-white flex items-center gap-2">
                <Lock className="w-4 h-4 text-[#f87171]" />
                <span>污染管理與人工確認解除（Cross-Contamination Protocol）</span>
              </h3>
              <span className="text-xs text-[#9ab3a6]">嚴禁未經查驗混裝</span>
            </div>

            <p className="text-xs text-[#9ab3a6] leading-relaxed">
              任何受潮物件必須立即隔離。唯有經過觸覺確認 100% 乾燥後，方可由人工執行「確認解除隔離」，重新納入 Zone Z/A 純乾防線。
            </p>

            {/* List */}
            <div className="space-y-2.5">
              {currentDay.contaminations.map((c) => (
                <div
                  key={c.id}
                  className={`p-3.5 rounded-lg border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs transition-colors ${
                    c.isManuallyResolved
                      ? 'bg-[#16a34a]/10 border-[#16a34a]/40 text-[#f0f6f2]'
                      : 'bg-[#dc2626]/10 border-[#dc2626]/40 text-[#f0f6f2]'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-white">{c.item}</span>
                      <span className="text-[#f87171]">（污染源: {c.contaminatedBy}）</span>
                      <span className="px-1.5 py-0.5 rounded bg-[#0a1510] text-[#9ab3a6] border border-[#1e3b30]">
                        {c.quarantineZone}
                      </span>
                    </div>
                    {c.isManuallyResolved ? (
                      <p className="text-[#4ade80] flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>已人工解除隔離（{c.resolvedAt}）：{c.resolvedNote}</span>
                      </p>
                    ) : (
                      <p className="text-[#f87171] font-medium flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>處於嚴格隔離中：禁止接觸任何 Zone Z 裝備！</span>
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <button
                      type="button"
                      onClick={() => handleToggleManualRelease(c.id, c.isManuallyResolved)}
                      className={`px-3 py-1.5 rounded-lg font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer ${
                        c.isManuallyResolved
                          ? 'bg-[#162c23] hover:bg-[#1e3b30] text-[#9ab3a6] border border-[#1e3b30]'
                          : 'bg-[#16a34a] hover:bg-[#15803d] text-white shadow-sm'
                      }`}
                      aria-label="人工確認解除隔離按鈕"
                    >
                      {c.isManuallyResolved ? (
                        <>
                          <Lock className="w-3 h-3" />
                          <span>恢復隔離</span>
                        </>
                      ) : (
                        <>
                          <Unlock className="w-3 h-3" />
                          <span>人工確認解除隔離</span>
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteContamination(c.id)}
                      className="text-[#9ab3a6] hover:text-[#f87171] p-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Contamination Form */}
            <form onSubmit={handleAddContamination} className="p-3.5 rounded-lg bg-[#0a1510] border border-[#1e3b30] space-y-3">
              <p className="text-xs font-semibold text-[#f87171]">＋ 登記需隔離之受潮污染品項</p>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={newContamItem}
                  onChange={(e) => setNewContamItem(e.target.value)}
                  placeholder="隔離物件（如：外帳滴水沾濕之防風手套）"
                  className="flex-1 px-3 py-1.5 rounded-lg bg-[#162c23] border border-[#1e3b30] text-xs text-[#f0f6f2] focus:outline-none"
                  required
                />
                <input
                  type="text"
                  value={newContamSource}
                  onChange={(e) => setNewContamSource(e.target.value)}
                  placeholder="污染成因（如：帳頂滴水、濕手碰觸）"
                  className="flex-1 px-3 py-1.5 rounded-lg bg-[#162c23] border border-[#1e3b30] text-xs text-[#f0f6f2] focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-[#dc2626] text-white font-bold text-xs hover:bg-[#b91c1c] transition-colors cursor-pointer"
                >
                  送入隔離
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Column: Tent, Core Gear, Moisture Budget & Notes */}
        <div className="space-y-6">
          {/* Tent Condensation Management & Alerts */}
          <div className="rounded-xl bg-[#0f2019] border border-[#1e3b30] p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-[#1e3b30] pb-3">
              <h3 className="font-serif-tc text-base font-bold text-white flex items-center gap-2">
                <Tent className="w-4 h-4 text-[#fbbf24]" />
                <span>帳篷管理與反潮警示</span>
              </h3>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[#9ab3a6] mb-1">外帳冷凝反潮程度</label>
                <select
                  value={currentDay.tentManagement.outerCondensation}
                  onChange={(e) => {
                    const val = e.target.value as 'none' | 'light' | 'moderate' | 'heavy';
                    updateCurrentDay((d) => ({
                      ...d,
                      tentManagement: { ...d.tentManagement, outerCondensation: val },
                    }));
                  }}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-[#0a1510] border border-[#1e3b30] text-[#f0f6f2] focus:outline-none"
                >
                  <option value="none">微弱（無明顯水珠）</option>
                  <option value="light">輕度（微細露水，未流淌）</option>
                  <option value="moderate">中度（密佈水珠，偶爾滴落）</option>
                  <option value="heavy">嚴重（連片水流，強烈滴水警報）</option>
                </select>
              </div>

              <div className="space-y-1.5 pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={currentDay.tentManagement.tarpVented}
                    onChange={(e) =>
                      updateCurrentDay((d) => ({
                        ...d,
                        tentManagement: { ...d.tentManagement, tarpVented: e.target.checked },
                      }))
                    }
                    className="rounded text-[#16a34a]"
                  />
                  <span>頂部通風天窗全程支撐開啟</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={currentDay.tentManagement.footboxClearOfFly}
                    onChange={(e) =>
                      updateCurrentDay((d) => ({
                        ...d,
                        tentManagement: {
                          ...d.tentManagement,
                          footboxClearOfFly: e.target.checked,
                        },
                      }))
                    }
                    className="rounded text-[#16a34a]"
                  />
                  <span>睡袋腳端隔空，未接觸外帳壁</span>
                </label>
              </div>

              {/* Drip Locations */}
              <div className="pt-2 border-t border-[#1e3b30] space-y-1.5">
                <label className="block text-[#fbbf24] font-semibold">
                  滴水 / 反潮易發位置檢視：
                </label>
                <div className="space-y-1">
                  {DRIP_LOCATIONS.map((loc) => {
                    const isMonitored = currentDay.tentManagement.dripLocations.includes(loc);
                    return (
                      <label
                        key={loc}
                        className="flex items-center gap-2 text-[11px] text-[#d1e0d7] cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={isMonitored}
                          onChange={() => {
                            updateCurrentDay((d) => {
                              const nextLocs = isMonitored
                                ? d.tentManagement.dripLocations.filter((l) => l !== loc)
                                : [...d.tentManagement.dripLocations, loc];
                              return {
                                ...d,
                                tentManagement: { ...d.tentManagement, dripLocations: nextLocs },
                              };
                            });
                          }}
                          className="rounded text-[#fbbf24]"
                        />
                        <span>{loc}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="p-3 rounded-lg bg-[#fbbf24]/10 border border-[#fbbf24]/30 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-[#fbbf24]">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>反潮警報評估：</span>
                </div>
                <input
                  type="text"
                  value={currentDay.tentManagement.alertMessage || ''}
                  onChange={(e) =>
                    updateCurrentDay((d) => ({
                      ...d,
                      tentManagement: { ...d.tentManagement, alertMessage: e.target.value },
                    }))
                  }
                  className="w-full px-2 py-1 rounded bg-[#0a1510] border border-[#1e3b30] text-xs text-[#f0f6f2] focus:outline-none"
                  placeholder="輸入營地警報建議..."
                />
              </div>
            </div>
          </div>

          {/* Core Gear Moisture Status */}
          <div className="rounded-xl bg-[#0f2019] border border-[#1e3b30] p-5 space-y-4">
            <h3 className="font-serif-tc text-base font-bold text-white flex items-center gap-2 border-b border-[#1e3b30] pb-3">
              <ShieldCheck className="w-4 h-4 text-[#4ade80]" />
              <span>核心保命裝備狀態（Zone Z 狀態）</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#162c23] border border-[#1e3b30]">
                <span>羽絨睡袋（不可受潮）</span>
                <span
                  className={`font-bold px-2 py-0.5 rounded ${
                    currentDay.coreGear.sleepingBagDry
                      ? 'bg-[#16a34a]/30 text-[#4ade80]'
                      : 'bg-[#dc2626]/30 text-[#f87171]'
                  }`}
                >
                  {currentDay.coreGear.sleepingBagDry ? '✓ 純乾 (100% 蓬鬆)' : '✕ 局部受潮'}
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#162c23] border border-[#1e3b30]">
                <span>純乾備用保暖衣物</span>
                <span
                  className={`font-bold px-2 py-0.5 rounded ${
                    currentDay.coreGear.spareClothesDry
                      ? 'bg-[#16a34a]/30 text-[#4ade80]'
                      : 'bg-[#dc2626]/30 text-[#f87171]'
                  }`}
                >
                  {currentDay.coreGear.spareClothesDry ? '✓ 氣密密封' : '✕ 受潮'}
                </span>
              </div>

              <div className="space-y-1 pt-1">
                <div className="flex justify-between text-[#9ab3a6]">
                  <span>鞋墊 / 登山鞋濕度估計：</span>
                  <span className="font-mono text-white">{currentDay.coreGear.insoleMoisturePercent}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={currentDay.coreGear.insoleMoisturePercent}
                  onChange={(e) =>
                    updateCurrentDay((d) => ({
                      ...d,
                      coreGear: {
                        ...d.coreGear,
                        insoleMoisturePercent: parseInt(e.target.value, 10),
                      },
                    }))
                  }
                  className="w-full accent-[#4ade80]"
                />
              </div>
            </div>
          </div>

          {/* Multi-Day Moisture Budget Ledger */}
          <div className="rounded-xl bg-[#0f2019] border border-[#1e3b30] p-5 space-y-4">
            <h3 className="font-serif-tc text-base font-bold text-white flex items-center gap-2 border-b border-[#1e3b30] pb-3">
              <Activity className="w-4 h-4 text-[#38bdf8]" />
              <span>多日水分帳本收支（Moisture Budget）</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-[#9ab3a6]">單日推估排汗量：</span>
                <span className="font-mono font-bold text-[#f0f6f2]">
                  {currentDay.moistureBudget.estimatedSweatLiters} L
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-[#9ab3a6]">環境相對濕度 RH：</span>
                <span className="font-mono font-bold text-[#f0f6f2]">
                  {currentDay.moistureBudget.ambientHumidityPercent} %
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-[#9ab3a6]">裝備累積吸水重量：</span>
                <span className="font-mono font-bold text-[#fbbf24]">
                  +{currentDay.moistureBudget.absorbedMoistureGrams} g
                </span>
              </div>

              <div className="pt-2 border-t border-[#1e3b30]">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-white">乾燥赤字 / 緩衝評估：</span>
                  <span className="font-bold text-[#4ade80]">
                    {currentDay.moistureBudget.remainingDryBuffer}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="rounded-xl bg-[#0f2019] border border-[#1e3b30] p-5 space-y-3">
            <h3 className="font-serif-tc text-sm font-bold text-white">
              領隊日誌與水分帳本備註
            </h3>
            <textarea
              value={currentDay.dayNotes}
              onChange={(e) =>
                updateCurrentDay((d) => ({ ...d, dayNotes: e.target.value }))
              }
              rows={3}
              placeholder="記錄今日異常潮濕事件、明日行程乾燥預防策略..."
              className="w-full p-2.5 rounded-lg bg-[#0a1510] border border-[#1e3b30] text-xs text-[#f0f6f2] focus:outline-none focus:border-[#4ade80]"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
