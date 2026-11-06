import React, { useState } from 'react';
import {
  COMMISSION_TYPES,
  CREATION_WORKFLOW_STEPS,
  CommissionType,
} from '../data/capData';
import { Building2, Users, Scale, CheckCircle2, FileText, Layers } from 'lucide-react';

export const CommissionsAndContractualsModule: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);

  // Interactive Creation & Parity Calculator state
  const [staffCount, setStaffCount] = useState<number>(380);
  const [selectedLevel, setSelectedLevel] = useState<
    | 'لجنة الموظفين المرسمين (ولائية / مديرية)'
    | 'لجنة الأعوان المتعاقدين (منشور 06/2009)'
    | 'لجنة الطعن الولائية / الوزارية (منشور 15/2004)'
    | 'لجنة الإدارة المركزية'
  >('لجنة الموظفين المرسمين (ولائية / مديرية)');
  const [cadreTitle, setCadreTitle] = useState<string>(
    'أسلاك التربية والتعليم والإدارة (الأطوار الثلاثة)'
  );

  const computeLegalSeats = (count: number, level: string) => {
    if (level === 'لجنة الأعوان المتعاقدين (منشور 06/2009)') {
      const titular = count <= 150 ? 2 : count <= 500 ? 3 : 4;
      const totalVoting = titular * 2;
      return {
        titularStaff: titular,
        substituteStaff: titular,
        titularAdmin: titular,
        substituteAdmin: titular,
        quorumFirstCall: Math.ceil((totalVoting * 3) / 4),
        quorumSecondCall: Math.ceil(totalVoting / 2),
        ruleNote: `طبقاً للمنشور رقم 06 المؤرخ في 31 جانفي 2009 والمرسوم الرئاسي 07-308: تعداد ${count} عون متعاقد يخول ${titular} أعضاء دائمين و ${titular} أعضاء إضافيين عن المتعاقدين ومثلهم عن الإدارة.`,
      };
    }
    let titular = 2;
    if (count < 20) {
      titular = 2;
    } else if (count >= 20 && count <= 150) {
      titular = 2;
    } else if (count >= 151 && count <= 500) {
      titular = 3;
    } else if (count >= 501 && count <= 1000) {
      titular = 4;
    } else {
      titular = 6;
    }
    const totalVotingMembers = titular * 2;
    const quorumFirstCall = Math.ceil((totalVotingMembers * 3) / 4);
    const quorumSecondCall = Math.ceil(totalVotingMembers / 2);
    return {
      titularStaff: titular,
      substituteStaff: titular,
      titularAdmin: titular,
      substituteAdmin: titular,
      quorumFirstCall,
      quorumSecondCall,
      ruleNote: `تعداد ${count} موظفاً يخول قانوناً ${titular} أعضاء دائمين و ${titular} أعضاء إضافيين للموظفين، ومثلهم للإدارة (${totalVotingMembers} أعضاء مصوتين في المجموع)، مع إشعار مفتشية الوظيفة العمومية وفق المنشور 18/2006.`,
    };
  };

  const calculatedParity = computeLegalSeats(staffCount, selectedLevel);

  const filteredCommissions: CommissionType[] =
    selectedCategory === 'all'
      ? COMMISSION_TYPES
      : COMMISSION_TYPES.filter((c) => c.category === selectedCategory);

  const activeStep = CREATION_WORKFLOW_STEPS[activeStepIndex];

  return (
    <div className="space-y-6">
      {/* Section 1: Header & Interactive Commission Creation Calculator */}
      <div className="rounded-2xl bg-[#081a12] border border-[#d4af37]/40 p-6 space-y-6">
        <div className="border-b border-[#d4af37]/20 pb-4 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="text-xs text-[#f5d77f] font-bold mb-1">
              الأمر 06-03 · المرسوم التنفيذي 20-199 · المنشور 06/2009 للمتعاقدين · المنشور 18/2006 لمراقبة التشكيلة
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              طريقة إنشاء اللجان، قاعدة التساوي، وأنواع اللجان (من ضمنها لجان المتعاقدين ولجان الطعن)
            </h2>
          </div>
        </div>

        {/* Parity & Creation Simulator */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          <div className="lg:col-span-5 bg-[#05140d] border border-[#d4af37]/30 rounded-xl p-5 space-y-4">
            <h3 className="text-sm sm:text-base font-black text-white flex items-center gap-2">
              <Building2 className="w-4 h-4 text-[#d4af37]" />
              <span>محاكي إعداد مقرر إنشاء لجنة واحتساب التمثيلية القانونية</span>
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              أدخل تعداد الموظفين أو الأعوان المتعاقدين ونوع اللجنة لمعاينة التشكيلة المتساوية والنصاب القانوني للمداولات الخاضع لرقابة مفتشية الوظيفة العمومية (المنشور 18/2006).
            </p>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  تسمية السلك / المجموعة أو الفئة المعنية باللجنة
                </label>
                <input
                  type="text"
                  value={cadreTitle}
                  onChange={(e) => setCadreTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-[#081a12] border border-[#d4af37]/40 rounded-lg text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    طبيعة ومستوى اللجنة
                  </label>
                  <select
                    value={selectedLevel}
                    onChange={(e) => setSelectedLevel(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs bg-[#081a12] border border-[#d4af37]/40 rounded-lg text-white"
                  >
                    <option value="لجنة الموظفين المرسمين (ولائية / مديرية)">
                      لجنة الموظفين المرسمين (ولائية / مديرية)
                    </option>
                    <option value="لجنة الأعوان المتعاقدين (منشور 06/2009)">
                      لجنة الأعوان المتعاقدين (منشور 06/2009)
                    </option>
                    <option value="لجنة الطعن الولائية / الوزارية (منشور 15/2004)">
                      لجنة الطعن الولائية / الوزارية (منشور 15/2004)
                    </option>
                    <option value="لجنة الإدارة المركزية">لجنة الإدارة المركزية</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    تعداد الموظفين / الأعوان المتعاقدين
                  </label>
                  <input
                    type="number"
                    min={5}
                    max={25000}
                    value={staffCount}
                    onChange={(e) => setStaffCount(Math.max(1, Number(e.target.value)))}
                    className="w-full px-3 py-2 text-xs font-mono bg-[#081a12] border border-[#d4af37]/40 rounded-lg text-white"
                  />
                </div>
              </div>
            </div>

            <div className="p-3 bg-[#081a12] border border-[#d4af37]/30 rounded-lg text-xs text-slate-200 leading-relaxed">
              <span className="font-bold text-[#f5d77f]">القاعدة القانونية المطبقة: </span>
              {calculatedParity.ruleNote}
            </div>
          </div>

          <div className="lg:col-span-7 bg-[#05140d] border border-[#d4af37]/30 rounded-xl p-5 flex flex-col justify-between space-y-4">
            <div className="flex items-center justify-between border-b border-[#d4af37]/20 pb-3">
              <div>
                <div className="text-xs text-[#f5d77f] font-bold">معاينة هيكلة مقرر الإنشاء والتشكيلة</div>
                <h4 className="text-sm sm:text-base font-black text-white mt-0.5">
                  {cadreTitle} — <span className="text-emerald-300">{selectedLevel}</span>
                </h4>
              </div>
              <span className="text-xs font-mono text-[#f5d77f] font-bold bg-[#081a12] px-2.5 py-1 rounded border border-[#d4af37]/30">
                التعداد: {staffCount}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 bg-[#081a12] border border-[#d4af37]/25 rounded-xl">
                <div className="text-[11px] text-slate-400">ممثلو الموظفين (منتخبون)</div>
                <div className="text-lg font-black text-white font-mono tabular-nums mt-1">
                  {calculatedParity.titularStaff} دائمون
                </div>
                <div className="text-xs text-[#f5d77f] font-mono mt-0.5">
                  + {calculatedParity.substituteStaff} إضافيون
                </div>
              </div>

              <div className="p-3.5 bg-[#081a12] border border-[#d4af37]/25 rounded-xl">
                <div className="text-[11px] text-slate-400">ممثلو الإدارة (معينون)</div>
                <div className="text-lg font-black text-white font-mono tabular-nums mt-1">
                  {calculatedParity.titularAdmin} دائمون
                </div>
                <div className="text-xs text-emerald-300 font-mono mt-0.5">
                  + {calculatedParity.substituteAdmin} إضافيون
                </div>
              </div>

              <div className="p-3.5 bg-[#081a12] border border-[#d4af37]/25 rounded-xl">
                <div className="text-[11px] text-slate-400">نصاب الجلسة الأولى (3/4)</div>
                <div className="text-lg font-black text-emerald-400 font-mono tabular-nums mt-1">
                  {calculatedParity.quorumFirstCall} أعضاء
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">إلزامي في التأديب</div>
              </div>

              <div className="p-3.5 bg-[#081a12] border border-[#d4af37]/25 rounded-xl">
                <div className="text-[11px] text-slate-400">نصاب الجلسة الثانية (1/2)</div>
                <div className="text-lg font-black text-[#f5d77f] font-mono tabular-nums mt-1">
                  {calculatedParity.quorumSecondCall} أعضاء
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">بعد استدعاء ثانٍ خلال 8 أيام</div>
              </div>
            </div>

            <div className="p-3.5 bg-[#081a12] border border-[#d4af37]/25 rounded-xl text-xs text-slate-300 space-y-1">
              <div className="font-bold text-[#f5d77f]">
                قاعدة التساوي الصارمة ومراقبة الشرعية (المنشور رقم 18 المؤرخ في 28 ماي 2006):
              </div>
              <p className="leading-relaxed">
                يجب أن تتوفر في جلسة المداولة قاعدة التساوي الحسابي بين ممثلي الإدارة وممثلي الموظفين (أو المتعاقدين). وفي حالة غياب عضو أو أكثر من أحد الطرفين دون تعويضه بعضو إضافي، يقلص عدد أعضاء الطرف الآخر بنفس النسبة قبل الشروع في التصويت.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Section 2: Interactive 5-Step Creation Workflow */}
      <div className="rounded-2xl bg-[#081a12] border border-[#d4af37]/40 p-6 space-y-5">
        <div className="border-b border-[#d4af37]/20 pb-4">
          <div className="text-xs text-[#f5d77f] font-bold mb-1">
            المسطرة القانونية والزمنية لإنشاء وتجديد اللجان
          </div>
          <h3 className="text-lg font-black text-white">
            المراحل الخمس لإنشاء وتجديد اللجان المتساوية الأعضاء والآجال القانونية الملزمة
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5">
          {CREATION_WORKFLOW_STEPS.map((step, idx) => (
            <button
              key={step.stepNumber}
              onClick={() => setActiveStepIndex(idx)}
              className={`p-3.5 rounded-xl border text-right transition-all cursor-pointer ${
                activeStepIndex === idx
                  ? 'bg-gradient-to-br from-[#13462c] via-[#0c2d1c] to-[#081b11] border-2 border-[#d4af37] text-white shadow-lg'
                  : 'border-[#d4af37]/25 bg-[#05140d] hover:border-[#d4af37]/60 text-slate-300'
              }`}
            >
              <div className="text-xs font-mono text-[#f5d77f] font-bold">
                المرحلة {step.stepNumber}
              </div>
              <div className="text-xs font-black mt-1 line-clamp-2">{step.title}</div>
            </button>
          ))}
        </div>

        <div className="p-5 bg-[#05140d] border border-[#d4af37]/30 rounded-xl grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 space-y-3">
            <div className="text-xs text-[#f5d77f] font-bold">
              المرحلة {activeStep.stepNumber} · {activeStep.legalReference}
            </div>
            <h4 className="text-base font-black text-white">{activeStep.title}</h4>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {activeStep.description}
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-slate-300">
              <span>
                <strong className="text-[#f5d77f]">الأجل القانوني:</strong> {activeStep.legalDeadline}
              </span>
              <span aria-hidden="true">·</span>
              <span>
                <strong className="text-emerald-300">السلطة المختصة:</strong> {activeStep.authority}
              </span>
            </div>
          </div>

          <div className="lg:col-span-5 bg-[#081a12] border border-[#d4af37]/30 rounded-xl p-4 space-y-2.5">
            <div className="text-xs font-black text-[#f5d77f] flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-[#d4af37]" />
              <span>الوثائق والمقررات الإدارية المطلوبة في هذه المرحلة:</span>
            </div>
            <ul className="space-y-2 text-xs text-slate-200">
              {activeStep.requiredDocuments.map((doc, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{doc}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Section 3: Types of Commissions Explorer */}
      <div className="rounded-2xl bg-[#081a12] border border-[#d4af37]/40 p-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-[#d4af37]/20 pb-4">
          <div>
            <div className="text-xs text-[#f5d77f] font-bold mb-1">
              التصنيف الشامل لهيئات المشاركة والطعن
            </div>
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-[#d4af37]" />
              <span>أنواع اللجان المتساوية الأعضاء، لجان المتعاقدين (منشور 06/2009)، ولجان الطعن</span>
            </h3>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-[#05140d] border border-[#d4af37]/30 rounded-xl">
            {[
              { id: 'all', label: 'جميع الأنواع' },
              { id: 'education_2026', label: 'لجان أسلاك التربية (الأطوار الـ 3)' },
              { id: 'contractual', label: 'لجان الأعوان المتعاقدين (منشور 06/2009)' },
              { id: 'appeals', label: 'لجان الطعن (منشور 15/2004)' },
              { id: 'central', label: 'اللجان المركزية والمحلية (03/2003)' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedCategory(tab.id)}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                  selectedCategory === tab.id
                    ? 'bg-gradient-to-r from-[#d4af37] to-[#b58922] text-[#071710] font-black shadow'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredCommissions.map((comm) => (
            <div
              key={comm.id}
              className="border border-[#d4af37]/30 rounded-2xl p-5 space-y-4 flex flex-col justify-between bg-[#05140d]"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono font-bold text-[#f5d77f] bg-[#081a12] px-2.5 py-0.5 rounded border border-[#d4af37]/30">
                    {comm.code}
                  </span>
                  <span className="text-emerald-300 font-semibold">
                    العهدة: {comm.mandateDuration}
                  </span>
                </div>

                <h4 className="text-base font-black text-white">{comm.title}</h4>

                <div className="text-xs text-slate-200 bg-[#081a12] p-3 rounded-xl border border-[#d4af37]/25">
                  <strong className="text-[#f5d77f]">السند القانوني والتنظيمي: </strong>
                  {comm.legalBasis}
                </div>

                <div className="text-xs text-slate-300 leading-relaxed">
                  <strong className="text-white">النطاق والفئات المشمولة: </strong>
                  {comm.scope}
                </div>

                <div className="space-y-1.5 pt-1">
                  <div className="text-xs font-black text-[#f5d77f]">أبرز الاختصاصات والمهام:</div>
                  <ul className="space-y-1.5 text-xs text-slate-200">
                    {comm.keyCompetencies.map((comp, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-[#d4af37] font-bold">·</span>
                        <span>{comp}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {comm.contractualSpecifics && (
                  <div className="mt-3 p-4 bg-[#081a12] border border-[#d4af37]/50 rounded-xl space-y-2">
                    <div className="text-xs font-black text-[#f5d77f] flex items-center gap-1.5">
                      <Scale className="w-4 h-4 text-[#d4af37]" />
                      <span>أحكام خاصة باللجنة التأديبية الاستشارية للأعوان المتعاقدين (المنشور 06/2009):</span>
                    </div>
                    <ul className="space-y-1.5 text-xs text-slate-300">
                      {comm.contractualSpecifics.map((spec, idx) => (
                        <li key={idx} className="leading-relaxed">
                          • {spec}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="border-t border-[#d4af37]/20 pt-3 flex items-center justify-between text-xs text-slate-400">
                <span>
                  التشكيلة النموذجية: {comm.titularSeats} دائمين + {comm.substituteSeats} إضافيين لكل طرف
                </span>
                <span className="text-emerald-300 font-bold">تمثيلية متساوية (50% / 50%)</span>
              </div>
            </div>
          ))}
        </div>

        {/* Comparative Table */}
        <div className="border-t border-[#d4af37]/20 pt-6">
          <h4 className="text-sm font-black text-[#f5d77f] mb-3 flex items-center gap-2">
            <Users className="w-4 h-4 text-[#d4af37]" />
            <span>
              مصفوفة المقارنة القانونية بين اللجان الثلاث (لجنة الموظفين المرسمين · لجنة المتعاقدين 06/2009 · لجنة الطعن 15/2004)
            </span>
          </h4>
          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse border border-[#d4af37]/30 text-xs">
              <thead>
                <tr className="bg-[#05140d] border-b border-[#d4af37]/30 text-[#f5d77f]">
                  <th className="py-3 px-3 font-bold">محور المقارنة</th>
                  <th className="py-3 px-3 font-bold">اللجنة المتساوية الأعضاء للموظفين</th>
                  <th className="py-3 px-3 font-bold">اللجنة الاستشارية للأعوان المتعاقدين</th>
                  <th className="py-3 px-3 font-bold">لجنة الطعن الولائية / الوزارية</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#d4af37]/15 text-slate-200 bg-[#05140d]/60">
                <tr>
                  <td className="py-3 px-3 font-bold text-white bg-[#05140d]">النص المرجعي في الحقيبة</td>
                  <td className="py-3 px-3">الأمر 06-03 والمرسوم التنفيذي 20-199 والمنشور 03/2003</td>
                  <td className="py-3 px-3 text-[#f5d77f] font-semibold">
                    المنشور رقم 06 المؤرخ في 31 جانفي 2009 والمرسوم 07-308
                  </td>
                  <td className="py-3 px-3 text-emerald-300 font-semibold">
                    رسالة المنشور رقم 15 (10 أوت 2004) والمنشور 18 (28 ماي 2006)
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-bold text-white bg-[#05140d]">مجال الاختصاص الرئيسي</td>
                  <td className="py-3 px-3">
                    الترسيم، الترقية في الدرجات، قوائم التأهيل، حركة النقل، والمجلس التأديبي
                  </td>
                  <td className="py-3 px-3">
                    إبداء الرأي المسبق الوجوبي قبل توقيع عقوبة فسخ العقد التأديبي (الدرجة 3)
                  </td>
                  <td className="py-3 px-3">
                    البت في الطعون ضد عقوبات الدرجتين 3 و 4 في أجل شهرين بقرارات ملزمة
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-bold text-white bg-[#05140d]">طريقة انتخاب الممثلين</td>
                  <td className="py-3 px-3">اقتراع سري مباشر على القوائم النقابية بالتمثيل النسبي</td>
                  <td className="py-3 px-3">اقتراع سري مباشر من بين الأعوان المتعاقدين قيد الخدمة</td>
                  <td className="py-3 px-3">ينتخبهم مندوبو الموظفين في اللجان المتساوية الأعضاء</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
