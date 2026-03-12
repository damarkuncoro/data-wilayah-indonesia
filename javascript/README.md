# Data Wilayah Administratif Indonesia

[![NPM version](https://img.shields.io/npm/v/@damarkuncoro/data-wilayah-indonesia.svg)](https://www.npmjs.com/package/@damarkuncoro/data-wilayah-indonesia)

Package JavaScript/TypeScript yang ringan, modern, dan dapat diperluas (*pluginable*) untuk mengakses data wilayah administratif Indonesia (Provinsi, Kabupaten/Kota, Kecamatan, dan Desa/Kelurahan).

## Fitur Utama

- **Data Lengkap & Terverifikasi**: Berdasarkan Kepmendagri No. 050-145 Tahun 2022 (Terupdate 2024).
- **Optimasi Bundle (Lazy Loading)**: Mendukung pemuatan data desa secara asinkron per provinsi untuk menjaga ukuran bundle aplikasi tetap kecil.
- **Hierarki Lengkap**: Setiap objek wilayah menyertakan nama induknya (misal: `Village` menyertakan `provinceName` dan `regencyName`).
- **Modern & Type-Safe**: Ditulis dalam TypeScript dengan dukungan Functional API untuk *tree-shaking* yang maksimal.
- **Arsitektur Pluginable**: Perkaya data dengan mudah (Kodepos, Koordinat, dll.) tanpa mengubah kode inti.

## Instalasi

```bash
npm install @damarkuncoro/data-wilayah-indonesia
```

## Penggunaan

### 1. Functional API (Direkomendasikan)

Gunakan fungsi-fungsi ini untuk mendukung *tree-shaking* yang lebih baik di bundler modern seperti Vite atau Webpack.

```typescript
import { 
  getAllProvinces, 
  getRegenciesByProvince, 
  getDistrictsByRegency, 
  fetchVillagesByDistrict 
} from '@damarkuncoro/data-wilayah-indonesia';

// Mendapatkan semua provinsi
const provinces = getAllProvinces();

// Mendapatkan kabupaten/kota di Jawa Barat (32)
const regencies = getRegenciesByProvince('32');

// Lazy Loading data desa (Hanya memuat data untuk provinsi yang dibutuhkan)
const villages = await fetchVillagesByDistrict('32.73.01');
console.log(villages[0].provinceName); // "JAWA BARAT"
console.log(villages[0].regencyName);  // "KOTA BANDUNG"
```

### 2. Service API (Class-based)

Gunakan jika Anda perlu menyuntikkan *provider* atau *plugin* kustom.

```typescript
import { DataWilayahService } from '@damarkuncoro/data-wilayah-indonesia';

const service = new DataWilayahService();
const provinces = service.getAllProvinces();
```

## Arsitektur Pluginable

### Menggunakan DataPlugin untuk Memperkaya Data

Plugin memungkinkan Anda untuk menambahkan data tambahan seperti kodepos atau koordinat.

```typescript
import { DataPlugin, Village, DataWilayahService } from '@damarkuncoro/data-wilayah-indonesia';

class MyCustomPlugin implements DataPlugin {
  name = 'my-custom-plugin';

  enrichVillages(villages: Village[]): Village[] {
    return villages.map(v => ({ ...v, customData: 'foo' }));
  }
}

const service = new DataWilayahService(undefined, [new MyCustomPlugin()]);
```

### Menggunakan DataProvider Kustom

Ganti sumber data (misal: dari API atau Database) dengan mengimplementasikan `DataProvider`.

```typescript
import { DataProvider, DataWilayahService } from '@damarkuncoro/data-wilayah-indonesia';

class MyDatabaseProvider implements DataProvider {
  // Implementasi getProvinces, getRegencies, dll.
}

const service = new DataWilayahService(new MyDatabaseProvider());
```

## Metadata & Transparansi

- **Sumber Data**: Kepmendagri No. 050-145 Tahun 2022.
- **Update Terakhir**: 2024.
- **Versioning**: Mengikuti Semantic Versioning (SemVer).

## Lisensi

[MIT](LICENSE)
