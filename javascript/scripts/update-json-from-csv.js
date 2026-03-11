const fs = require('fs');
const path = require('path');
const csv = require('fs').readFileSync(path.join(__dirname, '../../data/indonesia_administrative_data.csv'), 'utf8');

const lines = csv.split('\n').slice(1); // Skip header
const data = lines.filter(line => line.trim()).map(line => {
  // Simple regex to handle potential commas inside quotes
  const matches = line.match(/(".*?"|[^,]+)/g);
  if (matches && matches.length >= 2) {
    const code = matches[0].replace(/"/g, '').trim();
    const name = matches[1].replace(/"/g, '').trim();
    return { code, name };
  }
  return null;
}).filter(item => item !== null);

const provinces = [];
const regencies = [];
const districts = [];
const villages = [];

data.forEach(item => {
  const { code, name } = item;
  const parts = code.split('.');
  
  if (parts.length === 1) {
    provinces.push({ code, name });
  } else if (parts.length === 2) {
    regencies.push({ 
      code, 
      name, 
      provinceCode: parts[0],
      type: name.toUpperCase().includes('KOTA') ? 'KOTA' : 'KABUPATEN'
    });
  } else if (parts.length === 3) {
    districts.push({ 
      code, 
      name, 
      regencyCode: `${parts[0]}.${parts[1]}` 
    });
  } else if (parts.length === 4) {
    villages.push({ 
      code, 
      name, 
      districtCode: `${parts[0]}.${parts[1]}.${parts[2]}`,
      type: parts[3].startsWith('1') ? 'KELURAHAN' : 'DESA'
    });
  }
});

const outputDir = path.join(__dirname, '../data');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

fs.writeFileSync(path.join(outputDir, 'provinces.json'), JSON.stringify(provinces, null, 2));
fs.writeFileSync(path.join(outputDir, 'regencies.json'), JSON.stringify(regencies, null, 2));
fs.writeFileSync(path.join(outputDir, 'districts.json'), JSON.stringify(districts, null, 2));
fs.writeFileSync(path.join(outputDir, 'villages.json'), JSON.stringify(villages, null, 2));

console.log('JSON data updated successfully from CSV.');
console.log(`Provinces: ${provinces.length}`);
console.log(`Regencies: ${regencies.length}`);
console.log(`Districts: ${districts.length}`);
console.log(`Villages: ${villages.length}`);
