# Aronnax Lab

Static Next.js site plus the migrated underwater VLA demo pipeline from
`Trolleroof/larplarpsahur`.

## Run the site

```bash
npm install
npm run dev
```

Open `/demo` for the migrated dataset explorer.

## Deploy to Cloudflare Pages

Build command:

```bash
npm run build:cloudflare
```

Build output directory:

```bash
out
```

## Rebuild demo data

```bash
pip install -r requirements.txt
python -m underwater_vla build --limit 200
```

No Hugging Face access:

```bash
python gen_demo.py
```
