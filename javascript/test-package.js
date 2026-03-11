const { DataWilayahService } = require('./dist/index');

function test() {
  const service = new DataWilayahService();

  // 1. Get all provinces
  const provinces = service.getAllProvinces();
  console.log(`Total Provinces: ${provinces.length}`);
  console.log('Sample Provinces:', provinces.slice(0, 5).map(p => `[${p.code}] ${p.name}`));

  // 2. Find DKI Jakarta (assuming code 31)
  const jakartaCode = '31';
  const jakarta = service.getProvinceByCode(jakartaCode);
  if (jakarta) {
    console.log(`\nFound: [${jakarta.code}] ${jakarta.name}`);
    
    const regencies = service.getRegenciesByProvince(jakartaCode);
    console.log(`Regencies in Jakarta: ${regencies.length}`);
    regencies.forEach(r => console.log(`- [${r.code}] ${r.name} (${r.type})`));
  } else {
    console.log('\nDKI Jakarta not found with code 31');
  }

  // 3. Search by name
  const search = 'Bandung';
  const results = service.findProvincesByName(search);
  console.log(`\nSearch for "${search}" in provinces: ${results.length}`);
}

try {
  test();
} catch (e) {
  console.error('Test failed:', e.message);
}
