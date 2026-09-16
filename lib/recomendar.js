import { OBJETIVOS, MOMENTOS, PERFIS } from "../data/taxonomia";

// Pesos do encaixe. Idade NÃO filtra nem pontua (decisão de produto: "criança é criança").
const PESOS = { objetivo: 50, perfil: 25, momento: 15, tempo: 10 };

// Filtros duros: só tempo elimina (jogo mais longo que o disponível). Depois pontua e ordena.
// Os "motivos" nascem das tags que bateram — zero curadoria manual por combinação.
export function recomendar(GAMES, { objetivo, perfil, momento, tempo }) {
  return GAMES
    .filter((j) => !(tempo && j.duracao > tempo))
    .map((j) => {
      let score = 0; const motivos = [];
      if (objetivo && j.objetivos.includes(objetivo)) { score += PESOS.objetivo; motivos.push(`Trabalha diretamente ${OBJETIVOS[objetivo].toLowerCase()}`); }
      if (perfil && j.perfis.includes(perfil))       { score += PESOS.perfil;   motivos.push(`Indicado para criança ${PERFIS[perfil].toLowerCase()}`); }
      if (momento && j.momentos.includes(momento))   { score += PESOS.momento;  motivos.push(`Encaixa no momento de ${MOMENTOS[momento].toLowerCase()}`); }
      if (tempo) { score += PESOS.tempo; motivos.push(`Cabe nos ${tempo} min disponíveis (~${j.duracao} min)`); }
      return { jogo: j, score, motivos };
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 4);
}
