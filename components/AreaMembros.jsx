"use client";

import React, { useState, useMemo } from "react";
import {
  Search, Clock, ChevronRight, ChevronLeft, ArrowLeft, Download, Sparkles,
  Filter, X, Check, Eye, Target, Baby, Compass, Dices, Grid3x3, Route, Disc,
  Rows3, Spade, LayoutGrid, Layers, Hammer, CircleDot,
} from "lucide-react";
import GAMES from "../data/jogos.json";
import { DEMANDAS, OBJETIVOS, MOMENTOS, PERFIS, FORMATOS } from "../data/taxonomia";
import { recomendar } from "../lib/recomendar";

// Em produção: troque o import estático por um fetch da tabela `jogos` do Supabase.
// Cada objeto tem a MESMA forma de uma linha da tabela (ver supabase/schema.sql).

const C = {
  ink: "#16302B", primary: "#2A6F6B", primarySoft: "#E7F0EE",
  accent: "#E0864A", accentSoft: "#FBEEE1",
  paper: "#FBFAF7", card: "#FFFFFF", line: "#EBE7E0", text: "#26302E", muted: "#6E7671",
};
const ICONES = { tabuleiro: LayoutGrid, cartas: Spade, memoria: Grid3x3, domino: Rows3, dados: Dices, bingo: LayoutGrid, trilha: Route, roleta: Disc };

