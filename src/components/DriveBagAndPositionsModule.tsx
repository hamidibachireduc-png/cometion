import React, { useState } from 'react';
import {
  DRIVE_BAG_DOCUMENTS,
  GOOGLE_DRIVE_BAG_URL,
  DriveBagDocument,
} from '../data/capData';
import {
  FolderOpen,
  FileText,
  ExternalLink,
  Award,
  TrendingUp,
  CheckCircle2,
  Calculator,
  Copy,
  Check,
} from 'lucide-react';

export const DriveBagAndPositionsModule: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDocId, setSelectedDocId] = useState<string>(DRIVE_BAG_DOCUMENTS[0].id);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Career & Echelon & Qualification List Simulator State (from Drive Bag PDFs)
  const [categoryClass, setCategoryClass] = useState<number>(14);
  const [currentEchelon, setCurrentEchelon] = useState<number>(6);
  const [yearsInRank, setYearsInRank] = useState<number>(11);
  const [adminMark, setAdminMark] = useState<number>(19);
  const [inspectionMark, setInspectionMark] = useState<number>(18.5);
  const [extraDiplomasPoints, setExtraDiplomasPoints] = useState<number>(3);
  const [trainingPoints, setTrainingPoints] = useState<number>(4);
  const [externalExperienceYears, setExternalExperienceYears] = useState<number>(4);

  const filteredDocs: DriveBagDocument[] =
    selectedCategory === 'all'
      ? DRIVE_BAG_DOCUMENTS
      : DRIVE_BAG_DOCUMENTS.filter((d) => d.category === selectedCategory);

  const activeDoc =
    filteredDocs.find((d) => d.id === selectedDocId) ||
    filteredDocs[0] ||
    DRIVE_BAG_DOCUMENTS[0];

  // Index Grid calculation (Decree 07-304 / 25-54 updated)
  const baseIndicesByCategory: Record<number, number> = {
    10: 453,
    11: 498,
    12: 537,
    13: 578,
    14: 621,
    15: 666,
    16: 713,
    17: 762,
  };

  const baseIndex = baseIndicesByCategory[categoryClass] || 621;
  // Each echelon (1 to 12) adds approx 5% of base index per degree
  const echelonIndexBonus = Math.round(baseIndex * 0.05 * currentEchelon);
  const totalIndex = baseIndex + echelonIndexBonus;

  // Qualification list score (قائمة التأهيل + مقياس الحركة والتقييم)
  const seniorityPoints = Math.min(30, yearsInRank * 2 + externalExperienceYears * 1); // External exp counted at 50% (Decree 85-58)
  const totalQualificationScore =
    seniorityPoints + adminMark + inspectionMark + extraDiplomasPoints + trainingPoints;
  const isEligibleForQualificationList = yearsInRank >= 10;

  const handleCopyDocSummary = (doc: DriveBagDocument) => {
    const text = `${doc.title} (${doc.referenceCode})\n${doc.summary}\nالقواعد الأساسية:\n${doc.keyRules.map((r) => `- ${r}`).join('\n')}`;
    navigator.clipboard.writeText(text);
    setCopiedId(doc.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Google Drive Bag Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0d2e1f] via-[#092216] to-[#123b28] border border-[#d4af37]/50 p-6 shadow-2xl">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#8f1414] via-[#d4af37] to-[#10b981]" />
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded bg-[#8f1414] text-white text-xs font-bold border border-[#f5d77f]/40">
                حقيبة اللجان المتساوية الأعضاء — الأستاذ حميدي بشير
              </span>
              <span className="text-xs text-[#f5d77f] font-semibold">
                الوضعيات الخاصة بالموظف · المناشير التطبيقية · الشبكة الاستدلالية والترقية
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              حقيبة الوثائق المرجعية والوضعيات الإدارية للموظف ومحاكي الترقية والتأهيل
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
              تجمع هذه الوحدة كافة الملفات والمناشير المرجعية المودعة في حقيبة اللجان المتساوية الأعضاء (إعداد الأستاذ حميدي بشير): القانون الأساسي للجنة، الدليل النقابي، منشور لجان المتعاقدين 06/2009، منشور لجان الطعن 15/2004، منشور مراقبة التشكيلة 18/2006، الترقية بقوائم التأهيل والدرجات، وحركة التنقل والفائض.
            </p>
          </div>

          <a
            href={GOOGLE_DRIVE_BAG_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-3 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#b58922] text-[#071710] font-black text-xs flex items-center gap-2 shadow-lg hover:brightness-110 transition-all whitespace-nowrap shrink-0 self-start lg:self-auto"
          >
            <FolderOpen className="w-4 h-4" />
            <span>فتح حقيبة Google Drive الكاملة (PDF)</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Category Filter Bar */}
      <div className="flex flex-wrap items-center gap-1.5 bg-[#081a12] border border-[#d4af37]/30 p-2 rounded-xl">
        {[
          { id: 'all', label: 'جميع وثائق الحقيبة (12 ملفاً مرجعياً)' },
          { id: 'اللجان المتساوية ولجان الطعن', label: 'اللجان المتساوية ولجان الطعن' },
          { id: 'لجان المتعاقدين', label: 'لجان المتعاقدين (منشور 06/2009)' },
          { id: 'الترقية والتأهيل والدرجات', label: 'الترقية وقوائم التأهيل' },
          { id: 'الشبكة الاستدلالية والخبرة', label: 'الشبكة الاستدلالية والخبرة (85-58)' },
          { id: 'حركة التنقل والفائض والتقييم', label: 'حركة التنقل والفائض (576-96)' },
        ].map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
              selectedCategory === cat.id
                ? 'bg-gradient-to-r from-[#d4af37] to-[#b58922] text-[#071710] font-black shadow'
                : 'bg-[#05140d] text-slate-300 hover:text-white border border-[#d4af37]/20'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Split Explorer: Documents List (5 cols) + Active Document Rules (7 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-5 space-y-2.5">
          {filteredDocs.map((doc) => {
            const isSelected = activeDoc.id === doc.id;
            return (
              <button
                key={doc.id}
                onClick={() => setSelectedDocId(doc.id)}
                className={`w-full text-right p-4 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-gradient-to-br from-[#13462c] via-[#0c2d1c] to-[#081b11] border-2 border-[#d4af37] shadow-lg'
                    : 'bg-[#081a12] border-[#d4af37]/25 hover:border-[#d4af37]/60'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] mb-1">
                  <span className="text-[#f5d77f] font-bold">{doc.referenceCode}</span>
                  <span className="text-emerald-300">{doc.category}</span>
                </div>
                <h3 className="text-sm font-black text-white leading-snug">{doc.title}</h3>
                <div className="text-[11px] text-slate-400 font-mono mt-1 truncate">
                  📄 {doc.fileName}
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Document Detailed Card */}
        <div className="lg:col-span-7 rounded-2xl bg-[#081a12] border border-[#d4af37]/40 p-6 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#d4af37]/20 pb-4">
            <div>
              <div className="text-xs text-[#f5d77f] font-bold">{activeDoc.referenceCode}</div>
              <h3 className="text-lg font-black text-white mt-0.5">{activeDoc.title}</h3>
              <div className="text-xs text-emerald-300 font-mono mt-1">
                الملف الأصلي في الحقيبة: {activeDoc.fileName}
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => handleCopyDocSummary(activeDoc)}
                className="px-3 py-1.5 rounded-lg bg-[#05140d] hover:bg-[#103824] text-[#f5d77f] border border-[#d4af37]/40 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                {copiedId === activeDoc.id ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>تم النسخ</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>نسخ الملخص</span>
                  </>
                )}
              </button>
              <a
                href={GOOGLE_DRIVE_BAG_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#105e32] to-[#0a351c] text-white border border-[#d4af37]/50 text-xs font-bold flex items-center gap-1.5"
              >
                <FileText className="w-3.5 h-3.5 text-[#f5d77f]" />
                <span>معاينة في Drive</span>
              </a>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#05140d] border border-[#d4af37]/25 text-xs sm:text-sm text-slate-200 leading-relaxed">
            {activeDoc.summary}
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-black text-[#f5d77f] flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#10b981]" />
              <span>الضوابط والقواعد القانونية المستخلصة من الوثيقة:</span>
            </h4>
            <div className="space-y-2.5">
              {activeDoc.keyRules.map((rule, i) => (
                <div
                  key={i}
                  className="p-3.5 rounded-xl bg-[#06150e] border border-[#d4af37]/20 text-xs text-slate-200 leading-relaxed flex items-start gap-2.5"
                >
                  <span className="text-[#d4af37] font-black font-mono">{i + 1}.</span>
                  <span>{rule}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Section 2: Interactive Career, Qualification List & Index Grid Simulator (from Drive Bag) */}
      <div className="rounded-2xl bg-[#081a12] border border-[#d4af37]/40 p-6 space-y-6">
        <div className="border-b border-[#d4af37]/20 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="text-xs font-bold text-[#f5d77f]">
              تطبيق عملي لوثائق الحقيبة: الشبكة الاستدلالية 07-304 · الترقية في الدرجة · قائمة التأهيل · تثمين الخبرة 85-58
            </span>
            <h3 className="text-lg sm:text-xl font-black text-white flex items-center gap-2 mt-1">
              <Calculator className="w-5 h-5 text-[#d4af37]" />
              <span>محاكي الترقية في الدرجات (1-12)، التسجيل في قائمة التأهيل، واحتساب الخبرة المهنية</span>
            </h3>
          </div>
          <span className="text-xs font-mono text-emerald-300 bg-[#05140d] px-3 py-1 rounded-lg border border-[#d4af37]/30">
            وتيرة الترقية: 4 (دنيا 30 ش) · 4 (متوسطة 36 ش) · 2 (قصوى 42 ش)
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Inputs (6 cols) */}
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                الصنف الاستدلالي (المرسوم 07-304 / 25-54)
              </label>
              <select
                value={categoryClass}
                onChange={(e) => setCategoryClass(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg bg-[#05140d] border border-[#d4af37]/40 text-white text-xs font-bold"
              >
                <option value={10}>الصنف 10 (الرقم الاستدلالي القاعدي: 453)</option>
                <option value={11}>الصنف 11 (الرقم الاستدلالي القاعدي: 498)</option>
                <option value={12}>الصنف 12 (الرقم الاستدلالي القاعدي: 537)</option>
                <option value={13}>الصنف 13 (الرقم الاستدلالي القاعدي: 578)</option>
                <option value={14}>الصنف 14 (الرقم الاستدلالي القاعدي: 621)</option>
                <option value={15}>الصنف 15 (الرقم الاستدلالي القاعدي: 666)</option>
                <option value={16}>الصنف 16 (الرقم الاستدلالي القاعدي: 713)</option>
                <option value={17}>الصنف 17 (الرقم الاستدلالي القاعدي: 762)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                الدرجة الحالية (من 1 إلى 12)
              </label>
              <select
                value={currentEchelon}
                onChange={(e) => setCurrentEchelon(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg bg-[#05140d] border border-[#d4af37]/40 text-white text-xs font-bold"
              >
                {Array.from({ length: 12 }, (_, i) => i + 1).map((deg) => (
                  <option key={deg} value={deg}>
                    الدرجة {deg}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                الأقدمية الفعلية في الرتبة الحالية (سنوات)
              </label>
              <input
                type="number"
                min={0}
                max={40}
                value={yearsInRank}
                onChange={(e) => setYearsInRank(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg bg-[#05140d] border border-[#d4af37]/40 text-white text-xs font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                سنوات الخبرة خارج القطاع (تثمين بالنصف 85-58)
              </label>
              <input
                type="number"
                min={0}
                max={20}
                value={externalExperienceYears}
                onChange={(e) => setExternalExperienceYears(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg bg-[#05140d] border border-[#d4af37]/40 text-white text-xs font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                العلامة الإدارية السنوية (/20)
              </label>
              <input
                type="number"
                step="0.5"
                min={0}
                max={20}
                value={adminMark}
                onChange={(e) => setAdminMark(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg bg-[#05140d] border border-[#d4af37]/40 text-white text-xs font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                علامة التفتيش البيداغوجي / التقني (/20)
              </label>
              <input
                type="number"
                step="0.5"
                min={0}
                max={20}
                value={inspectionMark}
                onChange={(e) => setInspectionMark(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg bg-[#05140d] border border-[#d4af37]/40 text-white text-xs font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                نقاط الشهادات الإضافية (0 - 6)
              </label>
              <input
                type="number"
                min={0}
                max={6}
                value={extraDiplomasPoints}
                onChange={(e) => setExtraDiplomasPoints(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg bg-[#05140d] border border-[#d4af37]/40 text-white text-xs font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                نقاط الدورات التكوينية والأشغال (0 - 6)
              </label>
              <input
                type="number"
                min={0}
                max={6}
                value={trainingPoints}
                onChange={(e) => setTrainingPoints(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg bg-[#05140d] border border-[#d4af37]/40 text-white text-xs font-mono"
              />
            </div>
          </div>

          {/* Results (6 cols) */}
          <div className="lg:col-span-6 bg-[#05140d] border border-[#d4af37]/40 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-[#d4af37]/20 pb-3">
              <span className="text-xs font-bold text-[#f5d77f] flex items-center gap-1.5">
                <Award className="w-4 h-4 text-[#d4af37]" />
                <span>بطاقة المحاكاة المعروضة على اللجنة المتساوية الأعضاء</span>
              </span>
              <span
                className={`text-[11px] font-bold px-2.5 py-0.5 rounded ${
                  isEligibleForQualificationList
                    ? 'bg-[#105e32] text-[#f5d77f] border border-[#d4af37]/40'
                    : 'bg-[#8f1414] text-white'
                }`}
              >
                {isEligibleForQualificationList
                  ? 'مستوفٍ لشرط 10 سنوات لقائمة التأهيل ✓'
                  : `غير مستوفٍ لقائمة التأهيل (متبقي ${10 - yearsInRank} سنوات)`}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="p-3 rounded-lg bg-[#081a12] border border-[#d4af37]/20">
                <div className="text-[11px] text-slate-400">الرقم الاستدلالي القاعدي</div>
                <div className="text-lg font-black text-white font-mono tabular-nums mt-0.5">
                  {baseIndex} ن
                </div>
                <div className="text-[10px] text-emerald-300">الصنف {categoryClass}</div>
              </div>

              <div className="p-3 rounded-lg bg-[#081a12] border border-[#d4af37]/20">
                <div className="text-[11px] text-slate-400">الزيادة الاستدلالية للدرجة {currentEchelon}</div>
                <div className="text-lg font-black text-[#f5d77f] font-mono tabular-nums mt-0.5">
                  +{echelonIndexBonus} ن
                </div>
                <div className="text-[10px] text-slate-400">الإجمالي: {totalIndex} نقطة</div>
              </div>

              <div className="p-3 rounded-lg bg-[#081a12] border border-[#d4af37]/20 col-span-2 sm:col-span-1">
                <div className="text-[11px] text-slate-400">مجموع مقياس التأهيل والترقية</div>
                <div className="text-lg font-black text-emerald-400 font-mono tabular-nums mt-0.5">
                  {totalQualificationScore.toFixed(1)} / 82 ن
                </div>
                <div className="text-[10px] text-[#f5d77f]">شامل تثمين الخبرة ({externalExperienceYears / 2} س)</div>
              </div>
            </div>

            <div className="p-3.5 rounded-lg bg-[#081a12] border border-[#d4af37]/25 text-xs text-slate-300 space-y-1.5">
              <div className="font-bold text-white flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-[#d4af37]" />
                <span>توصية اللجنة الإدارية المتساوية الأعضاء بشأن الترقية في الدرجة ({currentEchelon} ← {Math.min(12, currentEchelon + 1)}):</span>
              </div>
              <p className="leading-relaxed">
                بناءً على مجموع التنقيط السنوي (<span className="font-mono text-[#f5d77f] font-bold">{(adminMark + inspectionMark).toFixed(1)}/40</span>)، يرتب الموظف ضمن حصة <strong>المدة الدنيا (30 شهراً — سنتان ونصف)</strong> المخصصة لأعلى 4 موظفين تنقيطاً من أصل كل 10 موظفين مسجلين في الجدول السنوي.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
