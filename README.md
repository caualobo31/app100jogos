# Jogo Certo — Área de Membros

Acervo de +100 jogos terapêuticos imprimíveis para psicólogas infantis, com dois modos de uso:
**Biblioteca** (navegar/filtrar os jogos) e **Sistema Jogo Certo** (recomendação por sessão).

## Princípio da arquitetura

Quatro camadas separadas — **dados → taxonomia → lógica → interface**.
Adicionar um jogo = adicionar um objeto em `data/jogos.json`. Nada de código muda.

    data/jogos.json      -> os 100 jogos (fonte da verdade; vira a tabela do Supabase)
    data/taxonomia.js    -> vocabulário fixo (demandas, objetivos, momentos, perfis, formatos)
    lib/recomendar.js    -> lógica do Sistema Jogo Certo (sem IA)
    components/AreaMembros.jsx -> a interface (Biblioteca + Jogo Certo + página do jogo)
    scripts/montar_pdfs.py     -> monta os PDFs a partir das imagens do GPT
    supabase/schema.sql        -> tabela `jogos` + notas de Storage

## Esquema de um jogo

    {
      "id": "JG-001",
      "nome": "Termômetro da Preocupação",
      "demanda": "ansiedade",              // eixo principal
      "formato": "tabuleiro",
      "objetivos": ["identificacao","autorregulacao"],
      "momentos": ["desenvolvimento"],
      "perfis": ["ansiosa"],
      "idadeMin": 7, "idadeMax": 10,
      "duracao": 20,                        // minutos
      "descricao": "...",
      "instrucoes": ["passo 1","passo 2"],
      "observar": ["ponto 1"],
      "fechamento": ["pergunta 1"],
      "imagem": "",                         // URL da capa (Storage)
      "pdf": "",                            // URL do material (Storage)
      "status": "conceito"                  // "pronto" quando completo
    }

Os valores de `demanda`, `formato`, `objetivos`, `momentos` e `perfis` vêm sempre da
`taxonomia.js`. Escolha das listas — não invente strings novas fora dela.

## Sistema Jogo Certo (lógica)

A psicóloga responde 5 passos (idade, objetivo, perfil, momento, tempo). A recomendação:
1. **Filtro duro:** só o tempo elimina (jogo mais longo que o disponível). **Idade não filtra** (decisão de produto).
2. **Pontua:** objetivo +50, perfil +25, momento +15, tempo +10.
3. Top 4 por pontuação.
4. Os **motivos** ("por que esse jogo") nascem das tags que bateram — sem curadoria manual.

## Como adicionar / completar um jogo

1. Encontre a vaga pelo `id` em `data/jogos.json`.
2. Preencha `descricao`, `instrucoes`, `observar`, `fechamento`.
3. Gere as imagens no GPT (peças da página) e monte o PDF (ver abaixo).
4. Suba capa e PDF no Storage e cole as URLs em `imagem` e `pdf`.
5. Vire o `status` para `"pronto"`.

## Imagens do GPT -> PDFs

Salve cada imagem com o código no nome: `JG-002-1.png`, `JG-002-2.png` (código-página).
Depois:

    pip install pillow img2pdf
    python scripts/montar_pdfs.py ./imagens ./pdfs

O script agrupa por jogo, ordena as páginas e gera 1 PDF por jogo em `./pdfs`.
Jogos de 2 páginas (cartas, dominó, bingo) viram um PDF de 2 páginas na ordem certa.

Páginas por formato: **1 pág** = tabuleiro, trilha, roleta, dados, memória · **2 pág** = cartas, dominó, bingo.

## Supabase

- Rode `supabase/schema.sql` (tabela `jogos`).
- Importe `data/jogos.json` como seed (mapear `idadeMin/idadeMax` -> `idade_min/idade_max`).
- Bucket `jogos` no Storage: `jogos/<id>/capa.jpg` e `jogos/<id>/material.pdf`.
- No componente, troque o `import GAMES from "../data/jogos.json"` por um fetch da tabela.

## Estado atual

- 100 jogos arquitetados (13/13/13/13/12/12/12/12 por demanda).
- **Ansiedade:** conteúdo dos 13 escrito. JG-001 a JG-007 com imagens + PDFs prontos.
  (bingo JG-007 aguarda cartela com arranjos diferentes; JG-008 a JG-013 aguardam imagens.)
- Demais demandas: só a arquitetura (status "conceito").
