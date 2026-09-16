// Vocabulário controlado — fonte única de verdade dos filtros, chips e do Sistema Jogo Certo.
// Adicionar um valor novo aqui aparece automaticamente na Biblioteca e no wizard.

export const DEMANDAS = {
  ansiedade:   { label: "Ansiedade",              bg: "#E4EEF6", fg: "#2C5B82", cor: "#2C5B82" },
  tdah:        { label: "TDAH / Impulsividade",   bg: "#FBEBD8", fg: "#9A5B14", cor: "#9A5B14" },
  raiva:       { label: "Raiva / Agressividade",  bg: "#F7E1E1", fg: "#9B3B3B", cor: "#9B3B3B" },
  autoestima:  { label: "Autoestima",             bg: "#EDE6F6", fg: "#6742A0", cor: "#6742A0" },
  regulacao:   { label: "Regulação emocional",    bg: "#E1F0EA", fg: "#2E7357", cor: "#2E7357" },
  habilidades: { label: "Habilidades sociais",    bg: "#E5E8F7", fg: "#3F4A90", cor: "#3F4A90" },
  medos:       { label: "Medos",                  bg: "#E9EAEC", fg: "#4B5560", cor: "#4B5560" },
  vinculo:     { label: "Vínculo / Quebra-gelo",  bg: "#FBE6EF", fg: "#9C3C6B", cor: "#9C3C6B" },
};

export const OBJETIVOS = {
  identificacao: "Identificação emocional", expressao: "Expressão emocional",
  autorregulacao: "Autorregulação", impulsos: "Controle de impulsos",
  frustracao: "Tolerância à frustração", autoconhecimento: "Autoconhecimento",
  autoconfianca: "Autoconfiança", cooperacao: "Cooperação", comunicacao: "Comunicação",
  enfrentamento: "Enfrentamento de medos", vinculo_obj: "Criação de vínculo",
  atencao: "Atenção / Concentração",
};

export const MOMENTOS = { aquecimento: "Aquecimento", desenvolvimento: "Desenvolvimento", fechamento: "Fechamento" };

export const PERFIS = {
  pouco_verbal: "Pouco verbal", agitada: "Agitada / inquieta", retraida: "Retraída / tímida",
  resistente: "Resistente ao vínculo", ansiosa: "Ansiosa", desregulada: "Desregulada", cooperativa: "Cooperativa",
};

// Só o rótulo. O ícone (lucide) é mapeado no componente.
export const FORMATOS = {
  tabuleiro: "Tabuleiro", cartas: "Cartas", memoria: "Memória", domino: "Dominó",
  dados: "Dados", bingo: "Bingo", trilha: "Trilha", roleta: "Roleta",
};
