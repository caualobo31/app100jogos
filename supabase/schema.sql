-- Tabela dos jogos. Cada linha = um objeto do data/jogos.json.
-- Rode no SQL editor do Supabase.

create table if not exists jogos (
  id          text primary key,              -- "JG-001"
  nome        text not null,
  demanda     text not null,                 -- eixo principal (ver taxonomia)
  formato     text not null,
  objetivos   text[] not null default '{}',
  momentos    text[] not null default '{}',
  perfis      text[] not null default '{}',
  idade_min   int  not null,
  idade_max   int  not null,
  duracao     int  not null,                 -- minutos
  descricao   text default '',
  instrucoes  text[] default '{}',
  observar    text[] default '{}',
  fechamento  text[] default '{}',
  imagem      text default '',               -- URL pública no Storage (capa)
  pdf         text default '',               -- URL do material (Storage; signed URL se privado)
  status      text default 'conceito',       -- 'conceito' | 'pronto'
  criado_em   timestamptz default now()
);

-- Índices úteis para os filtros da Biblioteca e do Sistema Jogo Certo.
create index if not exists idx_jogos_demanda   on jogos (demanda);
create index if not exists idx_jogos_objetivos on jogos using gin (objetivos);
create index if not exists idx_jogos_perfis    on jogos using gin (perfis);

-- Storage: crie um bucket 'jogos' (público para as capas; privado + signed URL para os PDFs, se preferir).
-- Caminho sugerido:  jogos/<id>/capa.jpg  e  jogos/<id>/material.pdf
-- Seed: importe data/jogos.json (idade_min/idade_max = idadeMin/idadeMax do JSON).
