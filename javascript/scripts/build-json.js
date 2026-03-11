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
  
  const provinceNames = {
    '11': 'ACEH',
    '12': 'SUMATERA UTARA',
    '13': 'SUMATERA BARAT',
    '14': 'RIAU',
    '15': 'JAMBI',
    '16': 'SUMATERA SELATAN',
    '17': 'BENGKULU',
    '18': 'LAMPUNG',
    '19': 'KEPULAUAN BANGKA BELITUNG',
    '21': 'KEPULAUAN RIAU',
    '31': 'DKI JAKARTA',
    '32': 'JAWA BARAT',
    '33': 'JAWA TENGAH',
    '34': 'DAERAH ISTIMEWA YOGYAKARTA',
    '35': 'JAWA TIMUR',
    '36': 'BANTEN',
    '51': 'BALI',
    '52': 'NUSA TENGGARA BARAT',
    '53': 'NUSA TENGGARA TIMUR',
    '61': 'KALIMANTAN BARAT',
    '62': 'KALIMANTAN TENGAH',
    '63': 'KALIMANTAN SELATAN',
    '64': 'KALIMANTAN TIMUR',
    '65': 'KALIMANTAN UTARA',
    '71': 'SULAWESI UTARA',
    '72': 'SULAWESI TENGAH',
    '73': 'SULAWESI SELATAN',
    '74': 'SULAWESI TENGGARA',
    '75': 'GORONTALO',
    '76': 'SULAWESI BARAT',
    '81': 'MALUKU',
    '82': 'MALUKU UTARA',
    '91': 'PAPUA',
    '92': 'PAPUA BARAT',
    '93': 'PAPUA SELATAN',
    '94': 'PAPUA TENGAH',
    '95': 'PAPUA PEGUNUNGAN',
    '96': 'PAPUA BARAT DAYA'
  };

  const regencyNames = {
    '31.01': 'KABUPATEN ADM. KEPULAUAN SERIBU',
    '31.71': 'KOTA ADM. JAKARTA PUSAT',
    '31.72': 'KOTA ADM. JAKARTA UTARA',
    '31.73': 'KOTA ADM. JAKARTA BARAT',
    '31.74': 'KOTA ADM. JAKARTA SELATAN',
    '31.75': 'KOTA ADM. JAKARTA TIMUR'
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
        districtNames[code] = match[1].toUpperCase();
      } else if (cleanName !== '-' && !districtNames[code]) {
        districtNames[code] = cleanName.toUpperCase();
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

  for (const row of csvData) {
    const code = row.code;
    const name = row.name;
    
    if (!isValidCode(code)) {
      continue;
    }

    const cleanName = name.replace(/^\d+\s*/, '').replace(/\s+/g, ' ').trim();
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
        name: isHardcoded ? regencyName : regencyName.replace(/^(KABUPATEN|KAB\.|KOTA ADM\.|KOTA)\s*/i, '').trim(),
        provinceCode,
        type
      });
    } else if (codeParts.length === 3) {
      const districtName = districtNames[code] || cleanName;
      if (shouldExclude(districtName)) continue;
      const regencyCode = `${codeParts[0]}.${codeParts[1]}`;
      districts.push({ code, name: districtName, regencyCode });
    } else if (codeParts.length === 4 && !shouldExclude(name)) {
      const districtCode = `${codeParts[0]}.${codeParts[1]}.${codeParts[2]}`;
      const type = codeParts[3].startsWith('1') ? 'KELURAHAN' : 'DESA';
      villages.push({ code, name: cleanName, districtCode, type });
    }
  }
  
  // Remove duplicates
  const uniqueProvinces = Array.from(new Map(provinces.map(p => [p.code, p])).values());
  const uniqueRegencies = Array.from(new Map(regencies.map(r => [r.code, r])).values());
  const uniqueDistricts = Array.from(new Map(districts.map(d => [d.code, d])).values());
  const uniqueVillages = Array.from(new Map(villages.map(v => [v.code, v])).values());

  return { provinces: uniqueProvinces, regencies: uniqueRegencies, districts: uniqueDistricts, villages: uniqueVillages };
}

// Main
const dataDir = path.join(__dirname, '..', 'data');
const tsDataDir = path.join(__dirname, '..', 'src', 'data');
const csvPath = path.join(__dirname, '..', '..', 'data', 'indonesia_administrative_data.csv');

// Create data directory if not exists
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
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
fs.writeFileSync(path.join(dataDir, 'provinces.json'), JSON.stringify(provinces, null, 2));
fs.writeFileSync(path.join(dataDir, 'regencies.json'), JSON.stringify(regencies, null, 2));
fs.writeFileSync(path.join(dataDir, 'districts.json'), JSON.stringify(districts, null, 2));
fs.writeFileSync(path.join(dataDir, 'villages.json'), JSON.stringify(villages, null, 2));

// Write TS files
console.log('Writing TS files...');
function writeTSFile(fileName, data, interfaceName) {
  const tsPath = path.join(tsDataDir, `${fileName}.ts`);
  const content = `import { ${interfaceName} } from '../core/entities';\n\nexport const ${fileName}: ${interfaceName}[] = ${JSON.stringify(data, null, 2)};\n`;
  fs.writeFileSync(tsPath, content);
}

writeTSFile('provinces', provinces, 'Province');
writeTSFile('regencies', regencies, 'Regency');
writeTSFile('districts', districts, 'District');
writeTSFile('villages', villages, 'Village');

console.log('Done!');