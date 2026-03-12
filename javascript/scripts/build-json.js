/**
 * Script untuk mengkonversi CSV ke JSON untuk package npm
 */

const fs = require('fs');
const path = require('path');

// Read CSV file
function readCSV(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n').filter(line => line.trim());
  
  // Parse header
  const headers = lines[0].split(',');
  
  // Parse rows
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    if (values.length >= 2) {
      const row = {};
      headers.forEach((header, index) => {
        row[header.trim()] = values[index] ? values[index].trim() : '';
      });
      rows.push(row);
    }
  }
  
  return rows;
}

// Simple CSV parser that handles quoted fields
function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current);
  
  return result;
}

// Filter and transform data
function processData(csvData) {
  const provinces = [];
  const regencies = [];
  const districts = [];
  const villages = [];
  
  // Known patterns to exclude (metadata, headers, etc.)
  const excludePatterns = [
    'luas wilayah', 'uu no', 'perubahan nama', 'sesuai surat', 'surat sekda',
    'luas', 'tentang', 'sesuai:', 'qanun', 'peraturan', 'perubahan',
    'tidak ada', 'district', 'kode', 'nama', 'pp no', 'pp mo', 'kepmendagri',
    'perda', 'pemekaran', 'perbaikan nama', 'semula wil', 'validasi ditjen',
    'rakernis', 'hasil pemetaan'
  ];
  
  // Check if name should be excluded
  function shouldExclude(name) {
    if (!name || name === '-' || name.trim() === '') return true;
    // Also exclude if name is purely numeric (like "2,028")
    if (/^[\d,\.]+$/.test(name)) return true;
    const lowerCaseName = name.toLowerCase();
    return excludePatterns.some(pattern => lowerCaseName.includes(pattern));
  }
  
  // Check if code is valid (should match pattern XX, XX.XX, XX.XX.XX, XX.XX.XX.XXXX)
  function isValidCode(code) {
    if (!code) return false;
    // Must match pattern like: 11, 11.01, 11.01.01, 11.01.01.1001
    return /^\d{2}(\.\d{2}){0,2}(\.\d{4})?$/.test(code);
  }
  
  // Helper to format name to Title Case
  function toTitleCase(str) {
    if (!str) return '';
    return str.toLowerCase().split(' ').map(word => {
      return word.charAt(0).toUpperCase() + word.slice(1);
    }).join(' ');
  }

  const provinceNames = {
    '11': 'Aceh',
    '12': 'Sumatera Utara',
    '13': 'Sumatera Barat',
    '14': 'Riau',
    '15': 'Jambi',
    '16': 'Sumatera Selatan',
    '17': 'Bengkulu',
    '18': 'Lampung',
    '19': 'Kepulauan Bangka Belitung',
    '21': 'Kepulauan Riau',
    '31': 'DKI Jakarta',
    '32': 'Jawa Barat',
    '33': 'Jawa Tengah',
    '34': 'Daerah Istimewa Yogyakarta',
    '35': 'Jawa Timur',
    '36': 'Banten',
    '51': 'Bali',
    '52': 'Nusa Tenggara Barat',
    '53': 'Nusa Tenggara Timur',
    '61': 'Kalimantan Barat',
    '62': 'Kalimantan Tengah',
    '63': 'Kalimantan Selatan',
    '64': 'Kalimantan Timur',
    '65': 'Kalimantan Utara',
    '71': 'Sulawesi Utara',
    '72': 'Sulawesi Tengah',
    '73': 'Sulawesi Selatan',
    '74': 'Sulawesi Tenggara',
    '75': 'Gorontalo',
    '76': 'Sulawesi Barat',
    '81': 'Maluku',
    '82': 'Maluku Utara',
    '91': 'Papua',
    '92': 'Papua Barat',
    '93': 'Papua Selatan',
    '94': 'Papua Tengah',
    '95': 'Papua Pegunungan',
    '96': 'Papua Barat Daya'
  };

  const regencyNames = {
    '11.02': 'Aceh Tenggara',
    '11.04': 'Aceh Tengah',
    '11.08': 'Aceh Utara',
    '31.01': 'Kepulauan Seribu',
    '31.71': 'Jakarta Pusat',
    '31.72': 'Jakarta Utara',
    '31.73': 'Jakarta Barat',
    '31.74': 'Jakarta Selatan',
    '31.75': 'Jakarta Timur'
  };

  let districtNames = {};
  
  // Load corrected Aceh data if available
  const acehDistrictsPath = path.join(__dirname, 'aceh_districts_corrected.json');
  if (fs.existsSync(acehDistrictsPath)) {
    console.log('[INFO] Loading corrected Aceh district names.');
    districtNames = JSON.parse(fs.readFileSync(acehDistrictsPath, 'utf-8'));
  }
  const acehVillagesPath = path.join(__dirname, 'aceh_villages_corrected.json');
  if (fs.existsSync(acehVillagesPath)) {
    console.log('[INFO] Loading corrected Aceh village names.');
    const acehVillages = JSON.parse(fs.readFileSync(acehVillagesPath, 'utf-8'));
    for (const code in acehVillages) {
      const name = acehVillages[code];
      if (!shouldExclude(name)) {
        villages.push({ code, name, districtCode: code.substring(0, 8), type: 'DESA' });
      }
    }
  }

  for (const row of csvData) {
    const code = row.code;
    const name = row.name;
    
    if (!isValidCode(code) || shouldExclude(name)) {
      continue;
    }
    
    const cleanName = name.replace(/^\d+\s*/, '').replace(/\s+/g, ' ').trim();
    const codeParts = code.split('.');
    
    if (codeParts.length === 3) {
      // If the name contains "Kecamatan" or "Kec", extract the real name
      const match = cleanName.match(/(?:Kecamatan|Kec\.?)\s+(.+)/i);
      if (match) {
        districtNames[code] = toTitleCase(match[1]);
      } else if (cleanName !== '-' && !districtNames[code]) {
        districtNames[code] = toTitleCase(cleanName);
      }
    }
    
    if (codeParts.length === 4) { // Process villages last as fallback for district names
      const districtCode = `${codeParts[0]}.${codeParts[1]}.${codeParts[2]}`;
      // ONLY use village name as fallback for NON-ACEH districts where name is still missing
      if (!districtNames[districtCode] && !districtCode.startsWith('11.')) {
        districtNames[districtCode] = cleanName; 
      }
    }
  }

  // Pre-pass to collect all regency names from CSV
  console.log('Pre-pass: Collecting all regency names...');
  const allRegencyNames = new Map();
  for (const row of csvData) {
    const codeParts = row.code.split('.');
    if (codeParts.length === 2) {
      const cleanName = toTitleCase(row.name.replace(/^\d+\s*/, '').replace(/\s+/g, ' ').trim());
      if (cleanName.toLowerCase().includes('luas wilayah')) continue; // Skip invalid names
      const finalName = toTitleCase(cleanName.replace(/^(KABUPATEN|KAB\.|KOTA ADM\.|KOTA)\s*/i, '').trim());
      allRegencyNames.set(row.code, finalName);
    }
  }

  // PASS 1: Collect all raw data
  console.log('PASS 1: Collecting raw data...');
  for (const row of csvData) {
    const code = row.code;
    const name = row.name;
    
    if (!isValidCode(code)) {
      continue;
    }

    const cleanName = toTitleCase(name.replace(/^\d+\s*/, '').replace(/\s+/g, ' ').trim());
    const codeParts = code.split('.');

    if (codeParts.length === 1) {
      const provinceName = provinceNames[code];
      if (provinceName) {
        provinces.push({ code, name: provinceName });
      }
    } else if (codeParts.length === 2) {
      const regencyName = regencyNames[code] || cleanName;
      if (shouldExclude(regencyName)) continue;
      const provinceCode = codeParts[0];
      const type = regencyName.toUpperCase().startsWith('KOTA') ? 'KOTA' : 'KABUPATEN';
      const isHardcoded = !!regencyNames[code];
      regencies.push({
        code,
        name: isHardcoded ? regencyName : toTitleCase(regencyName.replace(/^(KABUPATEN|KAB\.|KOTA ADM\.|KOTA)\s*/i, '').trim()),
        provinceCode,
        type
      });
    } else if (codeParts.length === 3) {
      const districtName = districtNames[code] || cleanName;
      if (shouldExclude(districtName)) continue;
      const regencyCode = `${codeParts[0]}.${codeParts[1]}`;
      const finalName = toTitleCase(districtName.replace(/^(KECAMATAN|KEC\.)\s*/i, '').trim());
      districts.push({ code, name: finalName, regencyCode });
    } else if (codeParts.length === 4 && !shouldExclude(name)) {
      const districtCode = `${codeParts[0]}.${codeParts[1]}.${codeParts[2]}`;
      const type = codeParts[3].startsWith('1') ? 'KELURAHAN' : 'DESA';
      villages.push({ code, name: cleanName, districtCode, type });
    }
  }

  // PASS 2: Enrich with hierarchy metadata
  console.log('PASS 2: Enriching data with hierarchy metadata...');
  
  const provinceMap = new Map(provinces.map(p => [p.code, p.name]));

  const enrichedRegencies = regencies.map(r => ({
    ...r,
    provinceName: provinceMap.get(r.provinceCode) || ''
  }));

  const regencyMap = new Map(regencies.map(r => [r.code, r.name]));
  const districtMap = new Map(districts.map(d => [d.code, d.name]));

  const enrichedDistricts = districts.map(d => ({
    ...d,
    provinceName: provinceMap.get(d.regencyCode.substring(0, 2)) || '',
    regencyName: regencyMap.get(d.regencyCode) || ''
  }));

  const enrichedVillages = villages.map(v => ({
    ...v,
    provinceName: provinceMap.get(v.districtCode.substring(0, 2)) || '',
    regencyName: regencyMap.get(v.districtCode.substring(0, 5)) || '',
    districtName: districtMap.get(v.districtCode) || ''
  }));
  
  // Remove duplicates
  const uniqueProvinces = Array.from(new Map(provinces.map(p => [p.code, p])).values());
  const uniqueRegencies = Array.from(new Map(enrichedRegencies.map(r => [r.code, r])).values());
  const uniqueDistricts = Array.from(new Map(enrichedDistricts.map(d => [d.code, d])).values());
  const uniqueVillages = Array.from(new Map(enrichedVillages.map(v => [v.code, v])).values());

  return { provinces: uniqueProvinces, regencies: uniqueRegencies, districts: uniqueDistricts, villages: uniqueVillages };
}

