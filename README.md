# Aronnax Lab

Static Next.js site plus the migrated underwater VLA demo pipeline from
`Trolleroof/larplarpsahur`.

## Run the site

```bash
npm install
npm run dev
```

Open `/demo` for the migrated dataset explorer.

## Rebuild demo data

```bash
pip install -r requirements.txt
python -m underwater_vla build --limit 200
```

No Hugging Face access:

```bash
python gen_demo.py
```
