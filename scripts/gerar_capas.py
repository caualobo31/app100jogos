#!/usr/bin/env python3
"""
Gera capa.jpg em public/jogos/<id>/ a partir da página 1 do PDF do jogo,
pra Biblioteca mostrar uma prévia real em vez do ícone genérico.

Roda pra todo jogo que já tem PDF mas ainda não tem capa. Não mexe em
data/jogos.json — depois de gerar, rode scripts/sync_midia.py pra ligar
o campo `imagem`.

Requer poppler instalado (comando `pdftoppm`)  ->  brew install poppler

Uso:
    python3 scripts/gerar_capas.py [id]   # um jogo só, ex: JG-052
    python3 scripts/gerar_capas.py        # todos os que faltam
"""
import os
import subprocess
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MIDIA_DIR = os.path.join(ROOT, "public", "jogos")


def gerar_capa(pasta, gid):
    pdfs = sorted(f for f in os.listdir(pasta) if f.lower().endswith(".pdf"))
    if not pdfs:
        return False
    if any(f.lower().startswith("capa.") for f in os.listdir(pasta)):
        return False

    origem = os.path.join(pasta, pdfs[0])
    prefixo = os.path.join(pasta, "capa")
    subprocess.run(
        [
            "pdftoppm", "-jpeg", "-f", "1", "-singlefile",
            "-scale-to-x", "640", "-scale-to-y", "-1",
            "-jpegopt", "quality=82",
            origem, prefixo,
        ],
        check=True,
    )
    print(f"[ok] {gid}: capa.jpg <- {pdfs[0]}")
    return True


def main():
    alvo = sys.argv[1] if len(sys.argv) > 1 else None
    gerados = 0
    ids = [alvo] if alvo else sorted(os.listdir(MIDIA_DIR))
    for gid in ids:
        pasta = os.path.join(MIDIA_DIR, gid)
        if not os.path.isdir(pasta):
            continue
        if gerar_capa(pasta, gid):
            gerados += 1

    print(f"\n{gerados} capa(s) gerada(s).")
    if gerados:
        print("Rode agora: python3 scripts/sync_midia.py")


if __name__ == "__main__":
    main()
