# Mian — Frontend

This is a Vite + Vue 3 (Composition API) single-page app scaffold for Mian Cafe. Mobile-first, responsive, and bilingual (English + Persian) with RTL/LTR support.

Getting started

1. Install dependencies

```bash
npm install
```

2. Start dev server

```bash
npm run dev
```

Notes

- Language switching is handled by `vue-i18n` in `src/main.ts` and components use `useI18n()`.
- RTL is applied by toggling the `dir` attribute on the outer container in `src/App.vue`.
- Styles use Tailwind CSS: `tailwind.config.cjs` and `src/styles.css`.
- This is a starter scaffold — extend components in `src/components/` and add assets in `public/`.

Image workflow

- Place your raw images (any formats) in a temporary folder outside the project or in `assets-to-import/` in the project root.
- Run the preprocessing script which converts, resizes, and normalizes names:

```bash
# install sharp (native bindings)
npm install --save-dev sharp

# run the script against the folder containing your raw images
node scripts/prep-images.js /full/path/to/assets-to-import
```

- The script writes processed images to `public/images/{small,medium,large}` and creates `public/images/srcset.json` mapping originals to processed files.
- Note: HEIC/HEIF support requires libvips with heif enabled; if conversion fails for HEIC files, convert them on macOS Photos or use a converter before running the script.

TypeScript removed

- I removed TypeScript source files and config from this scaffold and converted the code to plain JavaScript (`.js`) to simplify local development.
