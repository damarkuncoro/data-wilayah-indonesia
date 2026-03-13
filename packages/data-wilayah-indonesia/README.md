# Data Wilayah Administratif Indonesia

[![NPM version](https://img.shields.io/npm/v/@damarkuncoro/data-wilayah-indonesia.svg)](https://www.npmjs.com/package/@damarkuncoro/data-wilayah-indonesia)

Package JavaScript/TypeScript yang ringan, modern, dan dapat diperluas (*pluginable*) untuk mengakses data wilayah administratif Indonesia (Provinsi, Kabupaten/Kota, Kecamatan, dan Desa/Kelurahan).

## Fitur Utama

- **Data Lengkap & Terverifikasi**: Berdasarkan Kepmendagri No. 050-145 Tahun 2022.
- **Ukuran Super Ringan**: Seluruh data dasar (provinsi, kab/kota, kecamatan) hanya ~500KB. Data desa tidak di-bundle dan dimuat sesuai kebutuhan.
- **Lazy Loading Canggih**: Data desa dimuat secara asinkron per provinsi, menjaga ukuran bundle aplikasi Anda tetap minimal.
- **Hierarki Lengkap**: Setiap objek wilayah menyertakan nama induknya (misal: `Village` menyertakan `provinceName` dan `regencyName`).
- **Modern & Type-Safe**: Ditulis dalam TypeScript dengan dukungan Functional API untuk *tree-shaking* yang maksimal.
- **Arsitektur Pluginable**: Perkaya data dengan mudah (Kodepos, Koordinat, dll.) tanpa mengubah kode inti.

## Instalasi

```bash
npm install @damarkuncoro/data-wilayah-indonesia
```

## Penggunaan Cepat

### 1. Functional API (Direkomendasikan)

Gunakan fungsi-fungsi ini untuk mendukung *tree-shaking* yang lebih baik di bundler modern seperti Vite atau Webpack.

```typescript
import {
  getAllProvinces,
  getRegenciesByProvince,
  getDistrictsByRegency,
  fetchVillagesByDistrict
} from '@damarkuncoro/data-wilayah-indonesia';

// Mendapatkan semua provinsi (data sudah termasuk)
const provinces = getAllProvinces();
console.log(provinces[0].name); // "ACEH"

// Mendapatkan kabupaten/kota di Jawa Barat (kode: 32)
const regenciesInJabar = getRegenciesByProvince('32');
console.log(regenciesInJabar[0].name); // "KABUPATEN BOGOR"

// Mendapatkan kecamatan di Kota Bandung (kode: 32.73)
const districtsInBandung = getDistrictsByRegency('32.73');
console.log(districtsInBandung[0].name); // "BANDUNG KULON"

// LAZY LOADING: Memuat data desa untuk Kecamatan Coblong (32.73.01)
// Hanya data untuk provinsi Jawa Barat yang akan diunduh oleh browser.
const villagesInCoblong = await fetchVillagesByDistrict('32.73.01');
console.log(villagesInCoblong[0].name); // "CIPAGANTI"

// Setiap data wilayah memiliki nama induknya untuk kemudahan penggunaan
console.log(villagesInCoblong[0].provinceName); // "JAWA BARAT"
console.log(villagesInCoblong[0].regencyName);  // "KOTA BANDUNG"
console.log(villagesInCoblong[0].districtName); // "COBLONG"
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

## Statistik Data

Berdasarkan rekapitulasi data wilayah administrasi terbaru:

| Wilayah      | Jumlah            |
| ------------ | ----------------- |
| Provinsi     | 38                |
| Kabupaten    | 416               |
| Kota         | 98                |
| Kecamatan    | 7.277             |
| Kelurahan    | 8.498             |
| Desa         | 75.265            |
| Luas Wilayah | 1.892.410,091 Km² |
| Penduduk     | 275.361.267       |
| Pulau        | 17.001            |

## Metadata & Transparansi

- **Sumber Data**: Kepmendagri No. 050-145 Tahun 2022 (Source Document: `docs/1715587369092.pdf`).
- **Update Terakhir**: 2024.
- **Versioning**: Mengikuti Semantic Versioning (SemVer).

## Lisensi

[MIT](LICENSE)
