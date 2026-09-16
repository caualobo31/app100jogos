#!/usr/bin/env python3
"""
Monta os PDFs dos jogos a partir das imagens geradas pelo GPT.

Convenção de nome dos arquivos (o que garante o roteamento automático):
    JG-001-1.png   -> jogo JG-001, página 1
    JG-002-1.png   -> jogo JG-002, página 1
    JG-002-2.png   -> jogo JG-002, página 2
O script agrupa por código, ordena por página e gera 1 PDF por jogo.

Uso:
    python scripts/montar_pdfs.py <pasta_imagens> <pasta_saida>
    # ex: python scripts/montar_pdfs.py ./imagens ./pdfs

Requer: pillow, img2pdf   ->  pip install pillow img2pdf
"""
import sys, os, re, io
from collections import defaultdict
from PIL import Image
import img2pdf

def main(indir, outdir):
    os.makedirs(outdir, exist_ok=True)
    grupos = defaultdict(list)
    pat = re.compile(r"(JG-\d{3})[-_·](\d+)", re.I)
    for f in os.listdir(indir):
        if not f.lower().endswith((".png", ".jpg", ".jpeg")):
            continue
        m = pat.search(f)
        if not m:
            print(f"[ignorado] sem código no nome: {f}")
            continue
        grupos[m.group(1).upper()].append((int(m.group(2)), os.path.join(indir, f)))

    for gid, paginas in sorted(grupos.items()):
        paginas.sort()  # por número de página
        jpgs = []
        for _, path in paginas:
            im = Image.open(path).convert("RGB")
            b = io.BytesIO(); im.save(b, "JPEG", quality=90); jpgs.append(b.getvalue())
        out = os.path.join(outdir, f"{gid}.pdf")
        with open(out, "wb") as fh:
            fh.write(img2pdf.convert(jpgs))
        print(f"[ok] {gid}: {len(paginas)} pág -> {out}")

    if not grupos:
        print("Nenhuma imagem com código JG-###-# encontrada. Renomeie os arquivos e rode de novo.")

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print(__doc__); sys.exit(1)
    main(sys.argv[1], sys.argv[2])
