import React, { useState } from 'react';
import { LEGAL_TEXTS_REPOSITORY, LegalTextItem } from '../data/capData';
import { BookOpen, Search, Scale, CheckCircle2, Copy, Check } from 'lucide-react';

export const LegislationModule: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedLawId, setSelectedLawId] = useState<string>(LEGAL_TEXTS_REPOSITORY[0].id);
  const [copiedArticle, setCopiedArticle] = useState<string | null>(null);

  const filteredLaws: LegalTextItem[] = LEGAL_TEXTS_REPOSITORY.filter((law) => {
    const matchesType = selectedType === 'all' || law.type === selectedType;
    const matchesQuery =
      !searchQuery.trim() ||
      law.title.includes(searchQuery) ||
      law.number.includes(searchQuery) ||
      law.summary.includes(searchQuery) ||
      law.keyArticles.some(
        (a) => a.articleNumber.includes(searchQuery) || a.content.includes(searchQuery)
      );
    return matchesType && matchesQuery;
  });

  const activeLaw =
    filteredLaws.find((l) => l.id === selectedLawId) ||
    filteredLaws[0] ||
    LEGAL_TEXTS_REPOSITORY[0];

  const handleCopyArticle = (artNum: string, content: string) => {
    navigator.clipboard.writeText(`${artNum} (${activeLaw.number}):\n${content}`);
    setCopiedArticle(artNum);
    setTimeout(() => setCopiedArticle(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header & Search Bar */}
      <div className="rounded-2xl bg-[#081a12] border border-[#d4af37]/40 p-6 space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 border-b border-[#d4af37]/20 pb-4">
          <div>
            <div className="text-xs text-[#f5d77f] font-bold mb-1">
              الترسانة التشريعية والتنظيمية المحينة · مفهرسة بالمواد القانونية القابلة للنسخ الفوري
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              الركن التشريعي للجان المتساوية الأعضاء، لجان المتعاقدين، ولجان الطعن
            </h2>
          </div>
        </div>

        {/* Search & Filter Row */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#d4af37] absolute right-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث برقم المرسوم، المنشور، أو الكلمات المفتاحية (مثال: 20-199، منشور 06/2009، لجنة الطعن، 45 يوماً)..."
              className="w-full pr-10 pl-4 py-2 text-xs sm:text-sm bg-[#05140d] border border-[#d4af37]/40 rounded-xl text-white focus:outline-none focus:border-[#f5d77f]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-[#05140d] border border-[#d4af37]/30 rounded-xl">
            {[
              { id: 'all', label: 'جميع النصوص' },
              { id: 'أمر / قانون أساسي', label: 'القانون الأساسي' },
              { id: 'مرسوم تنفيذي / تنظيمي', label: 'المراسيم التنظيمية' },
              { id: 'منشور المديرية العامة للوظيفة العمومية', label: 'مناشير الوظيفة العمومية' },
              { id: 'اجتهاد قضائي إداري', label: 'الاجتهاد القضائي' },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setSelectedType(t.id)}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                  selectedType === t.id
                    ? 'bg-gradient-to-r from-[#d4af37] to-[#b58922] text-[#071710] font-black shadow'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-5 space-y-3">
          {filteredLaws.length === 0 ? (
            <div className="rounded-2xl bg-[#081a12] border border-[#d4af37]/40 p-6 text-center space-y-2">
              <div className="text-sm font-black text-white">لا توجد نصوص مطابقة لعبارة البحث</div>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedType('all');
                }}
                className="mt-2 px-3 py-1.5 text-xs font-black text-[#071710] bg-gradient-to-r from-[#d4af37] to-[#b58922] rounded-lg cursor-pointer"
              >
                إظهار كافة النصوص القانونية
              </button>
            </div>
          ) : (
            filteredLaws.map((law) => (
              <button
                key={law.id}
                onClick={() => setSelectedLawId(law.id)}
                className={`w-full text-right p-5 rounded-2xl border transition-all cursor-pointer ${
                  activeLaw.id === law.id
                    ? 'bg-gradient-to-br from-[#13462c] via-[#0c2d1c] to-[#081b11] border-2 border-[#d4af37] shadow-xl'
                    : 'border-[#d4af37]/25 bg-[#081a12] hover:border-[#d4af37]/60'
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-[#f5d77f] font-bold">
                    {law.type} · <strong className="font-mono text-white">{law.number}</strong>
                  </span>
                  {law.isUpdated2026 && (
                    <span className="bg-[#8f1414] text-white px-2 py-0.5 rounded text-[10px] font-bold border border-[#f5d77f]/30">
                      تحيين 2026
                    </span>
                  )}
                </div>
                <h3 className="text-sm font-black text-white leading-snug">{law.title}</h3>
                <p className="text-xs text-slate-300 mt-1.5 line-clamp-2 leading-relaxed">
                  {law.summary}
                </p>
                <div className="text-[11px] text-emerald-300 mt-2 pt-2 border-t border-[#d4af37]/20">
                  التاريخ: {law.date} · المواد المرجعية: {law.keyArticles.length}
                </div>
              </button>
            ))
          )}
        </div>

        {/* Right: Detailed Legal Articles Reader */}
        <div className="lg:col-span-7 rounded-2xl bg-[#081a12] border border-[#d4af37]/40 p-6 space-y-6">
          <div className="border-b border-[#d4af37]/20 pb-4 space-y-2">
            <div className="flex items-center justify-between text-xs text-[#f5d77f] font-bold">
              <span className="flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-[#d4af37]" />
                {activeLaw.type} — {activeLaw.number}
              </span>
              <span className="text-emerald-300">{activeLaw.date}</span>
            </div>
            <h3 className="text-lg font-black text-white">{activeLaw.title}</h3>
            <p className="text-xs text-slate-300 leading-relaxed">{activeLaw.summary}</p>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-black text-[#f5d77f] flex items-center gap-2">
              <Scale className="w-4 h-4 text-[#d4af37]" />
              <span>المواد القانونية والمناشير المفسرة (قابلة للنسخ المباشر في المحاضر والطعون):</span>
            </h4>

            <div className="space-y-3">
              {activeLaw.keyArticles.map((art, idx) => (
                <div
                  key={idx}
                  className="p-4 bg-[#05140d] border border-[#d4af37]/30 rounded-xl space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-[#f5d77f]">{art.articleNumber}</span>
                    <button
                      onClick={() => handleCopyArticle(art.articleNumber, art.content)}
                      className="px-2.5 py-1 rounded bg-[#081a12] hover:bg-[#103824] text-[#f5d77f] border border-[#d4af37]/30 text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                    >
                      {copiedArticle === art.articleNumber ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span>تم النسخ</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>نسخ المادة</span>
                        </>
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed">{art.content}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 bg-[#05140d] border border-emerald-500/40 rounded-xl space-y-2 text-xs text-slate-200">
            <div className="font-black text-emerald-300 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>أبرز التحديثات القانونية المدمجة في المنصة:</span>
            </div>
            <ul className="space-y-1.5 leading-relaxed">
              <li>
                1. <strong className="text-[#f5d77f]">المرسوم التنفيذي 20-199:</strong> التنظيم الكامل لقواعد إنشاء وتشكيل وسير اللجان الإدارية المتساوية الأعضاء ولجان الطعن واللجان التقنية.
              </li>
              <li>
                2. <strong className="text-[#f5d77f]">المنشور 06 المؤرخ في 31 جانفي 2009:</strong> إلزامية استشارة اللجنة التأديبية الاستشارية المتساوية الأعضاء للأعوان المتعاقدين قبل أي قرار بفسخ العقد.
              </li>
              <li>
                3. <strong className="text-[#f5d77f]">المرسوم التنفيذي 25-54 والمرسوم 2.24.140:</strong> تحيين تصنيف رتب موظفي التربية الوطنية وتوحيد الضمانات المهنية والتأديبية ومقاييس الترقية والتأهيل.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
