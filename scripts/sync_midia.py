#!/usr/bin/env python3
"""
Preenche `imagem` e `pdf` em data/jogos.json a partir do que estiver em
public/jogos/<id>/ — sem precisar editar o JSON na mão.

Convenção da pasta (mesmo caminho que o Storage do Supabase vai usar):
    public/jogos/JG-001/capa.jpg     -> imagem   (opcional; nome fixo "capa.<ext>")
    public/jogos/JG-001/<qualquer>.pdf -> pdf    (único arquivo .pdf da pasta, qualquer nome)

Só mexe nos campos `imagem` e `pdf`. O `status` continua manual (passo 5
do fluxo no README) — o script nunca decide sozinho se um jogo está pronto.

Uso:
    python scripts/sync_midia.py
"""
import json
import os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
JOGOS_JSON = os.path.join(ROOT, "data", "jogos.json")
MIDIA_DIR = os.path.join(ROOT, "public", "jogos")
CAPA_EXT = (".jpg", ".jpeg", ".png", ".webp")


def achar_capa(pasta):
    for ext in CAPA_EXT:
        caminho = os.path.join(pasta, "capa" + ext)
        if os.path.isfile(caminho):
            return ext
    return None


def achar_pdf(pasta):
    pdfs = sorted(f for f in os.listdir(pasta) if f.lower().endswith(".pdf"))
    if len(pdfs) > 1:
        print(f"[aviso] mais de um .pdf em {pasta}, usando o primeiro: {pdfs}")
    return pdfs[0] if pdfs else None


def main():
    with open(JOGOS_JSON, encoding="utf-8") as fh:
        jogos = json.load(fh)

    alterados = 0
    for jogo in jogos:
        pasta = os.path.join(MIDIA_DIR, jogo["id"])
        if not os.path.isdir(pasta):
            continue

        nova_imagem = jogo["imagem"]
        ext = achar_capa(pasta)
        if ext:
            nova_imagem = f"/jogos/{jogo['id']}/capa{ext}"

        nova_pdf = jogo["pdf"]
        arquivo_pdf = achar_pdf(pasta)
        if arquivo_pdf:
            nova_pdf = f"/jogos/{jogo['id']}/{arquivo_pdf}"

        if nova_imagem != jogo["imagem"] or nova_pdf != jogo["pdf"]:
            jogo["imagem"], jogo["pdf"] = nova_imagem, nova_pdf
            alterados += 1
            print(f"[ok] {jogo['id']}: imagem={nova_imagem or '—'} pdf={nova_pdf or '—'}")

    if alterados:
        with open(JOGOS_JSON, "w", encoding="utf-8") as fh:
            json.dump(jogos, fh, ensure_ascii=False, indent=2)
            fh.write("\n")
        print(f"\n{alterados} jogo(s) atualizado(s) em data/jogos.json.")
    else:
        print("Nada para atualizar — nenhum arquivo novo encontrado em public/jogos/<id>/.")


if __name__ == "__main__":
    main()
