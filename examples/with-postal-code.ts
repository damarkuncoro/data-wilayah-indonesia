import { DataWilayahService } from '@damarkuncoro/data-wilayah-indonesia';
import { PostalCodePlugin } from '@damarkuncoro/postal-code-indonesia';

// Contoh ini menunjukkan cara menggunakan `DataWilayahService` dengan `PostalCodePlugin`
// untuk mendapatkan data wilayah yang sudah diperkaya dengan kode pos.

async function main() {
  // 1. Buat instance dari plugin kode pos
  const postalCodePlugin = new PostalCodePlugin();

  // 2. Buat instance `DataWilayahService` dan masukkan plugin ke dalamnya
  const service = new DataWilayahService(undefined, [postalCodePlugin]);

  // 3. Panggil metode `fetch` seperti biasa.
  // Plugin akan secara otomatis dipanggil untuk memperkaya data.
  const districtCode = '32.73.01'; // Kecamatan Coblong, Kota Bandung
  console.log(`Mencari desa dengan kode pos untuk Kecamatan ${districtCode}...`);

  const villages = await service.fetchVillagesByDistrict(districtCode);

  console.log(`Ditemukan ${villages.length} desa:`);
  for (const village of villages) {
    // Perhatikan properti `postalCode` yang ditambahkan oleh plugin
    console.log(`- ${village.name} (Kode Pos: ${village.postalCode})`);
  }
}

main().catch(console.error);
