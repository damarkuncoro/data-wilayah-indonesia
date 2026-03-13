# Postal Code Plugin for Data Wilayah Indonesia

[![NPM version](https://img.shields.io/npm/v/@damarkuncoro/postal-code-indonesia.svg)](https://www.npmjs.com/package/@damarkuncoro/postal-code-indonesia)

Plugin untuk paket `@damarkuncoro/data-wilayah-indonesia` yang berfungsi untuk memperkaya data wilayah dengan informasi kode pos yang akurat.

## Fitur Utama

- **Lazy Loading Granular**: Untuk efisiensi maksimum, data kode pos dimuat secara dinamis per **kabupaten/kota** sesuai kebutuhan. Ini memastikan tidak ada data yang tidak perlu diunduh oleh pengguna.
- **Integrasi Mulus**: Bekerja sebagai plugin yang mudah digunakan dengan `DataWilayahService`.
- **Ringan**: Tidak menambah beban signifikan pada ukuran bundle awal aplikasi Anda berkat arsitektur *on-demand*.

## Instalasi

Paket ini memiliki `peerDependency` pada `@damarkuncoro/data-wilayah-indonesia`. Anda perlu menginstal keduanya:

```bash
npm install @damarkuncoro/data-wilayah-indonesia @damarkuncoro/postal-code-indonesia
```

## Penggunaan

Cukup buat instance `PostalCodePlugin` dan masukkan ke dalam konstruktor `DataWilayahService`.

```typescript
import { DataWilayahService } from '@damarkuncoro/data-wilayah-indonesia';
import { PostalCodePlugin } from '@damarkuncoro/postal-code-indonesia';

// 1. Buat instance plugin
const postalCodePlugin = new PostalCodePlugin();

// 2. Masukkan plugin ke dalam service
const service = new DataWilayahService(undefined, [postalCodePlugin]);

// 3. Gunakan service seperti biasa
// Secara otomatis, data kode pos akan dimuat saat Anda mengambil data desa.
const villages = await service.fetchVillagesByDistrict('32.73.01'); // Kecamatan Coblong

// Setiap desa sekarang akan memiliki properti `postalCode`
for (const village of villages) {
  console.log(`${village.name}: ${village.postalCode}`);
}

// Contoh output:
// CIPAGANTI: 40131
// DAGO: 40135
// ...dan seterusnya
```

Metode `enrichVillages` dari plugin akan dipanggil secara otomatis oleh `DataWilayahService` setiap kali data desa dimuat.

## Lisensi

[MIT](LICENSE)
