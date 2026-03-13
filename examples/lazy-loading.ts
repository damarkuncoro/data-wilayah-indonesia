import { fetchVillagesByDistrict } from '@damarkuncoro/data-wilayah-indonesia';

// Contoh ini menunjukkan cara kerja lazy loading.
// Saat `fetchVillagesByDistrict` dipanggil, hanya file data untuk provinsi
// yang bersangkutan yang akan dimuat, bukan seluruh data desa di Indonesia.

async function main() {
  const districtCode = '32.73.01'; // Kecamatan Coblong, Kota Bandung
  console.log(`Mencari desa untuk Kecamatan dengan kode: ${districtCode}...`);

  const villages = await fetchVillagesByDistrict(districtCode);

  console.log(`Ditemukan ${villages.length} desa:`);
  for (const village of villages) {
    console.log(`- ${village.name}`);
  }

  console.log('\n--------------------\n');

  // Perhatikan bagaimana setiap objek desa juga diperkaya dengan nama induknya
  const firstVillage = villages[0];
  console.log('Detail Desa Pertama:');
  console.log(`  Nama: ${firstVillage.name}`);
  console.log(`  Kecamatan: ${firstVillage.districtName}`);
  console.log(`  Kab/Kota: ${firstVillage.regencyName}`);
  console.log(`  Provinsi: ${firstVillage.provinceName}`);
}

main().catch(console.error);
