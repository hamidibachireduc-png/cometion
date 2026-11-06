import React, { useState } from 'react';
import {
  INITIAL_DISCIPLINARY_CASES,
  SANCTIONS_CATALOG,
  DisciplinaryCase,
} from '../data/capData';
import {
  Gavel,
  ShieldAlert,
  CheckCircle2,
  AlertOctagon,
  Clock,
  FileWarning,
  Plus,
} from 'lucide-react';

export const DisciplinaryCouncilModule: React.FC = () => {
  const [cases, setCases] = useState<DisciplinaryCase[]>(INITIAL_DISCIPLINARY_CASES);
  const [selectedCaseId, setSelectedCaseId] = useState<string>(INITIAL_DISCIPLINARY_CASES[0].id);
  const [sanctionFilter, setSanctionFilter] = useState<string>('all');
  const [activeSituationTab, setActiveSituationTab] = useState<
    'suspension' | 'appeals' | 'abandonment' | 'rehab'
  >('suspension');

  const [suspensionInputDate, setSuspensionInputDate] = useState<string>('2026-10-05');

  const [showNewCaseForm, setShowNewCaseForm] = useState<boolean>(false);
  const [empName, setEmpName] = useState<string>('');
  const [empPpr, setEmpPpr] = useState<string>('');
  const [empGrade, setEmpGrade] = useState<string>('أستاذ التعليم الثانوي — الصنف 14');
  const [empStatus, setEmpStatus] = useState<'مرسم' | 'متمرن' | 'متعاقد'>('مرسم');
  const [empViolation, setEmpViolation] = useState<string>('');

  const selectedCase = cases.find((c) => c.id === selectedCaseId) || cases[0];

  const toggleGuarantee = (key: keyof DisciplinaryCase['legalGuaranteesChecked']) => {
    setCases((prev) =>
      prev.map((c) =>
        c.id === selectedCase.id
          ? {
              ...c,
              legalGuaranteesChecked: {
                ...c.legalGuaranteesChecked,
                [key]: !c.legalGuaranteesChecked[key],
              },
            }
          : c
      )
    );
  };

  const updateCaseSanction = (newSanction: string, newStage: DisciplinaryCase['stage']) => {
    setCases((prev) =>
      prev.map((c) =>
        c.id === selectedCase.id
          ? {
              ...c,
              proposedSanction: newSanction,
              stage: newStage,
            }
          : c
      )
    );
  };

  const handleAddCase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!empName.trim() || !empPpr.trim() || !empViolation.trim()) return;
    const newCase: DisciplinaryCase = {
      id: `disc-${Date.now()}`,
      reference: `CAP-DISC/2026/${Math.floor(20 + Math.random() * 80)}`,
      employeeName: empName.trim(),
      ppr: empPpr.trim(),
      grade: empGrade.trim(),
      status: empStatus,
      violationType: empViolation.trim(),
      precautionarySuspension: false,
      hearingDate: '2026-12-05',
      stage: 'استدعاء واطلاع على الملف',
      proposedSanction: 'قيد الدراسة من طرف المقرر',
      legalGuaranteesChecked: {
        fifteenDaysNotice: true,
        fileAccessGranted: true,
        defenseWitnessAllowed: true,
        higherOrEqualGradeMembers: true,
        quorumMet: true,
      },
      notes: 'ملف محال داخل أجل 45 يوماً القانوني من تاريخ معاينة الخطأ المهني.',
    };
    setCases((prev) => [newCase, ...prev]);
    setSelectedCaseId(newCase.id);
    setEmpName('');
    setEmpPpr('');
    setEmpViolation('');
    setShowNewCaseForm(false);
  };

  const allGuaranteesValid =
    selectedCase.legalGuaranteesChecked.fifteenDaysNotice &&
    selectedCase.legalGuaranteesChecked.fileAccessGranted &&
    selectedCase.legalGuaranteesChecked.higherOrEqualGradeMembers &&
    selectedCase.legalGuaranteesChecked.quorumMet;

  const computeDeadline = (dateStr: string, monthsToAdd: number) => {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return 'تاريخ غير صالح';
    d.setMonth(d.getMonth() + monthsToAdd);
    return d.toISOString().split('T')[0];
  };

  const filteredSanctions =
    sanctionFilter === 'all'
      ? SANCTIONS_CATALOG
      : SANCTIONS_CATALOG.filter((s) => s.degree === sanctionFilter);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl bg-[#081a12] border border-[#d4af37]/40 p-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <div className="text-xs text-[#f5d77f] font-bold mb-1">
            المواد 160-175 (الأمر 06-03) · المنشور 06/2009 للمتعاقدين · المنشور 15/2004 للجان الطعن
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            المجلس التأديبي، لجان الطعن، ومختلف الوضعيات التأديبية للموظف والمتعاقد
          </h2>
        </div>
        <button
          onClick={() => setShowNewCaseForm(!showNewCaseForm)}
          className="px-4 py-2.5 text-xs font-black text-[#071710] bg-gradient-to-r from-[#d4af37] to-[#b58922] hover:brightness-110 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap shrink-0 self-start lg:self-auto cursor-pointer shadow-lg"
        >
          <Plus className="w-4 h-4" />
          <span>إحالة ملف تأديبي / طعن جديد</span>
        </button>
      </div>

      {/* Add Disciplinary Case Form */}
      {showNewCaseForm && (
        <form
          onSubmit={handleAddCase}
          className="rounded-2xl bg-[#081a12] border-2 border-[#d4af37] p-6 space-y-4 shadow-xl"
        >
          <div className="text-base font-black text-white border-b border-[#d4af37]/20 pb-3">
            تسجيل ملف تأديبي أو عريضة طعن أمام اللجنة المختصة
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                الاسم واللقب للموظف / العون
              </label>
              <input
                type="text"
                required
                value={empName}
                onChange={(e) => setEmpName(e.target.value)}
                placeholder="الاسم الكامل"
                className="w-full px-3 py-2 text-xs bg-[#05140d] border border-[#d4af37]/40 rounded-lg text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                الرقم الوظيفي / رقم العقد
              </label>
              <input
                type="text"
                required
                value={empPpr}
                onChange={(e) => setEmpPpr(e.target.value)}
                placeholder="مثال: 1948201"
                className="w-full px-3 py-2 text-xs font-mono bg-[#05140d] border border-[#d4af37]/40 rounded-lg text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                الرتبة والصنف والدرجة
              </label>
              <input
                type="text"
                required
                value={empGrade}
                onChange={(e) => setEmpGrade(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-[#05140d] border border-[#d4af37]/40 rounded-lg text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                الوضعية القانونية
              </label>
              <select
                value={empStatus}
                onChange={(e) => setEmpStatus(e.target.value as any)}
                className="w-full px-3 py-2 text-xs bg-[#05140d] border border-[#d4af37]/40 rounded-lg text-white"
              >
                <option value="مرسم">موظف مرسم</option>
                <option value="متمرن">موظف متربص / متمرن</option>
                <option value="متعاقد">عون متعاقد (منشور 06/2009)</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              ملخص الوقائع المنسوبة أو موضوع الطعن
            </label>
            <input
              type="text"
              required
              value={empViolation}
              onChange={(e) => setEmpViolation(e.target.value)}
              placeholder="وصف دقيق للأفعال المهنية وتاريخ معاينتها..."
              className="w-full px-3 py-2 text-xs bg-[#05140d] border border-[#d4af37]/40 rounded-lg text-white"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowNewCaseForm(false)}
              className="px-4 py-2 text-xs font-bold text-slate-300 bg-slate-800 rounded-lg cursor-pointer"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-black text-[#071710] bg-gradient-to-r from-[#d4af37] to-[#b58922] rounded-lg cursor-pointer"
            >
              قيد الملف وإصدار الاستدعاء القانوني
            </button>
          </div>
        </form>
      )}

      {/* Split Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Cases Queue */}
        <div className="lg:col-span-5 rounded-2xl bg-[#081a12] border border-[#d4af37]/40 p-5 space-y-4">
          <div className="border-b border-[#d4af37]/20 pb-3 flex items-center justify-between">
            <h3 className="text-base font-black text-white flex items-center gap-2">
              <Gavel className="w-4 h-4 text-[#d4af37]" />
              <span>جدول الملفات التأديبية والطعون</span>
            </h3>
            <span className="text-xs font-mono text-[#f5d77f]">{cases.length} ملفات</span>
          </div>

          <div className="space-y-3">
            {cases.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCaseId(c.id)}
                className={`w-full text-right p-4 rounded-xl border transition-all cursor-pointer ${
                  selectedCase.id === c.id
                    ? 'bg-gradient-to-br from-[#13462c] via-[#0c2d1c] to-[#081b11] border-2 border-[#d4af37] shadow-lg'
                    : 'border-[#d4af37]/25 bg-[#05140d] hover:border-[#d4af37]/60'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                  <span className="font-mono font-bold text-[#f5d77f]">{c.reference}</span>
                  <span>
                    الوضعية: <strong className="text-white">{c.status}</strong> · جلسة:{' '}
                    <span className="font-mono text-emerald-300">{c.hearingDate}</span>
                  </span>
                </div>
                <div className="text-sm font-black text-white">
                  {c.employeeName} —{' '}
                  <span className="font-mono text-xs font-normal text-slate-300">
                    {c.ppr}
                  </span>
                </div>
                <div className="text-xs text-slate-300 mt-1 line-clamp-2">{c.violationType}</div>
                <div className="mt-2 pt-2 border-t border-[#d4af37]/20 flex items-center justify-between text-xs">
                  <span className="text-emerald-300 font-bold">{c.stage}</span>
                  {c.precautionarySuspension && (
                    <span className="bg-[#8f1414] text-white px-2 py-0.5 rounded text-[10px] font-bold">
                      توقيف تحفظي فوري
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right: Active Case Guarantees Verifier */}
        <div className="lg:col-span-7 rounded-2xl bg-[#081a12] border border-[#d4af37]/40 p-6 space-y-6">
          <div className="border-b border-[#d4af37]/20 pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <div className="text-xs text-[#f5d77f] font-bold">
                مراقبة الضمانات التأديبية الآمرة وحقوق الدفاع
              </div>
              <h3 className="text-lg font-black text-white mt-0.5">
                {selectedCase.employeeName} — <span className="text-emerald-300">{selectedCase.grade}</span>
              </h3>
            </div>
            <span className="text-xs font-mono text-[#f5d77f] bg-[#05140d] px-2.5 py-1 rounded border border-[#d4af37]/30">
              {selectedCase.reference}
            </span>
          </div>

          <div className="p-4 bg-[#05140d] border border-[#d4af37]/30 rounded-xl space-y-2 text-xs text-slate-200">
            <div>
              <strong className="text-[#f5d77f]">الوقائع / موضوع الإحالة: </strong>
              {selectedCase.violationType}
            </div>
            <div>
              <strong className="text-emerald-300">ملاحظات المقرر النقابي والقانوني: </strong>
              {selectedCase.notes}
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs sm:text-sm font-black text-white">
                فحص الضمانات القانونية قبل المداولة (لتفادي بطلان القرار أمام لجنة الطعن أو القضاء):
              </h4>
              {allGuaranteesValid ? (
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" />
                  المسطرة مستوفية للضمانات
                </span>
              ) : (
                <span className="text-xs font-bold text-rose-400 flex items-center gap-1">
                  <AlertOctagon className="w-4 h-4" />
                  عيب إجرائي مبطل للمداولة
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
              <label className="flex items-start gap-2.5 p-3 border border-[#d4af37]/25 bg-[#05140d] rounded-xl cursor-pointer hover:border-[#d4af37]/60">
                <input
                  type="checkbox"
                  checked={selectedCase.legalGuaranteesChecked.fifteenDaysNotice}
                  onChange={() => toggleGuarantee('fifteenDaysNotice')}
                  className="mt-0.5 accent-[#d4af37]"
                />
                <span className="text-slate-300">
                  <strong className="block text-white">احترام أجل الإخطار (45 يوماً) والاستدعاء (15 يوماً)</strong>
                  إخطار المجلس خلال 45 يوماً من معاينة الخطأ وتبليغ الموظف قبل 15 يوماً من الجلسة.
                </span>
              </label>

              <label className="flex items-start gap-2.5 p-3 border border-[#d4af37]/25 bg-[#05140d] rounded-xl cursor-pointer hover:border-[#d4af37]/60">
                <input
                  type="checkbox"
                  checked={selectedCase.legalGuaranteesChecked.fileAccessGranted}
                  onChange={() => toggleGuarantee('fileAccessGranted')}
                  className="mt-0.5 accent-[#d4af37]"
                />
                <span className="text-slate-300">
                  <strong className="block text-white">تمكين الموظف/المتعاقد من الاطلاع الكامل على ملفه</strong>
                  توقيع محضر الاطلاع على جميع وثائق الملف التأديبي والاستعانة بمدافع يختاره.
                </span>
              </label>

              <label className="flex items-start gap-2.5 p-3 border border-[#d4af37]/25 bg-[#05140d] rounded-xl cursor-pointer hover:border-[#d4af37]/60">
                <input
                  type="checkbox"
                  checked={selectedCase.legalGuaranteesChecked.higherOrEqualGradeMembers}
                  onChange={() => toggleGuarantee('higherOrEqualGradeMembers')}
                  className="mt-0.5 accent-[#d4af37]"
                />
                <span className="text-slate-300">
                  <strong className="block text-white">شرط الرتبة المماثلة أو الأعلى ومبدأ الحياد</strong>
                  عدم مشاركة صاحب الشكوى أو عضو أقل رتبة في مداولات المجلس التأديبي.
                </span>
              </label>

              <label className="flex items-start gap-2.5 p-3 border border-[#d4af37]/25 bg-[#05140d] rounded-xl cursor-pointer hover:border-[#d4af37]/60">
                <input
                  type="checkbox"
                  checked={selectedCase.legalGuaranteesChecked.quorumMet}
                  onChange={() => toggleGuarantee('quorumMet')}
                  className="mt-0.5 accent-[#d4af37]"
                />
                <span className="text-slate-300">
                  <strong className="block text-white">حضور النصاب القانوني (3/4) والتصويت السري</strong>
                  تحقق نصاب ثلاثة أرباع الأعضاء وتساوي الطرفين والاقتراع السري.
                </span>
              </label>
            </div>
          </div>

          <div className="border-t border-[#d4af37]/20 pt-5 space-y-3">
            <label className="block text-xs font-black text-[#f5d77f]">
              تحديث الرأي المتخذ في الجلسة ومرحلة الملف:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <select
                value={selectedCase.proposedSanction}
                onChange={(e) => updateCaseSanction(e.target.value, 'اقتراح العقوبة')}
                className="px-3 py-2 text-xs bg-[#05140d] border border-[#d4af37]/40 rounded-lg text-white"
              >
                <option value="البراءة وحفظ الملف لعدم ثبوت الخطأ المهني">
                  البراءة وحفظ الملف لعدم ثبوت الخطأ المهني
                </option>
                <option value="الإنذار الكتابي أو التوبيخ (الدرجة الأولى)">
                  الإنذار الكتابي أو التوبيخ (الدرجة الأولى)
                </option>
                <option value="التوقيف عن العمل من 1 إلى 3 أيام أو الشطب من قائمة التأهيل (الدرجة الثانية)">
                  التوقيف عن العمل من 1 إلى 3 أيام أو الشطب من قائمة التأهيل (الدرجة الثانية)
                </option>
                <option value="التوقيف من 4 إلى 8 أيام أو التنزيل من درجة إلى درجتين (الدرجة الثالثة)">
                  التوقيف من 4 إلى 8 أيام أو التنزيل من درجة إلى درجتين (الدرجة الثالثة)
                </option>
                <option value="النقل الإجباري (الدرجة الثالثة)">النقل الإجباري (الدرجة الثالثة)</option>
                <option value="التنزيل إلى الرتبة السفلى مباشرة أو التسريح (الدرجة الرابعة)">
                  التنزيل إلى الرتبة السفلى مباشرة أو التسريح (الدرجة الرابعة)
                </option>
                <option value="قبول الطعن أمام لجنة الطعن وإلغاء العقوبة المتخذة">
                  قبول الطعن أمام لجنة الطعن وإلغاء العقوبة المتخذة
                </option>
              </select>

              <select
                value={selectedCase.stage}
                onChange={(e) =>
                  updateCaseSanction(selectedCase.proposedSanction, e.target.value as any)
                }
                className="px-3 py-2 text-xs bg-[#05140d] border border-[#d4af37]/40 rounded-lg text-white"
              >
                <option value="استدعاء واطلاع على الملف">1. استدعاء واطلاع على الملف</option>
                <option value="جلسة الاستماع والمداولة">2. جلسة الاستماع والمداولة السرية</option>
                <option value="اقتراح العقوبة">3. إصدار الرأي المطابق المعلل</option>
                <option value="لجنة الطعن / التبليغ النهائي">4. لجنة الطعن / التبليغ النهائي</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Section 2: Special Disciplinary Situations */}
      <div className="rounded-2xl bg-[#081a12] border border-[#d4af37]/40 p-6 space-y-5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-[#d4af37]/20 pb-4">
          <div>
            <div className="text-xs text-[#f5d77f] font-bold mb-1">
              الوضعيات التأديبية الخاصة وآجال التقادم والطعن
            </div>
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-[#d4af37]" />
              <span>التوقيف التحفظي الفوري، مسطرة لجنة الطعن (منشور 15/2004)، إهمال المنصب، ورد الاعتبار</span>
            </h3>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-[#05140d] border border-[#d4af37]/30 rounded-xl">
            {[
              { id: 'suspension', label: 'التوقيف التحفظي الفوري' },
              { id: 'appeals', label: 'لجنة الطعن (المنشور 15/2004)' },
              { id: 'abandonment', label: 'إهمال المنصب / ترك الوظيفة' },
              { id: 'rehab', label: 'رد الاعتبار ومحو العقوبة' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveSituationTab(tab.id as any)}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                  activeSituationTab === tab.id
                    ? 'bg-gradient-to-r from-[#d4af37] to-[#b58922] text-[#071710] font-black shadow'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {activeSituationTab === 'suspension' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center bg-[#05140d] p-5 rounded-xl border border-[#d4af37]/30">
            <div className="lg:col-span-7 space-y-3 text-xs text-slate-200">
              <h4 className="text-base font-black text-white">
                وضعية التوقيف التحفظي الفوري في حالة الخطأ المهني الجسيم (المواد 173-174 / الفصل 73)
              </h4>
              <p className="leading-relaxed">
                عند ارتكاب خطأ جسيم قد يؤدي إلى عقوبة من الدرجة الرابعة، يمكن للسلطة التي لها صلاحية التعيين توقيف الموظف فوراً، مع تقاضيه نصف راتبه الأساسي ومجمل المنح العائلية (أو المنح العائلية حسب النظام المطبق).
              </p>
              <ul className="space-y-1.5">
                <li>
                  • <strong className="text-[#f5d77f]">الأجل القانوني الحاسم لتسوية الوضعية:</strong> يجب أن يبت المجلس التأديبي وتسوى وضعية الموظف الموقوف نهائياً في أجل شهرين (إلى 4 أشهر كحد أقصى).
                </li>
                <li>
                  • <strong className="text-emerald-300">جزاء عدم البت في الأجل:</strong> إذا لم يتخذ أي مقرر عند انتهاء الأجل القانوني، يعاد إدماج الموظف وجوباً في منصبه ويسترجع كامل حقوقه ومرتبه المقتطع.
                </li>
              </ul>
            </div>
            <div className="lg:col-span-5 bg-[#081a12] p-4 rounded-xl border border-[#d4af37]/40 space-y-3">
              <div className="text-xs font-black text-[#f5d77f] flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-[#d4af37]" />
                <span>حاسبة الآجال القانونية للتسوية وإرجاع الراتب:</span>
              </div>
              <div>
                <label className="block text-xs text-slate-300 mb-1">
                  تاريخ سريان مقرر التوقيف التحفظي:
                </label>
                <input
                  type="date"
                  value={suspensionInputDate}
                  onChange={(e) => setSuspensionInputDate(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs font-mono bg-[#05140d] border border-[#d4af37]/40 rounded-lg text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-2.5 text-xs">
                <div className="p-2.5 bg-[#05140d] border border-[#d4af37]/30 rounded-lg">
                  <div className="text-[11px] text-slate-400">أجل الشهرين (المادة 174):</div>
                  <div className="text-sm font-black font-mono text-emerald-400 mt-1">
                    {computeDeadline(suspensionInputDate, 2)}
                  </div>
                </div>
                <div className="p-2.5 bg-[#05140d] border border-[#d4af37]/30 rounded-lg">
                  <div className="text-[11px] text-slate-400">أجل الـ 4 أشهر الأقصى:</div>
                  <div className="text-sm font-black font-mono text-[#f5d77f] mt-1">
                    {computeDeadline(suspensionInputDate, 4)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSituationTab === 'appeals' && (
          <div className="bg-[#05140d] p-5 rounded-xl border border-[#d4af37]/30 space-y-3 text-xs text-slate-200">
            <h4 className="text-base font-black text-white">
              إجراءات إخطار لجنة الطعن الولائية / الوزارية (رسالة المنشور رقم 15 المؤرخ في 10 أوت 2004)
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="p-4 bg-[#081a12] border border-[#d4af37]/30 rounded-xl">
                <div className="font-black text-[#f5d77f] mb-1">1. العقوبات القابلة للطعن</div>
                <p>يفتح باب الطعن أمام الموظف أو العون المتعاقد ضد العقوبات التأديبية من الدرجتين الثالثة والرابعة (أو فسخ العقد التأديبي).</p>
              </div>
              <div className="p-4 bg-[#081a12] border border-[#d4af37]/30 rounded-xl">
                <div className="font-black text-[#f5d77f] mb-1">2. أجل إيداع الطعن (15 يوماً)</div>
                <p>يرفع الطعن بعريضة كتابية مرفقة بالوثائق التدعيمية في أجل أقصاه 15 يوماً ابتداءً من تاريخ التبليغ الشخصي لقرار العقوبة.</p>
              </div>
              <div className="p-4 bg-[#081a12] border border-[#d4af37]/30 rounded-xl">
                <div className="font-black text-emerald-300 mb-1">3. البت خلال شهرين بقرار ملزم</div>
                <p>تبت لجنة الطعن في أجل أقصاه شهران (60 يوماً)، وتكون قراراتها (بالإلغاء أو التخفيف أو التأييد) نهائية وملزمة للإدارة.</p>
              </div>
            </div>
          </div>
        )}

        {activeSituationTab === 'abandonment' && (
          <div className="bg-[#05140d] p-5 rounded-xl border border-[#d4af37]/30 space-y-3 text-xs text-slate-200">
            <h4 className="text-base font-black text-white">
              مسطرة العزل بسبب إهمال المنصب / ترك الوظيفة (وجوب احترام إعذارين متتاليين)
            </h4>
            <p className="leading-relaxed">
              لا يجوز للإدارة إصدار مقرر العزل بسبب إهمال المنصب إلا بعد توجيه إعذارين كتابيين (Mise en demeure) للموظف للالتحاق بمنصبه مع إشعار بالاستلام، وانقضاء المهلة القانونية دون تقديم مبرر قاهر، مع حق الموظف في الطعن إذا شاب التبليغ أي خلل.
            </p>
          </div>
        )}

        {activeSituationTab === 'rehab' && (
          <div className="bg-[#05140d] p-5 rounded-xl border border-[#d4af37]/30 space-y-3 text-xs text-slate-200">
            <h4 className="text-base font-black text-white">
              رد الاعتبار وسحب العقوبات التأديبية من الملف الإداري (المادة 176 / الفصل 75)
            </h4>
            <p className="leading-relaxed">
              يستفيد الموظف من رد الاعتبار ومحو آثار العقوبة التأديبية من ملفه الإداري (بحيث لا يبقى لها أي أثر في المسار المهني أو الترقية) بعد مرور سنة واحدة بدون عقوبة جديدة بالنسبة لعقوبات الدرجة الأولى، وبعد استشارة اللجنة المتساوية الأعضاء بالنسبة لباقي العقوبات عند استيفاء المدة القانونية.
            </p>
          </div>
        )}
      </div>

      {/* Section 3: Sanctions Catalog Table */}
      <div className="rounded-2xl bg-[#081a12] border border-[#d4af37]/40 p-6 space-y-5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-[#d4af37]/20 pb-4">
          <div>
            <div className="text-xs text-[#f5d77f] font-bold mb-1">
              تصنيف العقوبات التأديبية حسب الدرجات (المادة 163 والمنشور 06/2009)
            </div>
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <FileWarning className="w-5 h-5 text-[#d4af37]" />
              <span>جدول العقوبات التأديبية للموظفين، المتربصين، والأعوان المتعاقدين</span>
            </h3>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-[#05140d] border border-[#d4af37]/30 rounded-xl">
            {[
              { id: 'all', label: 'الكل' },
              { id: 'الدرجة الأولى', label: 'الدرجة 1' },
              { id: 'الدرجة الثانية', label: 'الدرجة 2' },
              { id: 'الدرجة الثالثة', label: 'الدرجة 3' },
              { id: 'الدرجة الرابعة', label: 'الدرجة 4' },
              { id: 'خاصة بالأعوان المتعاقدين', label: 'المتعاقدون (06/2009)' },
            ].map((btn) => (
              <button
                key={btn.id}
                onClick={() => setSanctionFilter(btn.id)}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                  sanctionFilter === btn.id
                    ? 'bg-gradient-to-r from-[#d4af37] to-[#b58922] text-[#071710] font-black shadow'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse text-xs">
            <thead>
              <tr className="bg-[#05140d] border-b border-[#d4af37]/30 text-[#f5d77f]">
                <th className="py-3 px-3 font-bold">العقوبة التأديبية</th>
                <th className="py-3 px-3 font-bold">التصنيف</th>
                <th className="py-3 px-3 font-bold">السلطة المختصة والمسطرة</th>
                <th className="py-3 px-3 font-bold">الأثر المالي والمهني</th>
                <th className="py-3 px-3 font-bold">الطعن ورد الاعتبار</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#d4af37]/15 text-slate-200">
              {filteredSanctions.map((s) => (
                <tr key={s.id} className="hover:bg-[#0b2318]/60 transition-colors">
                  <td className="py-3.5 px-3 font-black text-white">
                    {s.name}
                    <div className="text-[11px] font-normal text-emerald-300 mt-0.5">
                      {s.legalArticle}
                    </div>
                  </td>
                  <td className="py-3.5 px-3 text-[#f5d77f] font-bold">{s.degree}</td>
                  <td className="py-3.5 px-3">{s.authority}</td>
                  <td className="py-3.5 px-3">
                    <div>
                      <strong className="text-[#f5d77f]">مالياً:</strong> {s.financialImpact}
                    </div>
                    <div className="mt-0.5">
                      <strong className="text-emerald-300">مهنياً:</strong> {s.careerImpact}
                    </div>
                  </td>
                  <td className="py-3.5 px-3 font-mono text-slate-300">{s.rehabilitationPeriod}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