// Main
const baseDataDir = path.join(__dirname, '..', 'data', 'base');
const tsDataDir = path.join(__dirname, '..', 'src', 'data', 'base');
const csvPath = path.join(__dirname, '..', '..', 'data', 'indonesia_administrative_data.csv');

// Create data directory if not exists
if (!fs.existsSync(baseDataDir)) {
  fs.mkdirSync(baseDataDir, { recursive: true });
}

const villagesDataDir = path.join(__dirname, '..', 'data', 'villages');
if (!fs.existsSync(villagesDataDir)) {
  fs.mkdirSync(villagesDataDir, { recursive: true });
}

// Create TS data directory if not exists
if (!fs.existsSync(tsDataDir)) {
  fs.mkdirSync(tsDataDir, { recursive: true });
}

console.log('Reading CSV data...');
const csvData = readCSV(csvPath);
console.log(`Read ${csvData.length} rows from CSV`);

console.log('Processing data...');
const { provinces, regencies, districts, villages } = processData(csvData);
console.log(`Provinces: ${provinces.length}`);
console.log(`Regencies: ${regencies.length}`);
console.log(`Districts: ${districts.length}`);
console.log(`Villages: ${villages.length}`);

// Write JSON files
console.log('Writing JSON files...');
fs.writeFileSync(path.join(baseDataDir, 'provinces.json'), JSON.stringify(uniqueProvinces, null, 2));
fs.writeFileSync(path.join(baseDataDir, 'regencies.json'), JSON.stringify(uniqueRegencies, null, 2));
fs.writeFileSync(path.join(baseDataDir, 'districts.json'), JSON.stringify(districts, null, 2));
fs.writeFileSync(path.join(baseDataDir, 'villages.json'), JSON.stringify(villages, null, 2));

// Write split village JSON files by province
console.log('Writing split village JSON files...');
const villagesByProvince = {};
villages.forEach(v => {
  const provinceCode = v.code.substring(0, 2);
  if (!villagesByProvince[provinceCode]) {
    villagesByProvince[provinceCode] = [];
  }
  villagesByProvince[provinceCode].push(v);
});

for (const provinceCode in villagesByProvince) {
  fs.writeFileSync(
    path.join(villagesDataDir, `${provinceCode}.json`),
    JSON.stringify(villagesByProvince[provinceCode], null, 2)
  );
}

// Write TS files
console.log('Writing TS files...');
function writeTSFile(fileName, data, interfaceName) {
  const tsPath = path.join(tsDataDir, `${fileName}.ts`);
  const content = `import type { ${interfaceName} } from '../types';\n\nexport const ${fileName}: ${interfaceName}[] = ${JSON.stringify(data, null, 2)};\n`;
  fs.writeFileSync(tsPath, content);
}

writeTSFile('provinces', provinces, 'Province');
writeTSFile('regencies', regencies, 'Regency');
writeTSFile('districts', districts, 'District');
writeTSFile('villages', villages, 'Village');

console.log('Done!');