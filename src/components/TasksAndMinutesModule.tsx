import React, { useState } from 'react';
import {
  FileCheck2,
  Printer,
  ClipboardList,
  Plus,
  Trash2,
  CheckCircle2,
  Download,
} from 'lucide-react';

interface MinuteDecisionRow {
  id: string;
  employeeName: string;
  ppr: string;
  currentGrade: string;
  subject: string;
  committeeOpinion: string;
}

export const TasksAndMinutesModule: React.FC = () => {
  const [templateType, setTemplateType] = useState<
    'promotion' | 'tenure' | 'disciplinary' | 'contractual' | 'transfer'
  >('promotion');

  const [ministryName, setMinistryName] = useState<string>(
    'وزارة التربية الوطنية — مديرية التربية / مصلحة المستخدمين والتفتيش'
  );
  const [commissionName, setCommissionName] = useState<string>(
    'اللجنة الإدارية المتساوية الأعضاء المختصة إزاء أسلاك التعليم والتأطير (الأطوار الثلاثة)'
  );
  const [sessionDate, setSessionDate] = useState<string>('2026-11-15');
  const [sessionNumber, setSessionNumber] = useState<string>('PV-CAP-2026/04');
  const [presidentName, setPresidentName] = useState<string>(
    'السيد رئيس اللجنة الإدارية المتساوية الأعضاء (ممثل الإدارة)'
  );
  const [adminMembers, setAdminMembers] = useState<string>(
    'رئيس مصلحة المستخدمين، رئيس مصلحة البرمجة والمتابعة، مفتش الإدارة'
  );
  const [staffMembers, setStaffMembers] = useState<string>(
    'الأستاذ حميدي بشير (SNTE)، الأستاذ عبد الرزاق بوقرة (SNTE)، الأستاذ سليم بوزيان (SNTE)'
  );

  const [decisions, setDecisions] = useState<MinuteDecisionRow[]>([
    {
      id: 'row-1',
      employeeName: 'عبد الرحمن قاسمي',
      ppr: '1402938',
      currentGrade: 'الصنف 14 — الدرجة 6',
      subject: 'الترقية في الدرجة إلى الدرجة 7 بالمدة الدنيا (30 شهراً) برسم جدول سنة 2026',
      committeeOpinion: 'مصادقة بالإجماع على الترقية في المدة الدنيا',
    },
    {
      id: 'row-2',
      employeeName: 'فاطمة الزهراء بن علي',
      ppr: '1693821',
      currentGrade: 'أقدمية 12 سنة خدمة فعلية',
      subject: 'التسجيل في قائمة التأهيل للترقية إلى الرتبة الأعلى (مجموع المقياس: 68.5 ن)',
      committeeOpinion: 'موافقة بالإجماع على التسجيل في قائمة التأهيل النهائية',
    },
    {
      id: 'row-3',
      employeeName: 'يوسف بلقاسم',
      ppr: '2194022',
      currentGrade: 'أستاذ متربص (سنة التربص القانونية)',
      subject: 'البت في ملف الترسيم (التثبيت) بعد تقرير التفتيش الإيجابي',
      committeeOpinion: 'قرار الترسيم في الرتبة الأصلية ابتداءً من تاريخ استيفاء التربص',
    },
  ]);

  const [newEmp, setNewEmp] = useState<string>('');
  const [newPpr, setNewPpr] = useState<string>('');
  const [newGrade, setNewGrade] = useState<string>('');
  const [newSubj, setNewSubj] = useState<string>('');
  const [newOpinion, setNewOpinion] = useState<string>('موافقة بالإجماع');

  const handleTemplateSwitch = (
    type: 'promotion' | 'tenure' | 'disciplinary' | 'contractual' | 'transfer'
  ) => {
    setTemplateType(type);
    if (type === 'promotion') {
      setCommissionName(
        'اللجنة الإدارية المتساوية الأعضاء — جدول الترقية في الدرجات وقوائم التأهيل'
      );
      setDecisions([
        {
          id: 'p-1',
          employeeName: 'عبد الرحمن قاسمي',
          ppr: '1402938',
          currentGrade: 'الصنف 14 — الدرجة 6',
          subject: 'الترقية إلى الدرجة 7 بالمدة الدنيا (30 شهراً) وفق النسبة 4:4:2',
          committeeOpinion: 'مصادقة بالإجماع',
        },
        {
          id: 'p-2',
          employeeName: 'فاطمة الزهراء بن علي',
          ppr: '1693821',
          currentGrade: 'أقدمية 12 سنة في الرتبة',
          subject: 'التسجيل في قائمة التأهيل السنوية للترقية إلى الرتبة الأعلى',
          committeeOpinion: 'موافقة بالإجماع',
        },
      ]);
    } else if (type === 'tenure') {
      setCommissionName('اللجنة الإدارية المتساوية الأعضاء المنعقدة كلجنة ترسيم (تثبيت المتربصين)');
      setDecisions([
        {
          id: 't-1',
          employeeName: 'يوسف بلقاسم',
          ppr: '2194022',
          currentGrade: 'موظف متربص',
          subject: 'البت في اقتراح التثبيت بعد قضاء فترة التربص القانونية',
          committeeOpinion: 'موافقة على الترسيم في الرتبة',
        },
        {
          id: 't-2',
          employeeName: 'نزهة بوعبيد',
          ppr: '2194881',
          currentGrade: 'موظفة متربصة',
          subject: 'دراسة طلب تمديد فترة التربص لسنة ثانية وأخيرة',
          committeeOpinion: 'قرار تمديد فترة التربص لمدة سنة واحدة',
        },
      ]);
    } else if (type === 'disciplinary') {
      setCommissionName('اللجنة الإدارية المتساوية الأعضاء المنعقدة في شكل مجلس تأديبي');
      setDecisions([
        {
          id: 'd-1',
          employeeName: 'كمال بوزيدي',
          ppr: '1489203',
          currentGrade: 'الصنف 14 — الدرجة 6',
          subject: 'النظر في الملف التأديبي رقم 14/2026 بعد الاطلاع على الملف والاستماع للموظف ومدافعه النقابي',
          committeeOpinion: 'اقتراح تخفيف العقوبة إلى الدرجة الثانية بالأغلبية السرية',
        },
      ]);
    } else if (type === 'contractual') {
      setCommissionName(
        'اللجنة التأديبية الاستشارية المتساوية الأعضاء للأعوان المتعاقدين (المنشور 06 المؤرخ في 31 جانفي 2009)'
      );
      setDecisions([
        {
          id: 'c-1',
          employeeName: 'مهدي شرايبي',
          ppr: 'CNT-8841',
          currentGrade: 'عون متعاقد بالتوقيت الكامل',
          subject: 'إبداء الرأي الاستشاري المسبق حول الملف التأديبي المعروض قبل فسخ العقد',
          committeeOpinion: 'رأي اللجنة: عدم الموافقة على فسخ العقد والاكتفاء بالتوقيف المؤقت 4 أيام',
        },
      ]);
    } else {
      setCommissionName(
        'اللجنة الإدارية المتساوية الأعضاء — المصادقة على جدول حركة التنقل السنوية وتشخيص الفائض (المنشور 576-96)'
      );
      setDecisions([
        {
          id: 'tr-1',
          employeeName: 'سليم بوزيان',
          ppr: '1884201',
          currentGrade: 'الصنف 15 — الدرجة 5',
          subject: 'المشاركة في حركة التنقل السنوية (الرغبة الأولى — مجموع النقاط: 54 ن)',
          committeeOpinion: 'تلبية الرغبة الأولى وفق ترتيب الاستحقاق',
        },
      ]);
    }
  };

  const handleAddDecisionRow = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmp.trim() || !newPpr.trim() || !newSubj.trim()) return;
    setDecisions((prev) => [
      ...prev,
      {
        id: `row-${Date.now()}`,
        employeeName: newEmp.trim(),
        ppr: newPpr.trim(),
        currentGrade: newGrade.trim() || 'الصنف 14 — الدرجة 5',
        subject: newSubj.trim(),
        committeeOpinion: newOpinion.trim(),
      },
    ]);
    setNewEmp('');
    setNewPpr('');
    setNewGrade('');
    setNewSubj('');
  };

  const handleRemoveRow = (id: string) => {
    setDecisions((prev) => prev.filter((r) => r.id !== id));
  };

  const handleExportWordDoc = () => {
    const htmlContent = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40' dir='rtl' lang='ar'>
      <head><meta charset='utf-8'><title>${sessionNumber}</title></head>
      <body style="font-family: 'Traditional Arabic', 'Amiri', serif; direction: rtl; text-align: right; padding: 20px;">
        <h3 style="text-align: center;">${ministryName}</h3>
        <h2 style="text-align: center; border-bottom: 2px solid #000; padding-bottom: 10px;">محضر اجتماع: ${commissionName}</h2>
        <p><strong>رقم المحضر:</strong> ${sessionNumber} | <strong>التاريخ:</strong> ${sessionDate}</p>
        <p><strong>رئيس الجلسة:</strong> ${presidentName}</p>
        <p><strong>ممثلو الإدارة الحاضرون:</strong> ${adminMembers}</p>
        <p><strong>ممثلو الموظفين المنتخبون الحاضرون:</strong> ${staffMembers}</p>
        <table border="1" cellspacing="0" cellpadding="8" style="width: 100%; border-collapse: collapse; margin-top: 15px;">
          <thead>
            <tr style="background-color: #f0f0f0;">
              <th>الموظف / الرقم</th>
              <th>الرتبة والدرجة</th>
              <th>موضوع المداولة</th>
              <th>رأي / قرار اللجنة</th>
            </tr>
          </thead>
          <tbody>
            ${decisions
              .map(
                (d) => `
              <tr>
                <td>${d.employeeName} (${d.ppr})</td>
                <td>${d.currentGrade}</td>
                <td>${d.subject}</td>
                <td><strong>${d.committeeOpinion}</strong></td>
              </tr>`
              )
              .join('')}
          </tbody>
        </table>
      </body>
      </html>
    `;
    const blob = new Blob(['\ufeff', htmlContent], {
      type: 'application/msword;charset=utf-8',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${sessionNumber.replace(/\//g, '-')}.doc`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Section 1: Legal Competencies Matrix */}
      <div className="rounded-2xl bg-[#081a12] border border-[#d4af37]/40 p-6 space-y-5 no-print">
        <div className="border-b border-[#d4af37]/20 pb-4">
          <div className="text-xs text-[#f5d77f] font-bold mb-1">
            المواد 64 و 68 من الأمر 06-03 · المرسوم التنفيذي 20-199 · المنشور 06/2009 للمتعاقدين
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            مهام اللجان المتساوية الأعضاء (الاستشارية والتقريرية) ومولد المحاضر الرسمية A4
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-[#05140d] border border-[#d4af37]/30 rounded-xl space-y-2">
            <div className="text-xs font-mono text-[#f5d77f] font-bold">01 · الترقية والتأهيل</div>
            <h3 className="text-sm font-black text-white">الترقية في الدرجات وقوائم التأهيل</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              دراسة جداول الترقية في الدرجات الـ 12 (المدة الدنيا 30 شهراً، المتوسطة 36 شهراً، القصوى 42 شهراً) والتسجيل في قوائم التأهيل للرتب الأعلى.
            </p>
          </div>

          <div className="p-4 bg-[#05140d] border border-[#d4af37]/30 rounded-xl space-y-2">
            <div className="text-xs font-mono text-[#f5d77f] font-bold">02 · الترسيم والتربص</div>
            <h3 className="text-sm font-black text-white">تثبيت المتربصين وتمديد التربص</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              تنعقد كلجنة ترسيم للنظر في تثبيت المتربصين، أو تمديد فترة التربص لسنة إضافية، أو التسريح لعدم الكفاءة (رأي مطابق ملزم).
            </p>
          </div>

          <div className="p-4 bg-[#05140d] border border-[#d4af37]/30 rounded-xl space-y-2">
            <div className="text-xs font-mono text-[#f5d77f] font-bold">03 · الحركة والفائض</div>
            <h3 className="text-sm font-black text-white">حركة التنقل السنوية والوضعيات</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              دراسة جداول حركة التنقل السنوية، تشخيص الموظفين الفائضين (المنشور 576-96)، تثمين الخبرة المهنية (85-58)، وطلبات الاستيداع والإلحاق.
            </p>
          </div>

          <div className="p-4 bg-[#05140d] border border-[#d4af37]/30 rounded-xl space-y-2">
            <div className="text-xs font-mono text-[#f5d77f] font-bold">04 · الاختصاص التأديبي</div>
            <h3 className="text-sm font-black text-white">المجلس التأديبي ولجنة المتعاقدين</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              الانعقاد كمجلس تأديبي بتصويت سري وأغلبية الأعضاء للعقوبات من الدرجتين 3 و 4، أو كلجنة تأديبية استشارية للمتعاقدين (منشور 06/2009).
            </p>
          </div>
        </div>
      </div>

      {/* Section 2: Interactive Official Minutes (PV) Builder & Printable A4 Document */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Configuration Panel (5 cols - hidden on print) */}
        <div className="lg:col-span-5 rounded-2xl bg-[#081a12] border border-[#d4af37]/40 p-5 space-y-4 no-print">
          <div className="border-b border-[#d4af37]/20 pb-3">
            <h3 className="text-base font-black text-white flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-[#d4af37]" />
              <span>محرر المحاضر الرسمية للجان (A4 / Word)</span>
            </h3>
            <p className="text-xs text-slate-300 mt-1">
              اختر نموذج المحضر، راجع تشكيلة الأعضاء الحاضرين، وأضف القرارات الفردية للطباعة الفورية أو التحميل بصيغة Word.
            </p>
          </div>

          {/* Template Selector */}
          <div>
            <label className="block text-xs font-bold text-[#f5d77f] mb-1.5">
              نوع الجلسة وجدول الأعمال:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[
                { id: 'promotion', label: 'محضر الترقية في الدرجات والتأهيل' },
                { id: 'tenure', label: 'محضر لجنة ترسيم المتربصين' },
                { id: 'transfer', label: 'محضر حركة التنقل والفائض (576-96)' },
                { id: 'disciplinary', label: 'محضر جلسة مجلس تأديبي' },
                { id: 'contractual', label: 'محضر لجنة المتعاقدين (06/2009)' },
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => handleTemplateSwitch(t.id as any)}
                  className={`p-2.5 text-xs font-bold rounded-xl border text-right transition-all cursor-pointer ${
                    templateType === t.id
                      ? 'border-2 border-[#d4af37] bg-[#103824] text-[#f5d77f] font-black'
                      : 'border-[#d4af37]/25 bg-[#05140d] hover:border-[#d4af37]/60 text-slate-300'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Metadata Inputs */}
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                القطاع الوزاري / مديرية التربية أو الإدارة
              </label>
              <input
                type="text"
                value={ministryName}
                onChange={(e) => setMinistryName(e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-[#05140d] border border-[#d4af37]/40 rounded-lg text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                تسمية اللجنة المختصة
              </label>
              <input
                type="text"
                value={commissionName}
                onChange={(e) => setCommissionName(e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-[#05140d] border border-[#d4af37]/40 rounded-lg text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  رقم المحضر المرجعي
                </label>
                <input
                  type="text"
                  value={sessionNumber}
                  onChange={(e) => setSessionNumber(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs font-mono bg-[#05140d] border border-[#d4af37]/40 rounded-lg text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  تاريخ انعقاد الجلسة
                </label>
                <input
                  type="date"
                  value={sessionDate}
                  onChange={(e) => setSessionDate(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs font-mono bg-[#05140d] border border-[#d4af37]/40 rounded-lg text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                ممثلو الإدارة الحاضرون (قاعدة التساوي)
              </label>
              <input
                type="text"
                value={adminMembers}
                onChange={(e) => setAdminMembers(e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-[#05140d] border border-[#d4af37]/40 rounded-lg text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                ممثلو الموظفين المنتخبون الحاضرون
              </label>
              <input
                type="text"
                value={staffMembers}
                onChange={(e) => setStaffMembers(e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-[#05140d] border border-[#d4af37]/40 rounded-lg text-white"
              />
            </div>
          </div>

          {/* Add Decision Form */}
          <form onSubmit={handleAddDecisionRow} className="border-t border-[#d4af37]/20 pt-4 space-y-2.5">
            <div className="text-xs font-black text-[#f5d77f]">
              إدراج ملف فردي / نقطة في جدول أعمال المحضر:
            </div>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                required
                placeholder="اسم الموظف / العون"
                value={newEmp}
                onChange={(e) => setNewEmp(e.target.value)}
                className="px-2.5 py-1.5 text-xs bg-[#05140d] border border-[#d4af37]/40 rounded-lg text-white"
              />
              <input
                type="text"
                required
                placeholder="الرقم الوظيفي"
                value={newPpr}
                onChange={(e) => setNewPpr(e.target.value)}
                className="px-2.5 py-1.5 text-xs font-mono bg-[#05140d] border border-[#d4af37]/40 rounded-lg text-white"
              />
            </div>
            <input
              type="text"
              placeholder="الرتبة والصنف والدرجة الحالية"
              value={newGrade}
              onChange={(e) => setNewGrade(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs bg-[#05140d] border border-[#d4af37]/40 rounded-lg text-white"
            />
            <input
              type="text"
              required
              placeholder="موضوع المداولة (ترقية، تأهيل، ترسيم، حركة، تأديب...)"
              value={newSubj}
              onChange={(e) => setNewSubj(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs bg-[#05140d] border border-[#d4af37]/40 rounded-lg text-white"
            />
            <input
              type="text"
              required
              placeholder="رأي / قرار اللجنة"
              value={newOpinion}
              onChange={(e) => setNewOpinion(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs bg-[#05140d] border border-[#d4af37]/40 rounded-lg text-white"
            />
            <button
              type="submit"
              className="w-full py-2 px-3 bg-gradient-to-r from-[#d4af37] to-[#b58922] text-[#071710] text-xs font-black rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>إدراج في المحضر الرسمي</span>
            </button>
          </form>
        </div>

        {/* Right Official Printable A4 PV Sheet (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Action Toolbar above A4 sheet */}
          <div className="rounded-xl bg-[#081a12] border border-[#d4af37]/40 p-4 flex flex-wrap items-center justify-between gap-3 no-print">
            <div className="flex items-center gap-2 text-xs text-[#f5d77f] font-bold">
              <FileCheck2 className="w-4 h-4 text-[#10b981]" />
              <span>معاينة المحضر الرسمي A4 الجاهز للطباعة والتحميل</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleExportWordDoc}
                className="px-3.5 py-2 text-xs font-bold text-[#f5d77f] bg-[#05140d] hover:bg-[#103824] border border-[#d4af37]/40 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>تحميل Word (.doc)</span>
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="px-4 py-2 text-xs font-black text-[#071710] bg-gradient-to-r from-[#d4af37] to-[#b58922] rounded-lg transition-all flex items-center gap-1.5 cursor-pointer shadow"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>طباعة المحضر (A4)</span>
              </button>
            </div>
          </div>

          {/* Crisp White A4 Printable Sheet */}
          <div className="bg-white text-black rounded-2xl border-2 border-[#d4af37] p-8 space-y-6 shadow-2xl font-['Amiri',serif]">
            <div className="text-center space-y-1.5 border-b-2 border-black pb-4">
              <div className="text-sm font-bold">{ministryName}</div>
              <h3 className="text-xl font-bold pt-1">محضر اجتماع: {commissionName}</h3>
              <div className="text-xs font-mono text-slate-700 pt-1">
                مرجع المحضر: {sessionNumber} · التاريخ: {sessionDate}
              </div>
            </div>

            <div className="space-y-2 text-sm leading-relaxed text-slate-900">
              <p>
                بناءً على النصوص التشريعية والتنظيمية السارية المفعول المتعلقة بالوظيفة العمومية واللجان الإدارية المتساوية الأعضاء ولجان الطعن ولجان الأعوان المتعاقدين؛
              </p>
              <p>
                انعقدت بتاريخ <strong className="font-mono">{sessionDate}</strong> بمقر الإدارة، وبناءً على استدعاء قانوني مرفق بجدول الأعمال، جلسة مداولات اللجنة برئاسة <strong>{presidentName}</strong>.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-slate-50 border border-slate-400 rounded text-sm">
              <div>
                <div className="font-bold text-black mb-1">ممثلو الإدارة الحاضرون:</div>
                <div className="text-slate-800">{adminMembers}</div>
              </div>
              <div>
                <div className="font-bold text-black mb-1">ممثلو الموظفين المنتخبون الحاضرون:</div>
                <div className="text-slate-800">{staffMembers}</div>
              </div>
              <div className="sm:col-span-2 border-t border-slate-300 pt-2 flex items-center gap-1.5 text-emerald-950 font-bold text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>
                  إشهاد قانوني: بعد التحقق من اكتمال النصاب القانوني (3/4 الأعضاء) وتوفر شرط التساوي الحسابي بين ممثلي الإدارة وممثلي الموظفين، أعلن الرئيس افتتاح الجلسة السرية.
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-sm font-bold text-black">
                جدول الملفات المعروضة وخلاصة آراء ومداولات اللجنة:
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-right border-collapse border border-black text-xs sm:text-sm">
                  <thead>
                    <tr className="bg-slate-100 border-b border-black text-black">
                      <th className="py-2 px-2.5 border-l border-black">الموظف / الرقم</th>
                      <th className="py-2 px-2.5 border-l border-black">الرتبة والدرجة</th>
                      <th className="py-2 px-2.5 border-l border-black">موضوع المداولة</th>
                      <th className="py-2 px-2.5 border-l border-black">رأي / قرار اللجنة</th>
                      <th className="py-2 px-2 no-print">حذف</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black text-black">
                    {decisions.map((row) => (
                      <tr key={row.id}>
                        <td className="py-2 px-2.5 border-l border-black font-bold">
                          {row.employeeName}
                          <div className="font-mono text-[11px] font-normal text-slate-700">
                            {row.ppr}
                          </div>
                        </td>
                        <td className="py-2 px-2.5 border-l border-black">{row.currentGrade}</td>
                        <td className="py-2 px-2.5 border-l border-black">{row.subject}</td>
                        <td className="py-2 px-2.5 border-l border-black font-bold">
                          {row.committeeOpinion}
                        </td>
                        <td className="py-2 px-2 text-center no-print">
                          <button
                            type="button"
                            onClick={() => handleRemoveRow(row.id)}
                            className="text-red-600 hover:text-red-800 cursor-pointer"
                            title="حذف السطر"
                          >
                            <Trash2 className="w-4 h-4 mx-auto" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="pt-6 border-t border-black grid grid-cols-3 gap-4 text-center text-xs text-black">
              <div className="p-3 border border-dashed border-slate-500 rounded space-y-6">
                <div className="font-bold">إمضاء رئيس اللجنة</div>
                <div className="text-[11px] text-slate-600">الختم والتوقيع</div>
              </div>
              <div className="p-3 border border-dashed border-slate-500 rounded space-y-6">
                <div className="font-bold">إمضاء ممثلي الإدارة</div>
                <div className="text-[11px] text-slate-600">الأعضاء الدائمون</div>
              </div>
              <div className="p-3 border border-dashed border-slate-500 rounded space-y-6">
                <div className="font-bold">إمضاء ممثلي الموظفين</div>
                <div className="text-[11px] text-slate-600">الأعضاء المنتخبون</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
