# Data Wilayah Indonesia (JavaScript/TypeScript)

[![npm version](https://img.shields.io/npm/v/@damarkuncoro/data-wilayah-indonesia.svg)](https://www.npmjs.com/package/@damarkuncoro/data-wilayah-indonesia)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Package JavaScript/TypeScript untuk mengakses data wilayah administratif Indonesia yang mencakup **Provinsi**, **Kabupaten/Kota**, **Kecamatan**, dan **Desa/Kelurahan**. Data ini diekstrak secara otomatis dari dokumen resmi pemerintah dan diatur mengikuti prinsip arsitektur bersih (*Clean Architecture*).

## Fitur Utama

- **Lengkap**: Mencakup 4 level wilayah administratif di seluruh Indonesia.
- **Ringan & Cepat**: Menggunakan penyimpanan JSON yang dioptimalkan.
- **Tipe Data Kuat**: Ditulis dalam TypeScript untuk pengalaman pengembangan yang lebih baik.
- **Fleksibel**: Mendukung pencarian berdasarkan kode, nama, dan pencarian global.
- **Cascading Support**: Memudahkan pembuatan dropdown bertingkat.

## Instalasi

```bash
npm install @damarkuncoro/data-wilayah-indonesia
# atau
yarn add @damarkuncoro/data-wilayah-indonesia
```

## Penggunaan Cepat

### Inisialisasi Service

```typescript
import { DataWilayahService } from '@damarkuncoro/data-wilayah-indonesia';

const service = new DataWilayahService();
```

### Navigasi Wilayah (Cascading)

```typescript
// 1. Dapatkan semua Provinsi
const provinces = service.getAllProvinces();

// 2. Dapatkan Kabupaten/Kota di Jawa Barat (Kode: "32")
const regencies = service.getRegenciesByProvince("32");

// 3. Dapatkan Kecamatan di Kota Bandung (Kode: "32.73")
const districts = service.getDistrictsByRegency("32.73");

// 4. Dapatkan Desa/Kelurahan di Coblong (Kode: "32.73.08")
const villages = service.getVillagesByDistrict("32.73.08");
```

### Pencarian Global

Fitur baru untuk mencari wilayah di semua level sekaligus:

```typescript
const searchResults = service.search("Gambir");
// Output: [
//   { type: 'DISTRICT', item: { code: '31.71.01', name: 'GAMBIR', ... } },
//   { type: 'VILLAGE', item: { code: '31.71.01.1001', name: 'GAMBIR', ... } }
// ]
```

## Contoh Implementasi (Vite)

Anda bisa melihat contoh implementasi dropdown bertingkat yang interaktif di direktori `examples/vite`.

## API Reference

### `DataWilayahService`

| Metode | Deskripsi |
| :--- | :--- |
| `getAllProvinces()` | Mengambil semua daftar provinsi |
| `getProvinceByCode(code)` | Mengambil satu provinsi berdasarkan kodenya |
| `getRegenciesByProvince(provinceCode)` | Mengambil kabupaten/kota dalam suatu provinsi |
| `getDistrictsByRegency(regencyCode)` | Mengambil kecamatan dalam suatu kabupaten/kota |
| `getVillagesByDistrict(districtCode)` | Mengambil desa/kelurahan dalam suatu kecamatan |
| `search(name)` | Melakukan pencarian nama di seluruh level administratif |
| `findProvincesByName(name)` | Mencari provinsi berdasarkan nama |

## Lisensi

[MIT](LICENSE) © Damar Kuncoro
