#!/usr/bin/env python3
"""
Pipeline completo pra transformar imagens do GPT em material pronto:
lê `imagens/`, monta 1 PDF por jogo, salva em public/jogos/<id>/ e
atualiza data/jogos.json — tudo numa rodada só.

Convenção de nome das imagens (a mesma do scripts/montar_pdfs.py):
    JG-008-1.png   -> jogo JG-008, página 1
    JG-008-2.png   -> jogo JG-008, página 2

O que o script faz, por jogo encontrado em imagens/:
    1. Agrupa as páginas pelo código e ordena por número.
    2. Gera um PDF (JPEG por página) em public/jogos/<id>/<id>_<Nome-Do-Jogo>.pdf
       — o nome vem do campo `nome` em data/jogos.json, igual ao padrão
       já usado em JG-001..JG-007. Se o id não existir no JSON, usa só o id.
    3. Arquiva as imagens originais em imagens/_processadas/<id>/ (não apaga).
    4. Roda scripts/sync_midia.py pra preencher `imagem`/`pdf` no JSON.

O `status` de cada jogo continua manual (passo 5 do fluxo no README).

Uso:
    python scripts/processar_imagens.py
"""
import io
import os
import re
import subprocess
import sys
import unicodedata
from collections import defaultdict

from PIL import Image
import img2pdf

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
IMAGENS_DIR = os.path.join(ROOT, "imagens")
PROCESSADAS_DIR = os.path.join(IMAGENS_DIR, "_processadas")
PUBLIC_JOGOS_DIR = os.path.join(ROOT, "public", "jogos")
JOGOS_JSON = os.path.join(ROOT, "data", "jogos.json")

PADRAO_ARQUIVO = re.compile(r"(JG-\d{3})[-_·](\d+)", re.I)


def slugify_nome(nome):
    sem_acento = "".join(
        c for c in unicodedata.normalize("NFKD", nome) if not unicodedata.combining(c)
    )
    partes = [re.sub(r"[^A-Za-z0-9]", "", p) for p in re.split(r"[\s-]+", sem_acento)]
    return "-".join(p for p in partes if p)


def carregar_nomes():
    import json
    with open(JOGOS_JSON, encoding="utf-8") as fh:
        jogos = json.load(fh)
    return {j["id"]: j["nome"] for j in jogos}


def agrupar_imagens():
    grupos = defaultdict(list)
    for f in sorted(os.listdir(IMAGENS_DIR)):
        caminho = os.path.join(IMAGENS_DIR, f)
        if not os.path.isfile(caminho) or not f.lower().endswith((".png", ".jpg", ".jpeg")):
            continue
        m = PADRAO_ARQUIVO.search(f)
        if not m:
            print(f"[ignorado] sem código no nome: {f}")
            continue
        grupos[m.group(1).upper()].append((int(m.group(2)), f))
    for gid in grupos:
        grupos[gid].sort()
    return grupos


def montar_pdf(gid, paginas, nomes):
    nome = nomes.get(gid)
    slug = slugify_nome(nome) if nome else None
    nome_arquivo = f"{gid}_{slug}.pdf" if slug else f"{gid}.pdf"

    dest_dir = os.path.join(PUBLIC_JOGOS_DIR, gid)
    os.makedirs(dest_dir, exist_ok=True)

    for antigo in os.listdir(dest_dir):
        if antigo.lower().endswith(".pdf"):
            os.remove(os.path.join(dest_dir, antigo))

    jpgs = []
    for _, arquivo in paginas:
        im = Image.open(os.path.join(IMAGENS_DIR, arquivo)).convert("RGB")
        buf = io.BytesIO()
        im.save(buf, "JPEG", quality=90)
        jpgs.append(buf.getvalue())

    destino = os.path.join(dest_dir, nome_arquivo)
    with open(destino, "wb") as fh:
        fh.write(img2pdf.convert(jpgs))

    arquivar_dir = os.path.join(PROCESSADAS_DIR, gid)
    os.makedirs(arquivar_dir, exist_ok=True)
    for _, arquivo in paginas:
        os.replace(os.path.join(IMAGENS_DIR, arquivo), os.path.join(arquivar_dir, arquivo))

    print(f"[ok] {gid}: {len(paginas)} pág -> public/jogos/{gid}/{nome_arquivo}")


def main():
    if not os.path.isdir(IMAGENS_DIR):
        print("Pasta imagens/ não existe.")
        sys.exit(1)

    grupos = agrupar_imagens()
    if not grupos:
        print("Nenhuma imagem com código JG-###-# encontrada em imagens/.")
        return

    nomes = carregar_nomes()
    for gid, paginas in sorted(grupos.items()):
        montar_pdf(gid, paginas, nomes)

    subprocess.run([sys.executable, os.path.join(ROOT, "scripts", "sync_midia.py")], check=True)


if __name__ == "__main__":
    main()
