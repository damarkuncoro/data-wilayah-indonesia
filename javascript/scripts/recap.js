const { DataWilayahService, RegencyType, VillageType } = require('../dist/index.js');

/**
 * Script untuk membuat rekapitulasi data wilayah administrasi per provinsi.
 */
function createRecap() {
  console.log('Membuat rekapitulasi data wilayah...');
  const service = new DataWilayahService();

  const allProvinces = service.getAllProvinces();
  const allRegencies = service.getAllRegencies ? service.getAllRegencies() : [];
  const allDistricts = service.getAllDistricts ? service.getAllDistricts() : [];
  const allVillages = service.getAllVillages ? service.getAllVillages() : [];

  const recap = allProvinces.map(province => {
    const regenciesInProvince = allRegencies.filter(r => r.provinceCode === province.code);
    const regencyCodes = regenciesInProvince.map(r => r.code);

    const districtsInProvince = allDistricts.filter(d => regencyCodes.includes(d.regencyCode));
    const districtCodes = districtsInProvince.map(d => d.code);

    const villagesInProvince = allVillages.filter(v => districtCodes.includes(v.districtCode));

    return {
      provinceCode: province.code,
      provinceName: province.name,
      kabupaten: regenciesInProvince.filter(r => r.type === RegencyType.KABUPATEN).length,
      kota: regenciesInProvince.filter(r => r.type === RegencyType.KOTA).length,
      kecamatan: districtsInProvince.length,
      desa: villagesInProvince.filter(v => v.type === VillageType.DESA).length,
      kelurahan: villagesInProvince.filter(v => v.type === VillageType.KELURAHAN).length,
    };
  });

  // Tampilkan dalam format tabel
  console.log('\n--- REKAPITULASI KODE DAN DATA WILAYAH ADMINISTRASI PEMERINTAHAN PER PROVINSI ---');
  console.table(recap);
}

// Tambahkan method pembantu ke service jika belum ada
function extendService() {
  const service = new DataWilayahService();
  if (!service.getAllRegencies) {
    DataWilayahService.prototype.getAllRegencies = function() { return this.regencyRepo.getAll(); };
  }
  if (!service.getAllDistricts) {
    DataWilayahService.prototype.getAllDistricts = function() { return this.districtRepo.getAll(); };
  }
  if (!service.getAllVillages) {
    DataWilayahService.prototype.getAllVillages = function() { return this.villageRepo.getAll(); };
  }
}

try {
  extendService();
  createRecap();
} catch (e) {
  console.error('Gagal membuat rekapitulasi:', e.message);
}
