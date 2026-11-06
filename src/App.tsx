/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  INITIAL_UNION_LISTS,
  SCOPE_CONFIGS,
  CommissionScopeKey,
  GOOGLE_DRIVE_BAG_URL,
  SNTE_PORTAL_URL,
  INITIAL_DISCIPLINARY_CASES,
  UnionList,
} from './data/capData';
import { DashboardOverviewModule } from './components/DashboardOverviewModule';
import { VotingAndUnionsModule } from './components/VotingAndUnionsModule';
import { CommissionsAndContractualsModule } from './components/CommissionsAndContractualsModule';
import { TasksAndMinutesModule } from './components/TasksAndMinutesModule';
import { DisciplinaryCouncilModule } from './components/DisciplinaryCouncilModule';
import { DriveBagAndPositionsModule } from './components/DriveBagAndPositionsModule';
import { LegislationModule } from './components/LegislationModule';
import {
  LayoutDashboard,
  Vote,
  Building2,
  ClipboardList,
  Gavel,
  FolderOpen,
  BookOpen,
  Scale,
  Settings,
  Bell,
  Calendar,
  MapPin,
  Edit3,
  Check,
  X,
} from 'lucide-react';

type ActiveModule =
  | 'dashboard'
  | 'voting'
  | 'commissions'
  | 'minutes'
  | 'disciplinary'
  | 'bag'
  | 'legislation';

