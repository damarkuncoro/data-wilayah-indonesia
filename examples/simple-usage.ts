import {
  getAllProvinces,
  getRegenciesByProvince,
  getDistrictsByRegency,
} from '@damarkuncoro/data-wilayah-indonesia';

// Contoh ini menunjukkan cara menggunakan fungsi dasar untuk mendapatkan data
// yang sudah termasuk dalam bundle utama (tanpa lazy loading).

// 1. Dapatkan semua provinsi
const allProvinces = getAllProvinces();
console.log(`Total Provinsi: ${allProvinces.length}`);
console.log('Contoh Provinsi:', allProvinces[0]);

console.log('\n--------------------\n');

// 2. Dapatkan semua kabupaten/kota di provinsi Jawa Barat (kode: 32)
const provinceCode = '32';
const regenciesInJabar = getRegenciesByProvince(provinceCode);
console.log(`Total Kabupaten/Kota di Jawa Barat: ${regenciesInJabar.length}`);
console.log('Contoh Kabupaten/Kota:', regenciesInJabar[0]);

console.log('\n--------------------\n');

// 3. Dapatkan semua kecamatan di Kota Bandung (kode: 32.73)
const regencyCode = '32.73';
const districtsInBandung = getDistrictsByRegency(regencyCode);
console.log(`Total Kecamatan di Kota Bandung: ${districtsInBandung.length}`);
console.log('Contoh Kecamatan:', districtsInBandung[0]);
