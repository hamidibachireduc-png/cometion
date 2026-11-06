import React, { useState } from 'react';
import {
  SCOPE_CONFIGS,
  CommissionScopeKey,
  GOOGLE_DRIVE_BAG_URL,
  UnionList,
  DRIVE_BAG_DOCUMENTS,
  INITIAL_DISCIPLINARY_CASES,
  LEGAL_TEXTS_REPOSITORY,
} from '../data/capData';
import {
  Vote,
  Building2,
  ClipboardList,
  Gavel,
  BookOpen,
  FolderOpen,
  Scale,
  Calendar,
  ExternalLink,
  ThumbsUp,
  MessageSquarePlus,
  Award,
  CheckCircle2,
} from 'lucide-react';

interface DashboardOverviewModuleProps {
  activeScope: CommissionScopeKey;
  onSelectScope: (scope: CommissionScopeKey) => void;
  onNavigate: (module: any) => void;
  unionLists: UnionList[];
  institutionInfo: {
    directorateName: string;
    wilaya: string;
    coordinatorName: string;
    mandateTerm: string;
  };
  onOpenSettings: () => void;
}

export const DashboardOverviewModule: React.FC<DashboardOverviewModuleProps> = ({
  activeScope,
  onSelectScope,
  onNavigate,
  unionLists,
  institutionInfo,
  onOpenSettings,
}) => {
  const scopeConfig = SCOPE_CONFIGS[activeScope];
  const totalVotes = unionLists.reduce((acc, u) => acc + u.votes, 0);

  const [forumPosts, setForumPosts] = useState([
    {
      id: 'post-1',
      author: 'الأستاذ حميدي بشير (منسق اللجان المتساوية الأعضاء — SNTE)',
      institution: 'اللجنة الولائية والوطنية للمستخدمين',
      time: 'منذ ساعتين',
      tag: 'حقيبة اللجان المتساوية الأعضاء والوضعيات',
      title: 'توحيد آليات الرقابة النقابية على جداول الترقية في الدرجات (4 : 4 : 2) وقوائم التأهيل',
      body: 'زملائي أعضاء اللجان المتساوية الأعضاء، نضع بين أيديكم في حقيبة المنصة كافة المناشير التطبيقية والنماذج الرسمية للتحقق من نقاط الأقدمية وتثمين الخبرة المهنية (85-58) قبل التوقيع النهائي على محاضر الجلسات.',
      likes: 42,
    },
    {
      id: 'post-2',
      author: 'الأستاذ عبد الرزاق بوقرة (عضو لجنة متساوية الأعضاء)',
      institution: 'مديرية التربية — ولاية قسنطينة (25)',
      time: 'منذ 4 ساعات',
      tag: 'لجان الأعوان المتعاقدين (المنشور 06/2009)',
      title: 'تفعيل اللجنة التأديبية الاستشارية المتساوية الأعضاء الخاصة بالأعوان المتعاقدين',
      body: 'تطبيقا للمنشور رقم 06 المؤرخ في 31 جانفي 2009، نذكر بوجوب استدعاء اللجنة الاستشارية الخاصة بالمتعاقدين في أي ملف تأديبي قد يترتب عنه فسخ العقد، مع تمكين العون من الاطلاع على ملفه قبل 15 يوماً.',
      likes: 29,
    },
    {
      id: 'post-3',
      author: 'الأستاذ سليم بوزيان (عضو لجنة الطعن الولائية)',
      institution: 'مديرية التربية — ولاية سطيف (19)',
      time: 'منذ 6 ساعات',
      tag: 'لجنة الطعن (المنشور 15/2004 و 18/2006)',
      title: 'مراقبة احترام أجل الـ 45 يوماً للإخطار التأديبي وأجل الـ 15 يوماً لإيداع الطعون',
      body: 'كل متابعة تأديبية تباشر بعد فوات أجل 45 يوماً من معاينة الخطأ المهني تعد ساقطة بالتقادم طبقاً للمادة 166، وتلتزم لجنة الطعن بإلغاء القرارات المشوبة بعيب الإجراءات أو عدم تساوي الأعضاء.',
      likes: 35,
    },
  ]);

  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostBody, setNewPostBody] = useState('');

  const handleAddPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostTitle.trim() || !newPostBody.trim()) return;
    setForumPosts((prev) => [
      {
        id: `post-${Date.now()}`,
        author: `${institutionInfo.coordinatorName} (${institutionInfo.wilaya})`,
        institution: institutionInfo.directorateName,
        time: 'الآن',
        tag: `مداخلة نقابية (${scopeConfig.shortName})`,
        title: newPostTitle.trim(),
        body: newPostBody.trim(),
        likes: 1,
      },
      ...prev,
    ]);
    setNewPostTitle('');
    setNewPostBody('');
  };

  const featureCards = [
    {
      id: 'voting',
      title: 'الترشح النقابي والتصويت الإلكتروني',
      subtitle: 'إيداع قوائم النقابات، مكتب التصويت المشفر، والفرز الفوري بأكبر بقية',
      badge: 'التمثيل النسبي',
      primaryMetric: `${unionLists.length} قوائم · ${totalVotes} صوتاً`,
      secondaryMetric: 'حساب آلي للمعدل الانتخابي وأكبر بقية والعتبة 6%',
      icon: Vote,
    },
    {
      id: 'commissions',
      title: 'إنشاء اللجان وأنواعها (ولجان المتعاقدين)',
      subtitle: 'طريقة الإنشاء، قاعدة التساوي، لجان المتعاقدين (منشور 06/2009)، ولجان الطعن',
      badge: 'المرسوم 20-199',
      primaryMetric: '5 مراحل قانونية للإنشاء',
      secondaryMetric: 'مراقبة التشكيلة وفق المنشور 18 المؤرخ في 28 ماي 2006',
      icon: Building2,
    },
    {
      id: 'minutes',
      title: 'مهام اللجان ومولد المحاضر الرسمية A4',
      subtitle: 'محرر ذكي لمحاضر الترقية، الترسيم، الحركة، والتأديب مع الطباعة وتحميل Word',
      badge: 'نماذج رسمية A4',
      primaryMetric: '5 قوالب محاضر جاهزة',
      secondaryMetric: 'طباعة فورية A4 وتحميل بصيغة Word (.doc)',
      icon: ClipboardList,
    },
    {
      id: 'disciplinary',
      title: 'المجلس التأديبي ولجان الطعن والوضعيات',
      subtitle: 'فحص الضمانات التأديبية، التوقيف التحفظي، سلم العقوبات، وإخطار لجنة الطعن',
      badge: 'المنشور 15/2004',
      primaryMetric: `${INITIAL_DISCIPLINARY_CASES.length} ملفات رائجة`,
      secondaryMetric: 'حاسبة آجال التوقيف التحفظي والطعن ورد الاعتبار',
      icon: Gavel,
    },
    {
      id: 'bag',
      title: 'حقيبة اللجان والوضعيات ومحاكي الدرجات',
      subtitle: 'حقيبة الأستاذ حميدي بشير (Google Drive) ومحاكي الشبكة الاستدلالية 07-304 والتأهيل',
      badge: 'حقيبة Drive',
      primaryMetric: `${DRIVE_BAG_DOCUMENTS.length} مرجعاً وملفاً`,
      secondaryMetric: 'محاكاة الدرجات (1-12) وقوائم التأهيل وتثمين الخبرة 85-58',
      icon: FolderOpen,
    },
    {
      id: 'legislation',
      title: 'الركن التشريعي والنصوص المحينة',
      subtitle: 'الأمر 06-03، المرسوم 20-199، المرسوم 25-54، المرسوم 2.24.140، ومناشير الوظيفة العمومية',
      badge: 'تحيين 2026',
      primaryMetric: `${LEGAL_TEXTS_REPOSITORY.length} أبواب تشريعية`,
      secondaryMetric: 'مفهرسة بالمواد القانونية القابلة للنسخ المباشر',
      icon: BookOpen,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top 3 Scope Cards (Matching nathersnte2026 3-Stage Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        {(['statutory', 'contractual', 'appeals'] as CommissionScopeKey[]).map((key) => {
          const item = SCOPE_CONFIGS[key];
          const isActive = activeScope === key;
          return (
            <div
              key={key}
              onClick={() => onSelectScope(key)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-br from-[#13462c] via-[#0c2d1c] to-[#081b11] border-2 border-[#d4af37] shadow-xl'
                  : 'bg-[#081a12]/80 border-[#d4af37]/25 hover:border-[#d4af37]/60'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-black text-[#f5d77f] flex items-center gap-1.5">
                  <Scale className="w-3.5 h-3.5" />
                  <span>{item.shortName}</span>
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    isActive
                      ? 'bg-[#d4af37] text-[#071710] font-black'
                      : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  {isActive ? 'النظام النشط حالياً ✓' : 'انقر للتفعيل'}
                </span>
              </div>
              <h3 className="text-sm sm:text-base font-black text-white">{item.name}</h3>
              <p className="text-[11px] text-slate-300 mt-1 leading-relaxed line-clamp-2">
                {item.description}
              </p>
              <div className="mt-2.5 pt-2 border-t border-[#d4af37]/15 flex items-center justify-between text-[10px] text-emerald-300 font-semibold tabular-nums">
                <span>العهدة: {item.mandateYears} سنوات</span>
                <span>·</span>
                <span>النصاب: 3/4 الأعضاء</span>
                <span>·</span>
                <span>التساوي: 50% / 50%</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Hero Banner (Matching nathersnte2026 Hero) */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0d2e1f] via-[#092216] to-[#123b28] border border-[#d4af37]/50 p-6 shadow-2xl">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#8f1414] via-[#d4af37] to-[#10b981]" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div
              onClick={onOpenSettings}
              title="انقر لتعديل بيانات الهيئة والولاية"
              className="w-20 h-20 rounded-2xl bg-[#05140d] p-2 border-2 border-[#d4af37] shadow-xl flex flex-col items-center justify-center cursor-pointer group shrink-0"
            >
              <Scale className="w-9 h-9 text-[#d4af37] group-hover:scale-110 transition-transform" />
              <span className="text-[9px] font-black text-[#082014] bg-[#d4af37] px-1.5 rounded mt-1">
                CAP · SNTE
              </span>
            </div>

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="px-2.5 py-0.5 rounded font-bold bg-[#8f1414] text-white border border-[#f5d77f]/40">
                  {scopeConfig.shortName} · {scopeConfig.classificationCategory}
                </span>
                <span className="text-[#d4af37] font-semibold flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>
                    {new Date().toLocaleDateString('ar-DZ', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-white">
                منصة اللجان الإدارية المتساوية الأعضاء /{' '}
                <span className="gold-gradient-text">{institutionInfo.coordinatorName}</span>
              </h2>

              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                البوابة الرقمية المندمجة لـ{' '}
                <span className="text-white font-bold">
                  {institutionInfo.directorateName} ({institutionInfo.wilaya})
                </span>{' '}
                — مصممة لتدبير قوائم الترشح النقابي، التصويت الإلكتروني والفرز الشفاف، المجالس التأديبية ولجان الطعن، وحقيبة الوضعيات الخاصة بالموظف والمتعاقد.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={() => onNavigate('voting')}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#b58922] text-[#071710] font-black text-xs flex items-center gap-2 shadow-lg hover:brightness-110 transition-all cursor-pointer"
            >
              <Vote className="w-4 h-4" />
              <span>التصويت والفرز الفوري</span>
            </button>

            <button
              onClick={() => onNavigate('minutes')}
              className="px-4 py-2.5 rounded-xl bg-[#05140d] hover:bg-[#103824] text-[#f5d77f] border border-[#d4af37]/50 font-bold text-xs flex items-center gap-2 transition-all cursor-pointer"
            >
              <ClipboardList className="w-4 h-4" />
              <span>إصدار محضر رسمي A4</span>
            </button>

            <a
              href={GOOGLE_DRIVE_BAG_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-xl bg-[#8f1414] hover:bg-[#a61b1b] text-white border border-[#f5d77f]/40 font-bold text-xs flex items-center gap-2 transition-all shadow-md"
            >
              <FolderOpen className="w-4 h-4 text-[#f5d77f]" />
              <span>حقيبة اللجان (Google Drive)</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* Main Feature Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {featureCards.map((card) => {
          const IconComp = card.icon;
          return (
            <div
              key={card.id}
              onClick={() => onNavigate(card.id)}
              className="p-5 rounded-2xl bg-[#081a12] border border-[#d4af37]/30 hover:border-[#d4af37] transition-all cursor-pointer group flex flex-col justify-between space-y-4 shadow-lg"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#105e32] to-[#06150e] border border-[#d4af37]/40 flex items-center justify-center text-[#f5d77f] group-hover:scale-105 transition-transform">
                    <IconComp className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded bg-[#05140d] text-[#f5d77f] border border-[#d4af37]/30">
                    {card.badge}
                  </span>
                </div>

                <h3 className="text-base font-black text-white group-hover:text-[#f5d77f] transition-colors">
                  {card.title}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">{card.subtitle}</p>
              </div>

              <div className="pt-3 border-t border-[#d4af37]/15 flex items-center justify-between text-xs">
                <span className="font-bold text-emerald-300 font-mono">{card.primaryMetric}</span>
                <span className="text-[11px] text-[#f5d77f] font-bold group-hover:underline">
                  فتح الوحدة ←
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Access Strip to Google Drive Bag Files */}
      <div className="rounded-2xl bg-[#081a12] border border-[#d4af37]/40 p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#d4af37]/20 pb-3">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-[#d4af37]" />
            <h3 className="text-base sm:text-lg font-black text-white">
              أبرز ملفات حقيبة اللجان المتساوية الأعضاء والوضعيات الخاصة بالموظف (الأستاذ حميدي بشير)
            </h3>
          </div>
          <button
            onClick={() => onNavigate('bag')}
            className="text-xs text-[#e5c158] hover:underline cursor-pointer font-bold self-start sm:self-auto"
          >
            فتح الحقيبة الكاملة ومحاكي الدرجات ←
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {DRIVE_BAG_DOCUMENTS.slice(0, 8).map((doc) => (
            <div
              key={doc.id}
              onClick={() => onNavigate('bag')}
              className="p-3.5 rounded-xl bg-[#05140d] border border-[#d4af37]/25 hover:border-[#d4af37] cursor-pointer transition-all space-y-1.5"
            >
              <div className="text-[10px] font-bold text-[#f5d77f]">{doc.referenceCode}</div>
              <div className="text-xs font-black text-white line-clamp-2">{doc.title}</div>
              <div className="text-[11px] text-emerald-300 flex items-center gap-1 pt-1">
                <CheckCircle2 className="w-3 h-3 shrink-0" />
                <span className="truncate">{doc.category}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Syndical & Professional Coordination Space (Matching nathersnte2026 Forum) */}
      <div className="rounded-2xl bg-[#081a12] border border-[#d4af37]/40 p-6 space-y-5">
        <div className="border-b border-[#d4af37]/20 pb-4">
          <span className="px-2.5 py-0.5 rounded bg-[#8f1414] text-white text-xs font-bold">
            شبكة التنسيق المهني والنقابي لأعضاء اللجان المتساوية الأعضاء — SNTE 2026
          </span>
          <h3 className="text-lg sm:text-xl font-black text-white mt-2">
            فضاء التنسيق وتبادل الخبرات القانونية والنقابية (الترقية · الحركة · التأديب · لجان الطعن)
          </h3>
          <p className="text-xs text-slate-300 mt-1">
            منبر تفاعلي لتقاسم التجارب الميدانية حول مراقبة جداول الترقية وقوائم التأهيل، حساب نقاط الفائض والحركة التنقلية، والدفاع عن الموظفين والمتعاقدين في المجالس التأديبية.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5">
            <form
              onSubmit={handleAddPost}
              className="rounded-2xl bg-[#05140d] border border-[#d4af37]/40 p-5 space-y-3.5"
            >
              <h4 className="text-sm font-black text-white flex items-center gap-2">
                <MessageSquarePlus className="w-4 h-4 text-[#d4af37]" />
                <span>طرح استشارة قانونية أو مبادرة نقابية لأعضاء اللجان</span>
              </h4>
              <div>
                <label className="block text-xs text-slate-300 font-bold mb-1">
                  عنوان الموضوع أو الإشكال القانوني
                </label>
                <input
                  type="text"
                  required
                  value={newPostTitle}
                  onChange={(e) => setNewPostTitle(e.target.value)}
                  placeholder="مثال: كيفية الطعن في جدول الحركة أو تطبيق المنشور 06/2009..."
                  className="w-full px-3 py-2 rounded-lg bg-[#081a12] border border-[#d4af37]/40 text-white text-xs"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-300 font-bold mb-1">
                  تفاصيل الاستشارة أو التوجيه النقابي
                </label>
                <textarea
                  rows={4}
                  required
                  value={newPostBody}
                  onChange={(e) => setNewPostBody(e.target.value)}
                  placeholder="اشرح الموضوع أو السند القانوني المعتمد..."
                  className="w-full px-3 py-2 rounded-lg bg-[#081a12] border border-[#d4af37]/40 text-white text-xs"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#b58922] text-[#071710] font-black text-xs cursor-pointer"
              >
                نشر المداخلة في فضاء اللجان المتساوية الأعضاء
              </button>
            </form>
          </div>

          <div className="lg:col-span-7 space-y-3.5">
            {forumPosts.map((post) => (
              <div
                key={post.id}
                className="p-5 rounded-2xl bg-[#05140d] border border-[#d4af37]/30 space-y-2"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#f5d77f]">{post.author}</span>
                  <span className="text-slate-400">{post.time}</span>
                </div>
                <div className="text-[11px] text-emerald-300 font-semibold">
                  {post.institution} · {post.tag}
                </div>
                <h4 className="text-sm sm:text-base font-black text-white">{post.title}</h4>
                <p className="text-xs text-slate-300 leading-relaxed">{post.body}</p>
                <div className="pt-2 flex items-center justify-end">
                  <button
                    onClick={() =>
                      setForumPosts((prev) =>
                        prev.map((p) => (p.id === post.id ? { ...p, likes: p.likes + 1 } : p))
                      )
                    }
                    className="px-3 py-1 rounded-lg bg-[#06150e] hover:bg-[#103824] text-[#f5d77f] border border-[#d4af37]/30 text-xs font-bold flex items-center gap-1.5 cursor-pointer tabular-nums"
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>تأييد ({post.likes})</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
