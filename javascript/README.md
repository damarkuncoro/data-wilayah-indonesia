# Data Wilayah Administratif Indonesia

[![NPM version](https://img.shields.io/npm/v/@damarkuncoro/data-wilayah-indonesia.svg)](https://www.npmjs.com/package/@damarkuncoro/data-wilayah-indonesia)

Package JavaScript/TypeScript yang ringan, modern, dan dapat diperluas (*pluginable*) untuk mengakses data wilayah administratif Indonesia (Provinsi, Kabupaten/Kota, Kecamatan, dan Desa/Kelurahan).

## Fitur Utama

- **Data Lengkap & Terverifikasi**: Mencakup 37 Provinsi, 500+ Kabupaten/Kota, 7,000+ Kecamatan, dan 80,000+ Desa/Kelurahan.
- **Modern & Type-Safe**: Ditulis sepenuhnya dalam TypeScript, menyediakan definisi tipe yang kaya.
- **Arsitektur Pluginable**: Perkaya data wilayah dengan mudah menggunakan sistem provider dan plugin. Tambahkan kodepos, data geografis, atau data kustom lainnya tanpa mengubah kode inti.
- **Zero Dependency**: Tidak ada dependensi runtime, memastikan package tetap ringan.
- **ESM & CJS Support**: Mendukung modul ES dan CommonJS secara native.

## Instalasi

```bash
npm install @damarkuncoro/data-wilayah-indonesia
```

## Penggunaan Dasar

```typescript
import { DataWilayahService } from '@damarkuncoro/data-wilayah-indonesia';

const service = new DataWilayahService();

// Mendapatkan semua provinsi
const provinces = service.getAllProvinces();
console.log(provinces[0]); // { code: '11', name: 'ACEH' }

// Mendapatkan kabupaten/kota di sebuah provinsi (contoh: Jawa Barat)
const regencies = service.getRegenciesByProvince('32');
console.log(regencies[0]); // { code: '32.01', name: 'BOGOR', ... }

// Mendapatkan kecamatan di sebuah kabupaten/kota (contoh: Kota Bandung)
const districts = service.getDistrictsByRegency('32.73');
console.log(districts[0]); // { code: '32.73.01', name: 'ANDIR', ... }

// Mendapatkan desa/kelurahan di sebuah kecamatan (contoh: Kecamatan Andir)
const villages = service.getVillagesByDistrict('32.73.01');
console.log(villages[0]); // { code: '32.73.01.1001', name: 'CAMPAKA', ... }
```

## Arsitektur Pluginable

Fitur paling kuat dari package ini adalah kemampuannya untuk diperluas. Anda bisa mengganti cara data dimuat (*DataProvider*) atau memperkaya data yang ada (*DataPlugin*).

### 1. Menggunakan DataProvider Kustom

Secara default, data dimuat dari file JSON yang disertakan. Namun, Anda bisa membuat provider sendiri untuk memuat data dari database, API, atau sumber lain.

```typescript
import { DataProvider, Province, DataWilayahService } from '@damarkuncoro/data-wilayah-indonesia';

// 1. Buat provider Anda sendiri
class MyApiProvider implements DataProvider {
  getProvinces(): Province[] {
    // Logika untuk mengambil data provinsi dari API Anda
    // return fetch('https://my-api.com/provinces')...
    return [{ code: '99', name: 'PROVINSI KUSTOM' }];
  }
  // ... implementasi getRegencies, getDistricts, getVillages
}

// 2. Inisialisasi service dengan provider kustom
const myProvider = new MyApiProvider();
const service = new DataWilayahService(myProvider);

// Service sekarang akan menggunakan data dari API Anda
const provinces = service.getAllProvinces();
console.log(provinces[0].name); // "PROVINSI KUSTOM"
```

### 2. Menggunakan DataPlugin untuk Memperkaya Data

Plugin memungkinkan Anda untuk "menempelkan" data tambahan ke data wilayah yang ada, seperti kodepos, koordinat, atau data demografis.

```typescript
import { DataPlugin, Village, DataWilayahService } from '@damarkuncoro/data-wilayah-indonesia';

// 1. Buat plugin Anda
class PostalCodePlugin implements DataPlugin {
  name = 'postal-code-plugin';

  enrichVillages(villages: Village[]): Village[] {
    return villages.map(village => ({
      ...village,
      // Logika untuk menambahkan kodepos (bisa dari map atau API lain)
      postalCode: `KODE_${village.code}`
    }));
  }
}

// 2. Inisialisasi service dengan plugin
const postalCodePlugin = new PostalCodePlugin();
const service = new DataWilayahService(undefined, [postalCodePlugin]);

// 3. Data desa sekarang memiliki properti `postalCode`
const village = service.getVillageByCode('32.73.01.1001');
console.log(village.name); // "CAMPAKA"
console.log(village.postalCode); // "KODE_32.73.01.1001"
```

## Lisensi

[MIT](LICENSE)
