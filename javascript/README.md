# Data Wilayah Indonesia

Package JavaScript/TypeScript untuk data wilayah administratif Indonesia yang mencakup Provinsi, Kabupaten/Kota, Kecamatan, dan Desa/Kelurahan.

## Instalasi

```bash
npm install data-wilayah-indonesia
# atau
yarn add data-wilayah-indonesia
```

## Penggunaan

### TypeScript/JavaScript

```typescript
import { DataWilayahService, Province, Regency, District } from 'data-wilayah-indonesia';

// Inisialisasi service
const service = new DataWilayahService();

// Mendapatkan semua provinsi
const provinces: Province[] = service.getAllProvinces();
provinces.forEach(province => {
  console.log(`${province.code}: ${province.name}`);
});

// Mendapatkan kabupaten/kota berdasarkan kode provinsi
const regencies: Regency[] = service.getRegenciesByProvince("11"); // DKI Jakarta
regencies.forEach(regency => {
  console.log(`  ${regency.code}: ${regency.name} (${regency.type})`);
});

// Mendapatkan kecamatan berdasarkan kode kabupaten/kota
const districts: District[] = service.getDistrictsByRegency("11.01");
districts.forEach(district => {
  console.log(`    ${district.code}: ${district.name}`);
});

// Pencarian
const results = service.findProvincesByName("jawa");
console.log(results);
```

### Browser (UMD)

```html
<script src="https://unpkg.com/data-wilayah-indonesia/dist/index.umd.js"></script>
<script>
  const service = new DataWilayahIndonesia.DataWilayahService();
  const provinces = service.getAllProvinces();
  console.log(provinces);
</script>
```

## API

### DataWilayahService

Kelas utama untuk mengakses data wilayah Indonesia.

#### Metode

- `getAllProvinces(): Province[]` - Mendapatkan semua provinsi
- `getProvinceByCode(code: string): Province | undefined` - Mendapatkan provinsi berdasarkan kode
- `findProvincesByName(name: string): Province[]` - Mencari provinsi berdasarkan nama
- `getRegenciesByProvince(provinceCode: string): Regency[]` - Mendapatkan kabupaten/kota berdasarkan kode provinsi
- `getRegencyByCode(code: string): Regency | undefined` - Mendapatkan kabupaten/kota berdasarkan kode
- `findRegenciesByName(name: string): Regency[]` - Mencari kabupaten/kota berdasarkan nama
- `getDistrictsByRegency(regencyCode: string): District[]` - Mendapatkan kecamatan berdasarkan kode kabupaten/kota
- `getDistrictByCode(code: string): District | undefined` - Mendapatkan kecamatan berdasarkan kode
- `findDistrictsByName(name: string): District[]` - Mencari kecamatan berdasarkan nama
- `getVillagesByDistrict(districtCode: string): Village[]` - Mendapatkan desa/kelurahan berdasarkan kode kecamatan
- `getVillageByCode(code: string): Village | undefined` - Mendapatkan desa/kelurahan berdasarkan kode

### Tipe Data

#### Province
```typescript
interface Province {
  code: string;  // Kode provinsi (misal: "11")
  name: string;  // Nama provinsi
}
```

#### Regency
```typescript
interface Regency {
  code: string;           // Kode kabupaten/kota
  name: string;           // Nama kabupaten/kota
  provinceCode: string;   // Kode provinsi parent
  type: RegencyType;      // Tipe: "KABUPATEN" atau "KOTA"
}

enum RegencyType {
  KABUPATEN = "KABUPATEN",
  KOTA = "KOTA"
}
```

#### District
```typescript
interface District {
  code: string;        // Kode kecamatan
  name: string;         // Nama kecamatan
  regencyCode: string;  // Kode kabupaten/kota parent
}
```

#### Village
```typescript
interface Village {
  code: string;         // Kode desa/kelurahan
  name: string;         // Nama desa/kelurahan
  districtCode: string; // Kode kecamatan parent
  type: VillageType;    // Tipe: "DESA" atau "KELURAHAN"
}

enum VillageType {
  DESA = "DESA",
  KELURAHAN = "KELURAHAN"
}
```

## Lisensi

MIT License