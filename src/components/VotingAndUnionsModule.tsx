import React, { useState, useMemo } from 'react';
import { UnionList } from '../data/capData';
import {
  Vote,
  ShieldCheck,
  Plus,
  CheckCircle2,
  AlertTriangle,
  Calculator,
  FileSignature,
  RefreshCw,
} from 'lucide-react';

interface VotingAndUnionsModuleProps {
  unionLists: UnionList[];
  setUnionLists: React.Dispatch<React.SetStateAction<UnionList[]>>;
}

export const VotingAndUnionsModule: React.FC<VotingAndUnionsModuleProps> = ({
  unionLists,
  setUnionLists,
}) => {
  const [contestedSeats, setContestedSeats] = useState<number>(4);
  const [registeredVoters] = useState<number>(1520);
  const [nullVotes] = useState<number>(24);

  // Electronic voting simulator state
  const [voterPpr, setVoterPpr] = useState<string>('');
  const [voterCin, setVoterCin] = useState<string>('');
  const [selectedUnionId, setSelectedUnionId] = useState<string>('');
  const [voteSuccessReceipt, setVoteSuccessReceipt] = useState<{
    receiptCode: string;
    timestamp: string;
    unionAcronym: string;
    maskedPpr: string;
  } | null>(null);
  const [voteError, setVoteError] = useState<string>('');

  // New Union List form state
  const [showAddUnionForm, setShowAddUnionForm] = useState<boolean>(false);
  const [newAcronym, setNewAcronym] = useState<string>('');
  const [newName, setNewName] = useState<string>('');
  const [newHead, setNewHead] = useState<string>('');
  const [newTitulars, setNewTitulars] = useState<string>('');
  const [newSubstitutes, setNewSubstitutes] = useState<string>('');
  const [newProgram, setNewProgram] = useState<string>('');

  const electionResults = useMemo(() => {
    const totalValidVotes = unionLists.reduce((acc, u) => acc + u.votes, 0);
    const totalCastVotes = totalValidVotes + nullVotes;
    const turnoutPercent =
      registeredVoters > 0 ? ((totalCastVotes / registeredVoters) * 100).toFixed(1) : '0.0';
    const thresholdVotes = totalValidVotes * 0.06;

    const listsWithEligibility = unionLists.map((u) => {
      const percentage = totalValidVotes > 0 ? (u.votes / totalValidVotes) * 100 : 0;
      const isEligible = percentage >= 6;
      return {
        ...u,
        percentage,
        isEligible,
      };
    });

    const eligibleVotesSum = listsWithEligibility
      .filter((u) => u.isEligible)
      .reduce((acc, u) => acc + u.votes, 0);

    const electoralQuotient =
      contestedSeats > 0 && eligibleVotesSum > 0 ? eligibleVotesSum / contestedSeats : 0;

    let assignedSeatsSum = 0;
    const step1Lists = listsWithEligibility.map((u) => {
      if (!u.isEligible || electoralQuotient <= 0) {
        return {
          ...u,
          quotientSeats: 0,
          remainderVotes: 0,
          remainderSeat: 0,
          totalSeats: 0,
        };
      }
      const quotientSeats = Math.floor(u.votes / electoralQuotient);
      const remainderVotes = u.votes - quotientSeats * electoralQuotient;
      assignedSeatsSum += quotientSeats;
      return {
        ...u,
        quotientSeats,
        remainderVotes,
        remainderSeat: 0,
        totalSeats: quotientSeats,
      };
    });

    const remainingSeatsToDistribute = Math.max(0, contestedSeats - assignedSeatsSum);
    const sortedByRemainder = [...step1Lists]
      .filter((u) => u.isEligible)
      .sort((a, b) => b.remainderVotes - a.remainderVotes);

    const remainderWinnerIds = new Set(
      sortedByRemainder.slice(0, remainingSeatsToDistribute).map((u) => u.id)
    );

    const finalLists = step1Lists.map((u) => {
      const extra = remainderWinnerIds.has(u.id) ? 1 : 0;
      const totalSeats = u.quotientSeats + extra;
      return {
        ...u,
        remainderSeat: extra,
        totalSeats,
        electedTitulars: u.titularCandidates.slice(0, totalSeats),
        electedSubstitutes: u.substituteCandidates.slice(0, totalSeats),
      };
    });

    return {
      totalValidVotes,
      totalCastVotes,
      turnoutPercent,
      thresholdVotes,
      electoralQuotient,
      lists: finalLists,
    };
  }, [unionLists, contestedSeats, registeredVoters, nullVotes]);

  const handleCastElectronicVote = (e: React.FormEvent) => {
    e.preventDefault();
    setVoteError('');
    if (!voterPpr.trim() || voterPpr.trim().length < 4) {
      setVoteError('يرجى إدخال الرقم الوظيفي / رقم التسجيل الصحيح للموظف الناخب.');
      return;
    }
    if (!voterCin.trim()) {
      setVoteError('يرجى إدخال رقم بطاقة التعريف الوطنية للتأكد من الهوية.');
      return;
    }
    if (!selectedUnionId) {
      setVoteError('يرجى اختيار القائمة النقابية المراد التصويت لفائدتها.');
      return;
    }

    const chosenUnion = unionLists.find((u) => u.id === selectedUnionId);
    if (!chosenUnion) return;

    setUnionLists((prev) =>
      prev.map((u) => (u.id === selectedUnionId ? { ...u, votes: u.votes + 1 } : u))
    );

    const randomHash = Math.random().toString(36).substring(2, 10).toUpperCase();
    setVoteSuccessReceipt({
      receiptCode: `SNTE-CAP-2026-${randomHash}`,
      timestamp: new Date().toLocaleTimeString('ar-DZ', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }),
      unionAcronym: chosenUnion.acronym,
      maskedPpr: `${voterPpr.slice(0, 2)}***${voterPpr.slice(-2)}`,
    });

    setVoterPpr('');
    setVoterCin('');
  };

  const handleAddUnionList = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAcronym.trim() || !newName.trim() || !newHead.trim()) return;

    const titularArr = newTitulars
      .split('،')
      .map((s) => s.trim())
      .filter(Boolean);
    const subArr = newSubstitutes
      .split('،')
      .map((s) => s.trim())
      .filter(Boolean);

    const newList: UnionList = {
      id: `union-${Date.now()}`,
      acronym: newAcronym.trim().toUpperCase(),
      name: newName.trim(),
      headOfList: newHead.trim(),
      cadre: 'أسلاك التربية والتعليم والإدارة (الأطوار الثلاثة)',
      titularCandidates:
        titularArr.length > 0
          ? titularArr
          : [newHead.trim(), 'مترشح دائم 2', 'مترشح دائم 3', 'مترشح دائم 4'],
      substituteCandidates:
        subArr.length > 0
          ? subArr
          : ['مترشح إضافي 1', 'مترشح إضافي 2', 'مترشح إضافي 3', 'مترشح إضافي 4'],
      votes: 85,
      programSummary:
        newProgram.trim() || 'برنامج نقابي للدفاع عن المكتسبات المهنية والاجتماعية للموظفين.',
    };

    setUnionLists((prev) => [...prev, newList]);
    setNewAcronym('');
    setNewName('');
    setNewHead('');
    setNewTitulars('');
    setNewSubstitutes('');
    setNewProgram('');
    setShowAddUnionForm(false);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-[#0d2e1f] via-[#092216] to-[#123b28] border border-[#d4af37]/50 p-6 shadow-2xl space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 border-b border-[#d4af37]/20 pb-4">
          <div>
            <div className="text-xs text-[#f5d77f] font-bold mb-1">
              المرسوم التنفيذي 20-199 · الأمر 06-03 (المادة 68) · الفرز بالتمثيل النسبي على أساس أكبر بقية
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              الترشح عن طريق قوائم النقابات، التصويت الإلكتروني الآمن، وتتبع نتائج الفرز الشفاف
            </h2>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setShowAddUnionForm(!showAddUnionForm)}
              className="px-4 py-2.5 text-xs font-black text-[#071710] bg-gradient-to-r from-[#d4af37] to-[#b58922] hover:brightness-110 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer shadow-lg"
            >
              <Plus className="w-4 h-4" />
              <span>إيداع قائمة ترشيح نقابية</span>
            </button>
          </div>
        </div>

        {/* Key Electoral Metrics Strip */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5">
          <div className="p-3.5 bg-[#05140d] rounded-xl border border-[#d4af37]/30">
            <div className="text-[11px] text-slate-400">الهيئة الناخبة المسجلة</div>
            <div className="text-xl font-black text-white font-mono tabular-nums mt-1">
              {registeredVoters.toLocaleString('en-US')}
            </div>
            <div className="text-[11px] text-emerald-300 mt-1">
              نسبة المشاركة: <span className="font-mono font-bold text-[#f5d77f]">{electionResults.turnoutPercent}%</span>
            </div>
          </div>

          <div className="p-3.5 bg-[#05140d] rounded-xl border border-[#d4af37]/30">
            <div className="text-[11px] text-slate-400">الأصوات الصحيحة المعبر عنها</div>
            <div className="text-xl font-black text-emerald-400 font-mono tabular-nums mt-1">
              {electionResults.totalValidVotes.toLocaleString('en-US')}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              الملغاة والبيضاء: <span className="font-mono text-white">{nullVotes}</span>
            </div>
          </div>

          <div className="p-3.5 bg-[#05140d] rounded-xl border border-[#d4af37]/30">
            <div className="text-[11px] text-slate-400">العتبة الانتخابية المرجعية (6%)</div>
            <div className="text-xl font-black text-[#f5d77f] font-mono tabular-nums mt-1">
              {Math.ceil(electionResults.thresholdVotes)} صوتاً
            </div>
            <div className="text-[11px] text-slate-400 mt-1">لتأهيل القوائم لتوزيع المقاعد</div>
          </div>

          <div className="p-3.5 bg-[#05140d] rounded-xl border border-[#d4af37]/30">
            <div className="text-[11px] text-slate-400">المعدل / القاسم الانتخابي</div>
            <div className="text-xl font-black text-white font-mono tabular-nums mt-1">
              {electionResults.electoralQuotient.toFixed(2)}
            </div>
            <div className="text-[11px] text-emerald-300 mt-1">الأصوات المؤهلة ÷ {contestedSeats} مقاعد</div>
          </div>

          <div className="p-3.5 bg-[#05140d] rounded-xl border border-[#d4af37]/30 col-span-2 lg:col-span-1">
            <label htmlFor="seats-select" className="block text-[11px] text-[#f5d77f] font-bold">
              عدد المقاعد المتنافس عليها:
            </label>
            <select
              id="seats-select"
              value={contestedSeats}
              onChange={(e) => setContestedSeats(Number(e.target.value))}
              className="mt-1.5 w-full bg-[#081a12] border border-[#d4af37]/50 rounded-lg px-2.5 py-1.5 text-xs font-mono font-bold text-white focus:outline-none"
            >
              <option value={2}>2 دائمون + 2 إضافيون (أقل من 150 موظف)</option>
              <option value={3}>3 دائمون + 3 إضافيون (150 إلى 500 موظف)</option>
              <option value={4}>4 دائمون + 4 إضافيون (501 إلى 1000 موظف)</option>
              <option value={6}>6 دائمون + 6 إضافيون (+1000 موظف)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Add Union List Form */}
      {showAddUnionForm && (
        <form
          onSubmit={handleAddUnionList}
          className="rounded-2xl bg-[#081a12] border-2 border-[#d4af37] p-6 space-y-4 shadow-xl"
        >
          <div className="flex items-center justify-between border-b border-[#d4af37]/20 pb-3">
            <div className="flex items-center gap-2">
              <FileSignature className="w-5 h-5 text-[#d4af37]" />
              <h3 className="text-base font-black text-white">
                إيداع قائمة ترشيح نقابية جديدة (مترشحون دائمون وإضافيون)
              </h3>
            </div>
            <span className="text-xs text-[#f5d77f]">يسلم وصل إيداع رسمي مختوم</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                رمز النقابة (Acronyme)
              </label>
              <input
                type="text"
                required
                placeholder="مثال: SNTE"
                value={newAcronym}
                onChange={(e) => setNewAcronym(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg bg-[#05140d] border border-[#d4af37]/40 text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                التسمية الكاملة للمنظمة النقابية
              </label>
              <input
                type="text"
                required
                placeholder="مثال: النقابة الوطنية لعمال التربية"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg bg-[#05140d] border border-[#d4af37]/40 text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                مفوض القائمة (رأس القائمة)
              </label>
              <input
                type="text"
                required
                placeholder="الاسم واللقب"
                value={newHead}
                onChange={(e) => setNewHead(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg bg-[#05140d] border border-[#d4af37]/40 text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                المترشحون الدائمون / الرسميون (افصل بينهم بفاصلة ،)
              </label>
              <input
                type="text"
                placeholder="الاسم الأول، الاسم الثاني، الاسم الثالث، الاسم الرابع"
                value={newTitulars}
                onChange={(e) => setNewTitulars(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg bg-[#05140d] border border-[#d4af37]/40 text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                المترشحون الإضافيون / النواب (افصل بينهم بفاصلة ،)
              </label>
              <input
                type="text"
                placeholder="الإضافي الأول، الإضافي الثاني، الإضافي الثالث، الإضافي الرابع"
                value={newSubstitutes}
                onChange={(e) => setNewSubstitutes(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg bg-[#05140d] border border-[#d4af37]/40 text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              ملخص البرنامج النقابي للقائمة
            </label>
            <input
              type="text"
              placeholder="أهم التزامات القائمة داخل اللجنة المتساوية الأعضاء..."
              value={newProgram}
              onChange={(e) => setNewProgram(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg bg-[#05140d] border border-[#d4af37]/40 text-white"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowAddUnionForm(false)}
              className="px-4 py-2 text-xs font-bold text-slate-300 bg-slate-800 rounded-lg cursor-pointer"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-black text-[#071710] bg-gradient-to-r from-[#d4af37] to-[#b58922] rounded-lg cursor-pointer"
            >
              اعتماد القائمة وتسليم وصل الإيداع
            </button>
          </div>
        </form>
      )}

      {/* Main Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Electronic Voting Simulator (4 cols) */}
        <div className="lg:col-span-4 rounded-2xl bg-[#081a12] border border-[#d4af37]/40 p-5 space-y-5">
          <div className="border-b border-[#d4af37]/20 pb-3.5">
            <div className="text-xs text-[#f5d77f] font-bold mb-1">
              نظام التصويت الإلكتروني المشفر
            </div>
            <h3 className="text-base font-black text-white flex items-center gap-2">
              <Vote className="w-5 h-5 text-[#d4af37]" />
              <span>مكتب الاقتراع الرقمي المباشر</span>
            </h3>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              يتحقق النظام آلياً من تسجيل الناخب في القائمة الانتخابية النهائية مع ضمان سرية الاقتراع وشفافية الفرز الفوري.
            </p>
          </div>

          <form onSubmit={handleCastElectronicVote} className="space-y-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                الرقم الوظيفي / رقم التسجيل للناخب
              </label>
              <input
                type="text"
                placeholder="مثال: 1584920"
                value={voterPpr}
                onChange={(e) => setVoterPpr(e.target.value)}
                className="w-full px-3 py-2 text-xs font-mono rounded-lg bg-[#05140d] border border-[#d4af37]/40 text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                رقم بطاقة التعريف الوطنية (NIN)
              </label>
              <input
                type="text"
                placeholder="مثال: 109928374"
                value={voterCin}
                onChange={(e) => setVoterCin(e.target.value)}
                className="w-full px-3 py-2 text-xs font-mono rounded-lg bg-[#05140d] border border-[#d4af37]/40 text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2">
                اختر القائمة النقابية:
              </label>
              <div className="space-y-2">
                {unionLists.map((u) => (
                  <label
                    key={u.id}
                    className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                      selectedUnionId === u.id
                        ? 'border-2 border-[#d4af37] bg-[#103824]'
                        : 'border-[#d4af37]/25 bg-[#05140d] hover:border-[#d4af37]/60'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="unionVote"
                        value={u.id}
                        checked={selectedUnionId === u.id}
                        onChange={() => setSelectedUnionId(u.id)}
                        className="accent-[#d4af37]"
                      />
                      <div>
                        <div className="text-xs font-black text-white">
                          <span className="text-[#f5d77f]">{u.acronym}</span> — {u.headOfList}
                        </div>
                        <div className="text-[11px] text-slate-300 truncate max-w-[210px]">
                          {u.name}
                        </div>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {voteError && (
              <div className="p-3 bg-[#8f1414]/40 border border-red-400/50 rounded-xl text-xs text-red-200 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-[#f5d77f]" />
                <span>{voteError}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-gradient-to-r from-[#d4af37] to-[#b58922] text-[#071710] text-xs font-black rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>تأكيد التصويت الإلكتروني المشفر</span>
            </button>
          </form>

          {voteSuccessReceipt && (
            <div className="p-4 bg-[#05140d] border border-emerald-500/50 rounded-xl space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-emerald-300 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  وصل التصويت المشفر
                </span>
                <span className="text-xs font-mono text-[#f5d77f]">{voteSuccessReceipt.timestamp}</span>
              </div>
              <div className="text-xs text-white font-mono">
                البصمة: {voteSuccessReceipt.receiptCode}
              </div>
              <div className="text-[11px] text-slate-300">
                الناخب: <span className="font-mono">{voteSuccessReceipt.maskedPpr}</span> · القائمة:{' '}
                <span className="font-bold text-[#f5d77f]">{voteSuccessReceipt.unionAcronym}</span>
              </div>
            </div>
          )}
        </div>

        {/* Live Tally & Seat Distribution Table (8 cols) */}
        <div className="lg:col-span-8 rounded-2xl bg-[#081a12] border border-[#d4af37]/40 p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-[#d4af37]/20 pb-4">
            <div>
              <div className="text-xs text-[#f5d77f] font-bold">
                تتبع فوري لنتائج الفرز الشفاف · التمثيل النسبي على أساس أكبر بقية
              </div>
              <h3 className="text-lg font-black text-white flex items-center gap-2 mt-0.5">
                <Calculator className="w-5 h-5 text-[#d4af37]" />
                <span>جدول الفرز الآلي وتوزيع المقاعد (الدائمون والإضافيون)</span>
              </h3>
            </div>
            <button
              onClick={() =>
                setUnionLists((prev) =>
                  prev.map((u, idx) => ({
                    ...u,
                    votes: [485, 342, 265, 174, 64][idx] ?? 95,
                  }))
                )
              }
              className="px-3 py-1.5 text-xs font-bold text-[#f5d77f] bg-[#05140d] hover:bg-[#103824] border border-[#d4af37]/40 rounded-lg transition-colors flex items-center gap-1.5 self-start sm:self-auto whitespace-nowrap shrink-0 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>إعادة ضبط المحاكاة</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse">
              <thead>
                <tr className="border-b border-[#d4af37]/30 text-xs text-[#f5d77f] bg-[#05140d]">
                  <th className="py-3 px-3 font-bold">القائمة النقابية / مفوض القائمة</th>
                  <th className="py-3 px-3 font-bold text-left">الأصوات</th>
                  <th className="py-3 px-3 font-bold text-left">النسبة %</th>
                  <th className="py-3 px-3 font-bold">التأهيل</th>
                  <th className="py-3 px-3 font-bold text-left">مقاعد المعامل</th>
                  <th className="py-3 px-3 font-bold text-left">البقية</th>
                  <th className="py-3 px-3 font-bold text-left">أكبر بقية</th>
                  <th className="py-3 px-3 font-bold text-left">المقاعد</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#d4af37]/15 text-xs sm:text-sm">
                {electionResults.lists.map((item) => (
                  <tr key={item.id} className="hover:bg-[#0b2318]/60 transition-colors">
                    <td className="py-3.5 px-3">
                      <div className="font-black text-white">
                        <span className="text-[#f5d77f]">{item.acronym}</span> —{' '}
                        <span className="font-bold text-slate-200">{item.headOfList}</span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{item.name}</div>
                    </td>
                    <td className="py-3.5 px-3 font-mono tabular-nums text-left font-bold text-white">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() =>
                            setUnionLists((prev) =>
                              prev.map((u) =>
                                u.id === item.id ? { ...u, votes: Math.max(0, u.votes - 10) } : u
                              )
                            )
                          }
                          className="w-5 h-5 rounded bg-[#05140d] border border-[#d4af37]/30 hover:bg-[#103824] text-[#f5d77f] text-xs flex items-center justify-center cursor-pointer"
                        >
                          -
                        </button>
                        <span>{item.votes}</span>
                        <button
                          type="button"
                          onClick={() =>
                            setUnionLists((prev) =>
                              prev.map((u) =>
                                u.id === item.id ? { ...u, votes: u.votes + 10 } : u
                              )
                            )
                          }
                          className="w-5 h-5 rounded bg-[#05140d] border border-[#d4af37]/30 hover:bg-[#103824] text-[#f5d77f] text-xs flex items-center justify-center cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td className="py-3.5 px-3 font-mono tabular-nums text-left text-emerald-300 font-bold">
                      {item.percentage.toFixed(2)}%
                    </td>
                    <td className="py-3.5 px-3 text-xs">
                      {item.isEligible ? (
                        <span className="text-emerald-400 font-bold">مؤهلة (≥6%)</span>
                      ) : (
                        <span className="text-rose-400 font-bold">دون العتبة (&lt;6%)</span>
                      )}
                    </td>
                    <td className="py-3.5 px-3 font-mono tabular-nums text-left text-slate-200">
                      {item.quotientSeats}
                    </td>
                    <td className="py-3.5 px-3 font-mono tabular-nums text-left text-slate-300">
                      {item.isEligible ? item.remainderVotes.toFixed(1) : '—'}
                    </td>
                    <td className="py-3.5 px-3 font-mono tabular-nums text-left font-bold text-[#f5d77f]">
                      {item.remainderSeat > 0 ? `+${item.remainderSeat}` : '0'}
                    </td>
                    <td className="py-3.5 px-3 font-mono tabular-nums text-left font-black text-emerald-400">
                      {item.totalSeats} مقاعد
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Elected Members Breakdown */}
          <div className="border-t border-[#d4af37]/20 pt-5">
            <h4 className="text-sm font-black text-[#f5d77f] mb-3">
              التشكيلة المنتخبة المعلنة بناءً على الفرز الفوري ({contestedSeats} أعضاء دائمين و {contestedSeats} أعضاء إضافيين):
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {electionResults.lists
                .filter((l) => l.totalSeats > 0)
                .map((l) => (
                  <div
                    key={l.id}
                    className="p-4 bg-[#05140d] border border-[#d4af37]/30 rounded-xl space-y-2"
                  >
                    <div className="flex items-center justify-between border-b border-[#d4af37]/20 pb-2">
                      <span className="text-xs font-black text-white">
                        <span className="text-[#f5d77f]">{l.acronym}</span> · {l.headOfList}
                      </span>
                      <span className="text-xs font-mono font-bold text-emerald-400">
                        {l.totalSeats} دائمون + {l.totalSeats} إضافيون
                      </span>
                    </div>
                    <div className="text-xs text-slate-200">
                      <span className="font-bold text-[#f5d77f]">الأعضاء الدائمون الفائزون: </span>
                      {l.electedTitulars.join(' · ')}
                    </div>
                    <div className="text-xs text-slate-400">
                      <span className="font-bold text-emerald-300">الأعضاء الإضافيون (النواب): </span>
                      {l.electedSubstitutes.join(' · ')}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