function Chip({ children, bg, fg, onClick, active, small }) {
  return (
    <span onClick={onClick}
      style={{ backgroundColor: active ? C.primary : bg || C.primarySoft, color: active ? "#fff" : fg || C.primary, cursor: onClick ? "pointer" : "default", fontSize: small ? 11 : 12.5 }}
      className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 font-medium whitespace-nowrap transition-colors">{children}</span>
  );
}
function Meta({ Icon, children }) {
  return <span className="inline-flex items-center gap-1.5 text-sm" style={{ color: C.muted }}><Icon size={15} strokeWidth={2} /> {children}</span>;
}
function Capa({ jogo, big }) {
  const cor = DEMANDAS[jogo.demanda].cor; const F = ICONES[jogo.formato];
  if (jogo.imagem) return <img src={jogo.imagem} alt={jogo.nome} className="w-full h-full object-cover" />;
  return <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: cor + "12" }}><F size={big ? 44 : 30} strokeWidth={1.4} style={{ color: cor }} /></div>;
}
function StatusTag({ status }) {
  if (status === "pronto") return null;
  return <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium" style={{ backgroundColor: "#F3EFE8", color: C.muted }}><Hammer size={11} /> Em produção</span>;
}
function GameCard({ jogo, onOpen }) {
  const F = ICONES[jogo.formato]; const dem = DEMANDAS[jogo.demanda];
  return (
    <button onClick={() => onOpen(jogo)} className="group text-left rounded-2xl overflow-hidden flex flex-col transition-all hover:-translate-y-0.5"
      style={{ backgroundColor: C.card, border: `1px solid ${C.line}`, boxShadow: "0 1px 2px rgba(20,48,43,.04)" }}>
      <div className="h-28 relative"><Capa jogo={jogo} />
        <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium" style={{ backgroundColor: "#fff", color: dem.cor, border: `1px solid ${dem.cor}22` }}><F size={13} /> {FORMATOS[jogo.formato]}</span>
      </div>
      <div className="p-5 flex flex-col gap-3 flex-1">
        <h3 className="text-base font-semibold leading-snug" style={{ color: C.ink }}>{jogo.nome}</h3>
        <div className="flex flex-wrap gap-1.5"><Chip bg={dem.bg} fg={dem.fg} small>{dem.label}</Chip><StatusTag status={jogo.status} /></div>
        <div className="flex items-center gap-4 mt-auto pt-1"><Meta Icon={Baby}>{jogo.idadeMin}–{jogo.idadeMax}</Meta><Meta Icon={Clock}>{jogo.duracao} min</Meta></div>
      </div>
    </button>
  );
}
function FilterGroup({ title, children }) {
  return (<div><p className="text-xs font-semibold uppercase tracking-wide mb-2.5" style={{ color: C.muted }}>{title}</p><div className="flex flex-wrap gap-1.5">{children}</div></div>);
}
function Biblioteca({ onOpen }) {
  const [busca, setBusca] = useState(""); const [fDem, setFDem] = useState([]); const [fObj, setFObj] = useState([]);
  const [fMom, setFMom] = useState([]); const [fForm, setFForm] = useState([]); const [maxDur, setMaxDur] = useState(0);
  const toggle = (a, s, v) => s(a.includes(v) ? a.filter((x) => x !== v) : [...a, v]);
  const res = useMemo(() => GAMES.filter((j) => {
    if (busca && !`${j.nome} ${j.descricao}`.toLowerCase().includes(busca.toLowerCase())) return false;
    if (fDem.length && !fDem.includes(j.demanda)) return false;
    if (fObj.length && !fObj.some((o) => j.objetivos.includes(o))) return false;
    if (fMom.length && !fMom.some((m) => j.momentos.includes(m))) return false;
    if (fForm.length && !fForm.includes(j.formato)) return false;
    if (maxDur && j.duracao > maxDur) return false;
    return true;
  }), [busca, fDem, fObj, fMom, fForm, maxDur]);
  const n = fDem.length + fObj.length + fMom.length + fForm.length + (maxDur ? 1 : 0);
  const limpar = () => { setFDem([]); setFObj([]); setFMom([]); setFForm([]); setMaxDur(0); };
  return (
    <div className="flex flex-col lg:flex-row gap-8">
      <aside className="lg:w-64 shrink-0 flex flex-col gap-6">
        <div className="flex items-center justify-between"><span className="inline-flex items-center gap-2 font-semibold" style={{ color: C.ink }}><Filter size={16} /> Filtros</span>{n > 0 && <button onClick={limpar} className="text-xs font-medium" style={{ color: C.accent }}>Limpar ({n})</button>}</div>
        <FilterGroup title="Demanda">{Object.entries(DEMANDAS).map(([id, d]) => <Chip key={id} bg={d.bg} fg={d.fg} active={fDem.includes(id)} onClick={() => toggle(fDem, setFDem, id)}>{d.label}</Chip>)}</FilterGroup>
        <FilterGroup title="Objetivo">{Object.entries(OBJETIVOS).map(([id, l]) => <Chip key={id} active={fObj.includes(id)} onClick={() => toggle(fObj, setFObj, id)}>{l}</Chip>)}</FilterGroup>
        <FilterGroup title="Momento">{Object.entries(MOMENTOS).map(([id, l]) => <Chip key={id} active={fMom.includes(id)} onClick={() => toggle(fMom, setFMom, id)}>{l}</Chip>)}</FilterGroup>
        <FilterGroup title="Formato">{Object.entries(FORMATOS).map(([id, l]) => <Chip key={id} active={fForm.includes(id)} onClick={() => toggle(fForm, setFForm, id)}>{l}</Chip>)}</FilterGroup>
        <FilterGroup title="Tempo máximo">{[10, 15, 20, 30].map((t) => <Chip key={t} active={maxDur === t} onClick={() => setMaxDur(maxDur === t ? 0 : t)}>até {t} min</Chip>)}</FilterGroup>
      </aside>
      <div className="flex-1">
        <div className="relative mb-6"><Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: C.muted }} /><input value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Buscar jogo por nome ou objetivo…" className="w-full rounded-xl py-3 pl-11 pr-4 text-sm outline-none" style={{ backgroundColor: "#fff", border: `1px solid ${C.line}`, color: C.text }} /></div>
        <p className="text-sm mb-4" style={{ color: C.muted }}>{res.length} {res.length === 1 ? "jogo" : "jogos"}</p>
        {res.length === 0 ? <div className="rounded-2xl p-10 text-center" style={{ border: `1px dashed ${C.line}`, color: C.muted }}>Nenhum jogo com esses filtros.</div>
          : <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">{res.map((j) => <GameCard key={j.id} jogo={j} onOpen={onOpen} />)}</div>}
      </div>
    </div>
  );
}
function JogoCerto({ onOpen }) {
  const [step, setStep] = useState(0);
  const [f, setF] = useState({ idade: null, objetivo: null, perfil: null, momento: null, tempo: null });
  const set = (k, v) => setF((s) => ({ ...s, [k]: v }));
  const steps = [
    { k: "idade", titulo: "Que idade tem a criança?", opts: [[6, "6 anos"], [7, "7 anos"], [8, "8 anos"], [9, "9 anos"], [10, "10 anos"]] },
    { k: "objetivo", titulo: "O que você quer trabalhar?", opts: Object.entries(OBJETIVOS) },
    { k: "perfil", titulo: "Como a criança está participando hoje?", opts: [...Object.entries(PERFIS), ["", "Tanto faz / não sei"]] },
    { k: "momento", titulo: "Em que momento da sessão você está?", opts: [...Object.entries(MOMENTOS), ["", "Qualquer momento"]] },
    { k: "tempo", titulo: "Quanto tempo quer dedicar?", opts: [[10, "10 min"], [15, "15 min"], [20, "20 min"], [30, "30 min"]] },
  ];
  const res = useMemo(() => (step >= steps.length ? recomendar(GAMES, f) : []), [step, f]);
  if (step >= steps.length) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="rounded-2xl p-5 mb-6 flex flex-wrap items-center gap-2" style={{ backgroundColor: C.accentSoft }}>
          <span className="text-sm font-medium" style={{ color: C.ink }}>Sessão:</span>
          {f.idade && <Chip>{f.idade} anos</Chip>}{f.objetivo && <Chip>{OBJETIVOS[f.objetivo]}</Chip>}{f.perfil && <Chip>{PERFIS[f.perfil]}</Chip>}{f.momento && <Chip>{MOMENTOS[f.momento]}</Chip>}{f.tempo && <Chip>{f.tempo} min</Chip>}
          <button onClick={() => { setStep(0); setF({ idade: null, objetivo: null, perfil: null, momento: null, tempo: null }); }} className="ml-auto text-sm font-medium inline-flex items-center gap-1" style={{ color: C.accent }}><X size={14} /> Recomeçar</button>
        </div>
        {res.length === 0 ? <div className="rounded-2xl p-10 text-center" style={{ border: `1px dashed ${C.line}`, color: C.muted }}>Nenhum jogo encaixou. Aumente o tempo ou mude o objetivo.</div>
          : (<><h2 className="text-xl font-semibold mb-1" style={{ color: C.ink }}>{res.length} jogos para esta sessão</h2><p className="text-sm mb-5" style={{ color: C.muted }}>Ordenados pelo encaixe.</p>
            <div className="flex flex-col gap-4">{res.map(({ jogo, motivos }, i) => (
              <div key={jogo.id} className="rounded-2xl p-5 flex flex-col sm:flex-row gap-5" style={{ backgroundColor: C.card, border: `1px solid ${C.line}`, ...(i === 0 ? { boxShadow: `0 0 0 2px ${C.accent}` } : {}) }}>
                <div className="w-full sm:w-24 h-24 rounded-xl overflow-hidden shrink-0"><Capa jogo={jogo} /></div>
                <div className="flex-1"><div className="flex items-center gap-2 mb-2 flex-wrap">{i === 0 && <Chip bg={C.accentSoft} fg={C.accent}><Sparkles size={12} /> Melhor encaixe</Chip>}<h3 className="text-lg font-semibold" style={{ color: C.ink }}>{jogo.nome}</h3><StatusTag status={jogo.status} /></div>
                  <ul className="flex flex-col gap-1.5 mb-3">{motivos.map((m, k) => <li key={k} className="flex items-start gap-2 text-sm" style={{ color: C.text }}><Check size={15} className="mt-0.5 shrink-0" style={{ color: C.primary }} /> {m}</li>)}</ul>
                  <button onClick={() => onOpen(jogo)} className="inline-flex items-center gap-1.5 text-sm font-semibold" style={{ color: C.primary }}>Ver jogo <ChevronRight size={16} /></button>
                </div>
              </div>))}
            </div></>)}
      </div>
    );
  }
  const cur = steps[step];
  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-1.5 mb-8">{steps.map((_, i) => <div key={i} className="h-1.5 flex-1 rounded-full transition-colors" style={{ backgroundColor: i <= step ? C.accent : C.line }} />)}</div>
      <p className="text-sm mb-2" style={{ color: C.muted }}>Passo {step + 1} de {steps.length}</p>
      <h2 className="text-2xl font-semibold mb-7" style={{ color: C.ink }}>{cur.titulo}</h2>
      <div className="flex flex-wrap gap-2.5">{cur.opts.map(([val, label]) => { const active = f[cur.k] === val; return <button key={String(val)} onClick={() => { set(cur.k, val); setStep(step + 1); }} className="rounded-xl px-4 py-3 text-sm font-medium text-left transition-all" style={{ backgroundColor: active ? C.primary : "#fff", color: active ? "#fff" : C.text, border: `1px solid ${active ? C.primary : C.line}` }}>{label}</button>; })}</div>
      {step > 0 && <button onClick={() => setStep(step - 1)} className="mt-8 inline-flex items-center gap-1.5 text-sm font-medium" style={{ color: C.muted }}><ChevronLeft size={16} /> Voltar</button>}
    </div>
  );
}
function SecTitle({ Icon, children }) { return <h3 className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wide mb-3" style={{ color: C.primary }}><Icon size={16} /> {children}</h3>; }
function Bloco({ Icon, titulo, itens, numerada }) {
  return (<section><SecTitle Icon={Icon}>{titulo}</SecTitle><ol className="flex flex-col gap-2.5">{itens.map((t, i) => (
    <li key={i} className="flex items-start gap-3 text-sm leading-relaxed" style={{ color: C.text }}>{numerada ? <span className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold" style={{ backgroundColor: C.primarySoft, color: C.primary }}>{i + 1}</span> : <span className="shrink-0 mt-2 w-1.5 h-1.5 rounded-full" style={{ backgroundColor: C.accent }} />}{t}</li>))}</ol></section>);
}
function Detalhe({ jogo, onBack }) {
  const F = ICONES[jogo.formato]; const dem = DEMANDAS[jogo.demanda]; const pronto = jogo.instrucoes.length > 0;
  return (
    <div className="max-w-3xl mx-auto">
      <button onClick={onBack} className="inline-flex items-center gap-1.5 text-sm font-medium mb-6" style={{ color: C.muted }}><ArrowLeft size={16} /> Voltar</button>
      <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: C.card, border: `1px solid ${C.line}` }}>
        <div className="p-7 flex flex-col sm:flex-row gap-6 items-start" style={{ backgroundColor: dem.cor + "10" }}>
          <div className="w-24 h-24 rounded-2xl overflow-hidden shrink-0" style={{ border: `1px solid ${dem.cor}22` }}><Capa jogo={jogo} big /></div>
          <div><div className="flex items-center gap-2 mb-2 flex-wrap"><h1 className="text-2xl font-semibold" style={{ color: C.ink }}>{jogo.nome}</h1><StatusTag status={jogo.status} /></div>
            <p className="text-sm leading-relaxed mb-4" style={{ color: C.text }}>{jogo.descricao}</p>
            <div className="flex flex-wrap gap-x-5 gap-y-2"><Meta Icon={Baby}>{jogo.idadeMin}–{jogo.idadeMax} anos</Meta><Meta Icon={Clock}>{jogo.duracao} min</Meta><Meta Icon={F}>{FORMATOS[jogo.formato]}</Meta><Meta Icon={Compass}>{jogo.momentos.map((m) => MOMENTOS[m]).join(", ")}</Meta></div>
          </div>
        </div>
        <div className="p-7 flex flex-col gap-7">
          <section><SecTitle Icon={Target}>Objetivos e demanda</SecTitle><div className="flex flex-wrap gap-1.5"><Chip bg={dem.bg} fg={dem.fg}>{dem.label}</Chip>{jogo.objetivos.map((o) => <Chip key={o}>{OBJETIVOS[o]}</Chip>)}</div></section>
          {pronto ? (<>
            <Bloco Icon={Layers} titulo="Instruções de aplicação" itens={jogo.instrucoes} numerada />
            <Bloco Icon={Eye} titulo="O que observar" itens={jogo.observar} />
            <Bloco Icon={Sparkles} titulo="Sugestões de fechamento" itens={jogo.fechamento} />
            {jogo.pdf ? <a href={jogo.pdf} download={jogo.id + ".pdf"} className="inline-flex items-center justify-center gap-2 rounded-xl py-3.5 font-semibold text-white" style={{ backgroundColor: C.primary }}><Download size={18} /> Baixar material do jogo</a>
              : <button disabled className="inline-flex items-center justify-center gap-2 rounded-xl py-3.5 font-semibold text-white" style={{ backgroundColor: C.primary, opacity: 0.45 }}><Download size={18} /> Material em produção</button>}
          </>) : (
            <div className="rounded-2xl p-8 text-center flex flex-col items-center gap-2" style={{ border: `1px dashed ${C.line}` }}><CircleDot size={22} style={{ color: C.muted }} /><p className="font-medium" style={{ color: C.ink }}>Conteúdo em produção</p><p className="text-sm max-w-sm" style={{ color: C.muted }}>Instruções, observação, fechamento e material entram em breve nesta vaga ({jogo.id}).</p></div>
          )}
        </div>
      </div>
    </div>
  );
}
function OpcaoInicial({ Icon, iconBg, iconFg, titulo, descricao, cta, onClick }) {
  return (
    <button onClick={onClick} className="group text-left rounded-2xl p-7 flex flex-col gap-4 transition-all hover:-translate-y-0.5" style={{ backgroundColor: C.card, border: `1px solid ${C.line}`, boxShadow: "0 1px 2px rgba(20,48,43,.04)" }}>
      <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: iconBg }}><Icon size={22} style={{ color: iconFg }} /></div>
      <div><h2 className="text-lg font-semibold mb-1" style={{ color: C.ink }}>{titulo}</h2><p className="text-sm leading-relaxed" style={{ color: C.muted }}>{descricao}</p></div>
      <span className="inline-flex items-center gap-1.5 text-sm font-semibold mt-auto" style={{ color: C.primary }}>{cta} <ChevronRight size={16} /></span>
    </button>
  );
}
function Home({ onChoose }) {
  return (
    <div className="max-w-2xl mx-auto text-center">
      <h1 className="text-3xl font-semibold mb-3" style={{ color: C.ink }}>Bem-vinda ao Jogo Certo</h1>
      <p className="mb-10" style={{ color: C.muted }}>Escolha como você quer começar.</p>
      <div className="grid sm:grid-cols-2 gap-5 text-left">
        <OpcaoInicial Icon={Sparkles} iconBg={C.accentSoft} iconFg={C.accent} titulo="Sistema Jogo Certo"
          descricao="Responda 5 perguntas rápidas e receba os jogos ideais para esta sessão." cta="Começar" onClick={() => onChoose("certo")} />
        <OpcaoInicial Icon={LayoutGrid} iconBg={C.primarySoft} iconFg={C.primary} titulo="Biblioteca"
          descricao="Navegue e filtre todos os jogos do acervo por conta própria." cta="Explorar" onClick={() => onChoose("biblioteca")} />
      </div>
    </div>
  );
}
export default function App() {
  const [aba, setAba] = useState(null); const [jogoAberto, setJogoAberto] = useState(null);
  const abrir = (j) => { setJogoAberto(j); window.scrollTo(0, 0); };
  return (
    <div style={{ backgroundColor: C.paper, color: C.text, minHeight: "100%", fontFamily: "'Inter', system-ui, sans-serif" }}>
      <header className="sticky top-0 z-10" style={{ backgroundColor: "rgba(251,250,247,.85)", backdropFilter: "blur(8px)", borderBottom: `1px solid ${C.line}` }}>
        <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between gap-4">
          <button onClick={() => { setAba(null); setJogoAberto(null); }} className="flex items-center gap-2.5"><div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: C.ink }}><Compass size={19} color={C.accent} /></div><div className="leading-tight text-left"><p className="font-semibold" style={{ color: C.ink }}>Jogo Certo</p><p className="text-xs" style={{ color: C.muted }}>Acervo terapêutico infantil</p></div></button>
          {!jogoAberto && aba && (<nav className="flex items-center gap-1 rounded-xl p-1" style={{ backgroundColor: "#fff", border: `1px solid ${C.line}` }}>{[["certo", "Sistema Jogo Certo", Sparkles], ["biblioteca", "Biblioteca", LayoutGrid]].map(([id, label, Ic]) => (
              <button key={id} onClick={() => setAba(id)} className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors" style={{ backgroundColor: aba === id ? C.ink : "transparent", color: aba === id ? "#fff" : C.muted }}><Ic size={15} /> <span className="hidden sm:inline">{label}</span></button>))}
            </nav>)}
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-5 py-10">
        {jogoAberto ? <Detalhe jogo={jogoAberto} onBack={() => setJogoAberto(null)} />
          : !aba ? <Home onChoose={setAba} />
          : aba === "certo" ? (<><div className="max-w-2xl mx-auto text-center mb-10"><h1 className="text-3xl font-semibold mb-3" style={{ color: C.ink }}>Encontre o jogo certo para esta sessão</h1><p style={{ color: C.muted }}>Responda 5 perguntas rápidas. O sistema cruza objetivo, perfil, momento e tempo e mostra os jogos que mais fazem sentido — com o porquê de cada um.</p></div><JogoCerto onOpen={abrir} /></>)
            : <Biblioteca onOpen={abrir} />}
      </main>
    </div>
  );
}
