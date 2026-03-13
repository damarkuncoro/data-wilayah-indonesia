# Cara Publish Package

## Python Package (PyPI)

### Persiapan
1. Buat akun di https://pypi.org
2. Buat akun di https://test.pypi.org (untuk testing)
3. Install tools yang diperlukan:
   ```bash
   pip install build twine
   ```

### Steps
1. Navigate ke folder Python:
   ```bash
   cd python/data_wilayah_indonesia
   ```

2. Build package:
   ```bash
   python -m build
   ```

3. Upload ke PyPI (gunakan username dan password PyPI):
   ```bash
   twine upload dist/*
   ```

4. Atau upload ke test PyPI dulu:
   ```bash
   twine upload --repository testpypi dist/*
   ```

### Install dari PyPI:
```bash
pip install data-wilayah-indonesia
```

---

## JavaScript/TypeScript Package (npm)

### Persiapan
1. Buat akun di https://www.npmjs.com
2. Login di terminal:
   ```bash
   npm login
   ```

### Steps
1. Navigate ke folder JavaScript:
   ```bash
   cd javascript
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Build TypeScript:
   ```bash
   npm run build
   ```

4. Update version di package.json:
   ```bash
   npm version patch  # atau npm version minor/major
   ```

5. Publish ke npm:
   ```bash
   npm publish
   ```

### Install dari npm:
```bash
npm install data-wilayah-indonesia
```

---

## Catatan

- Data village tidak tersedia karena CSV source tidak mengandung data level desa/kelurahan
- Untuk mendapatkan data village lengkap, perlu sumber data tambahan
- Province count: 42, Regency count: 251, District count: 2977