export default function App() {
  const [activeModule, setActiveModule] = useState<ActiveModule>('dashboard');
  const [activeScope, setActiveScope] = useState<CommissionScopeKey>('statutory');
  const [unionLists, setUnionLists] = useState<UnionList[]>(INITIAL_UNION_LISTS);

  // Editable Platform Title (No mention of "المدير")
  const [platformTitle, setPlatformTitle] = useState<string>('اللجان الإدارية المتساوية الأعضاء');
  const [isEditingTitle, setIsEditingTitle] = useState<boolean>(false);
  const [tempTitle, setTempTitle] = useState<string>(platformTitle);

  // Institution & Commission Settings Modal State
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [institutionInfo, setInstitutionInfo] = useState({
    directorateName: 'مديرية التربية — اللجنة الولائية للمستخدمين',
    wilaya: 'ولاية قسنطينة (25)',
    coordinatorName: 'الأستاذ حميدي بشير (SNTE)',
    mandateTerm: 'العهدة الانتخابية 2026 - 2029',
  });

  const currentScope = SCOPE_CONFIGS[activeScope];

  const navItems: {
    id: ActiveModule;
    label: string;
    badge?: string;
    icon: React.ComponentType<{ className?: string }>;
  }[] = [
    {
      id: 'dashboard',
      label: 'الداشبورد الشامل',
      icon: LayoutDashboard,
    },
    {
      id: 'voting',
      label: 'الترشح النقابي والتصويت الإلكتروني',
      badge: 'فرز فوري',
      icon: Vote,
    },
    {
      id: 'commissions',
      label: 'إنشاء وأنواع اللجان (ولجان المتعاقدين)',
      badge: '06/2009',
      icon: Building2,
    },
    {
      id: 'minutes',
      label: 'مهام اللجان ومولد المحاضر A4',
      badge: 'نماذج Word',
      icon: ClipboardList,
    },
    {
      id: 'disciplinary',
      label: 'المجلس التأديبي ولجان الطعن',
      badge: '15/2004',
      icon: Gavel,
    },
    {
      id: 'bag',
      label: 'حقيبة اللجان والوضعيات ومحاكي الدرجات',
      badge: 'حقيبة Drive',
      icon: FolderOpen,
    },
    {
      id: 'legislation',
      label: 'الركن التشريعي المحين',
      badge: '2026',
      icon: BookOpen,
    },
  ];

  const handleNavigate = (mod: ActiveModule) => {
    setActiveModule(mod);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#071710] text-slate-100 flex flex-col font-['Cairo',sans-serif]">
      {/* Sticky Header matching https://hamidibachireduc-png.github.io/nathersnte2026/ */}
      <header className="sticky top-0 z-40 bg-[#071912]/95 backdrop-blur-md border-b border-[#c59a3f]/30 shadow-2xl no-print">
        {/* Top Tricolor Ribbon */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[#8f1414] via-[#d4af37] to-[#105e32]" />

        {/* Top Scope Selector Bar */}
        <div className="bg-[#05120c] border-b border-[#d4af37]/25 py-2 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-xs">
              <Scale className="w-4 h-4 text-[#d4af37] shrink-0" />
              <span className="font-bold text-slate-200">
                اختر نظام اللجنة لتكييف النصوص، النصاب القانوني، والوثائق تلقائياً:
              </span>
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
              {(['statutory', 'contractual', 'appeals'] as CommissionScopeKey[]).map((key) => {
                const sc = SCOPE_CONFIGS[key];
                const isSelected = activeScope === key;
                return (
                  <button
                    key={key}
                    onClick={() => setActiveScope(key)}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0 ${
                      isSelected
                        ? 'bg-gradient-to-r from-[#d4af37] to-[#b58922] text-[#071710] shadow-md'
                        : 'bg-[#0b2318] text-slate-300 hover:text-white border border-[#d4af37]/30'
                    }`}
                  >
                    <span>{sc.shortName}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded font-mono tabular-nums ${
                        isSelected
                          ? 'bg-[#071710]/20 text-[#071710] font-black'
                          : 'bg-black/30 text-[#f5d77f]'
                      }`}
                    >
                      عهدة {sc.mandateYears} س
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Main Header Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-3 gap-4">
            {/* Right Brand & Editable Title */}
            <div className="flex items-center gap-3.5">
              <div
                onClick={() => handleNavigate('dashboard')}
                title="العودة للداشبورد الشامل"
                className="relative group cursor-pointer shrink-0"
              >
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full p-1 bg-gradient-to-tr from-[#8f1414] via-[#d4af37] to-[#105e32] shadow-lg flex items-center justify-center bg-[#06150e]">
                  <div className="w-full h-full rounded-full bg-[#071710] flex flex-col items-center justify-center border border-[#d4af37]/40">
                    <Scale className="w-6 h-6 text-[#d4af37]" />
                    <span className="text-[9px] font-black text-[#f5d77f] mt-0.5">SNTE</span>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[11px] font-bold tracking-wider text-[#d4af37] flex items-center gap-1">
                    <span>البوابة الرقمية لهيئات المشاركة والطعن · {currentScope.shortName}</span>
                  </span>
                  <span className="hidden md:inline-block text-[10px] bg-[#8f1414] text-white px-2 py-0.5 rounded font-bold border border-[#f5d77f]/30">
                    SNTE 2026
                  </span>
                </div>

                <h1 className="text-lg sm:text-2xl font-black text-white tracking-tight flex flex-wrap items-center gap-2 mt-0.5">
                  {isEditingTitle ? (
                    <span className="inline-flex items-center gap-1.5 bg-[#05140d] border border-[#d4af37] rounded-xl p-1.5">
                      <span className="text-xs font-bold text-[#d4af37]">منصة</span>
                      <input
                        type="text"
                        value={tempTitle}
                        onChange={(e) => setTempTitle(e.target.value)}
                        className="px-2 py-0.5 rounded bg-[#092116] border border-[#d4af37]/60 text-white text-xs sm:text-sm font-bold focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (tempTitle.trim()) setPlatformTitle(tempTitle.trim());
                          setIsEditingTitle(false);
                        }}
                        className="p-1 rounded bg-[#d4af37] text-[#071710] cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsEditingTitle(false)}
                        className="p-1 rounded bg-slate-800 text-slate-300 cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  ) : (
                    <span
                      onClick={() => {
                        setTempTitle(platformTitle);
                        setIsEditingTitle(true);
                      }}
                      title="انقر لتخصيص عنوان المنصة"
                      className="text-white hover:text-[#f5d77f] cursor-pointer inline-flex items-center gap-1.5 border-b border-dashed border-[#d4af37]/60 pb-0.5 transition-colors group"
                    >
                      <span>منصة {platformTitle}</span>
                      <Edit3 className="w-3.5 h-3.5 text-[#d4af37] opacity-75 group-hover:opacity-100" />
                    </span>
                  )}
                  <span className="text-[#d4af37] text-xs sm:text-base font-bold">
                    | البوابة الرقمية للجان المتساوية ولجان المتعاقدين والطعن
                  </span>
                </h1>

                <p className="text-xs text-slate-300 hidden sm:block mt-0.5">
                  {currentScope.legalFrameworkBadge}
                </p>
              </div>
            </div>

            {/* Left Institution Info & Action Buttons */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              <div className="hidden xl:flex flex-col items-end border-l border-[#d4af37]/20 pl-4 text-right">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-300">
                  <MapPin className="w-3.5 h-3.5 text-[#d4af37]" />
                  <span>{institutionInfo.directorateName}</span>
                </div>
                <div className="text-[11px] text-slate-300 flex items-center gap-2">
                  <span>{institutionInfo.wilaya}</span>
                  <span>·</span>
                  <span className="text-[#e5c158] font-medium">
                    {institutionInfo.coordinatorName}
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 flex items-center gap-1 tabular-nums">
                  <Calendar className="w-3 h-3 text-[#d4af37]" />
                  <span>{institutionInfo.mandateTerm}</span>
                </div>
              </div>

              <button
                onClick={() => setIsSettingsOpen(true)}
                className="px-3 py-2 text-xs font-bold bg-[#0c2a1c] text-[#e5c158] hover:text-white hover:bg-[#123826] border border-[#d4af37]/40 rounded-lg flex items-center gap-1.5 transition-all shadow-sm cursor-pointer whitespace-nowrap shrink-0"
                title="تعديل بيانات الهيئة واللجنة"
              >
                <Settings className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">بيانات اللجنة</span>
              </button>

              <button
                onClick={() => handleNavigate('disciplinary')}
                className="relative p-2.5 bg-[#8f1414]/85 hover:bg-[#a61b1b] text-white border border-[#f5d77f]/40 rounded-lg transition-all shadow-md cursor-pointer shrink-0"
                title={`${INITIAL_DISCIPLINARY_CASES.length} ملفات تأديبية وطعون رائجة`}
              >
                <Bell className="w-4 h-4" />
                <span className="absolute -top-1.5 -right-1.5 bg-[#d4af37] text-[#0d2818] font-black text-[10px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#091512] tabular-nums">
                  {INITIAL_DISCIPLINARY_CASES.length}
                </span>
              </button>

              <a
                href={SNTE_PORTAL_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-lg bg-gradient-to-r from-[#006633] to-[#004d26] text-white font-bold text-xs border border-[#FFD700]/70 shadow hover:scale-[1.02] transition-transform whitespace-nowrap shrink-0"
              >
                <span>العودة للبوابة ↩</span>
              </a>
            </div>
          </div>

          {/* Horizontal Scrollable Navigation Tabs Bar */}
          <nav className="flex items-center gap-1.5 overflow-x-auto py-2 border-t border-[#d4af37]/15 scrollbar-none text-xs sm:text-sm font-semibold">
            {navItems.map((item) => {
              const IconComp = item.icon;
              const isActive = activeModule === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavigate(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-[#105e32] via-[#0d4a27] to-[#0a351c] text-[#f5d77f] font-bold border border-[#d4af37]/60 shadow-md'
                      : 'text-slate-300 hover:text-white hover:bg-[#0b2318]'
                  }`}
                >
                  <IconComp className="w-4 h-4 text-[#d4af37]" />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                        isActive
                          ? 'bg-[#d4af37] text-[#071710]'
                          : 'bg-[#05140d] text-[#f5d77f] border border-[#d4af37]/30'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeModule === 'dashboard' && (
          <DashboardOverviewModule
            activeScope={activeScope}
            onSelectScope={setActiveScope}
            onNavigate={handleNavigate}
            unionLists={unionLists}
            institutionInfo={institutionInfo}
            onOpenSettings={() => setIsSettingsOpen(true)}
          />
        )}

        {activeModule === 'voting' && (
          <VotingAndUnionsModule
            unionLists={unionLists}
            setUnionLists={setUnionLists}
          />
        )}

        {activeModule === 'commissions' && <CommissionsAndContractualsModule />}

        {activeModule === 'minutes' && <TasksAndMinutesModule />}

        {activeModule === 'disciplinary' && <DisciplinaryCouncilModule />}

        {activeModule === 'bag' && <DriveBagAndPositionsModule />}

        {activeModule === 'legislation' && <LegislationModule />}
      </main>

      {/* Settings Modal for Institution / Commission Info */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 no-print">
          <div className="bg-[#081a12] border-2 border-[#d4af37] rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#d4af37]/25 pb-3">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <Settings className="w-5 h-5 text-[#d4af37]" />
                <span>تخصيص بيانات الهيئة واللجنة المتساوية الأعضاء</span>
              </h3>
              <button
                onClick={() => setIsSettingsOpen(false)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-[#f5d77f] mb-1">
                  اسم المديرية / الإدارة أو الهيئة
                </label>
                <input
                  type="text"
                  value={institutionInfo.directorateName}
                  onChange={(e) =>
                    setInstitutionInfo({ ...institutionInfo, directorateName: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg bg-[#05140d] border border-[#d4af37]/40 text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-[#f5d77f] mb-1">الولاية / الجهة</label>
                <input
                  type="text"
                  value={institutionInfo.wilaya}
                  onChange={(e) =>
                    setInstitutionInfo({ ...institutionInfo, wilaya: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg bg-[#05140d] border border-[#d4af37]/40 text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-[#f5d77f] mb-1">
                  منسق أو ممثل اللجنة / النقابة
                </label>
                <input
                  type="text"
                  value={institutionInfo.coordinatorName}
                  onChange={(e) =>
                    setInstitutionInfo({ ...institutionInfo, coordinatorName: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg bg-[#05140d] border border-[#d4af37]/40 text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-[#f5d77f] mb-1">العهدة الانتخابية</label>
                <input
                  type="text"
                  value={institutionInfo.mandateTerm}
                  onChange={(e) =>
                    setInstitutionInfo({ ...institutionInfo, mandateTerm: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg bg-[#05140d] border border-[#d4af37]/40 text-white"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setIsSettingsOpen(false)}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#b58922] text-[#071710] font-black text-xs cursor-pointer"
              >
                حفظ التغييرات وإغلاق
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer matching https://hamidibachireduc-png.github.io/nathersnte2026/ */}
      <footer className="mt-auto bg-[#040e0a] border-t border-[#d4af37]/30 py-8 text-xs text-slate-400 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full p-0.5 bg-gradient-to-tr from-[#8f1414] via-[#d4af37] to-[#105e32] flex items-center justify-center bg-[#06150e]">
                <Scale className="w-6 h-6 text-[#d4af37]" />
              </div>
              <div>
                <div className="text-white font-bold text-sm">
                  البوابة الرقمية لـ {platformTitle} · (SNTE 2026)
                </div>
                <div className="text-[11px] text-[#d4af37] font-semibold">
                  النظام الحالي: {currentScope.shortName} · كرامة · ترقية · وحدة · عمل
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 text-xs font-medium">
              <button
                onClick={() => handleNavigate('dashboard')}
                className="hover:text-[#f5d77f] transition-colors cursor-pointer"
              >
                الداشبورد الشامل
              </button>
              <span>·</span>
              <button
                onClick={() => handleNavigate('voting')}
                className="hover:text-[#f5d77f] transition-colors cursor-pointer font-bold text-emerald-300"
              >
                الترشح والتصويت الإلكتروني
              </button>
              <span>·</span>
              <button
                onClick={() => handleNavigate('commissions')}
                className="hover:text-[#f5d77f] transition-colors cursor-pointer font-bold text-[#f5d77f]"
              >
                إنشاء وأنواع اللجان (ولجان المتعاقدين)
              </button>
              <span>·</span>
              <button
                onClick={() => handleNavigate('minutes')}
                className="hover:text-[#f5d77f] transition-colors cursor-pointer"
              >
                محاضر اللجان A4
              </button>
              <span>·</span>
              <button
                onClick={() => handleNavigate('disciplinary')}
                className="hover:text-[#f5d77f] transition-colors cursor-pointer"
              >
                المجلس التأديبي ولجان الطعن
              </button>
              <span>·</span>
              <button
                onClick={() => handleNavigate('bag')}
                className="hover:text-[#f5d77f] transition-colors cursor-pointer"
              >
                حقيبة الوثائق والدرجات
              </button>
              <span>·</span>
              <a
                href={GOOGLE_DRIVE_BAG_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#d4af37] hover:underline font-bold"
              >
                أرشيف Google Drive
              </a>
            </div>

            <div className="text-center md:text-left text-[11px] text-slate-400">
              <div>
                المطابقة: الأمر 06-03 · المرسوم التنفيذي 20-199 · المنشور 06/2009 والمنشور 15/2004
              </div>
              <div className="text-[#d4af37]">
                النموذج القياسي الموحد للجان الإدارية المتساوية الأعضاء ولجان المتعاقدين والطعن
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
