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
  
  // Known patterns to exclude
  const excludePatterns = [
    'Luas Wilayah',
    'UU. No.',
    'Perubahan nama',
    'Sesuai Surat',
    'Surat Sekda',
    'luas',
    'tentang',
    'sesuai:',
    'qanun',
    'peraturan',
    'perubahan',
    'tidak ada',
    'district',
    'kabupaten',
    'kota'
  ];
  
  // Check if name should be excluded
  function shouldExclude(name) {
    if (!name || name === '-' || name.trim() === '') return true;
    // Also exclude if name is purely numeric (like "2,028")
    if (/^[\d,\.]+$/.test(name)) return true;
    return excludePatterns.some(pattern => name.toLowerCase().startsWith(pattern.toLowerCase()));
  }
  
  // Check if code is valid (should match pattern XX, XX.XX, XX.XX.XX, XX.XX.XX.XXXX)
  function isValidCode(code) {
    if (!code) return false;
    // Must match pattern like: 11, 11.01, 11.01.01, 11.01.01.1001
    return /^\d{2}(\.\d{2}){0,2}(\.\d{4})?$/.test(code);
  }
  
  const regencyNames = {
    '31.71': 'KOTA ADM. JAKARTA PUSAT',
    '31.72': 'KOTA ADM. JAKARTA UTARA',
    '31.73': 'KOTA ADM. JAKARTA BARAT',
    '31.74': 'KOTA ADM. JAKARTA SELATAN',
    '31.75': 'KOTA ADM. JAKARTA TIMUR',
    '31.01': 'KAB. ADM. KEP. SERIBU'
  };

  const districtNames = {};

  for (const row of csvData) {
    const code = row.code;
    const name = row.name;
    
    if (!isValidCode(code) || shouldExclude(name)) {
      continue;
    }
    
    const cleanName = name.replace(/^\d+\s*/, '').replace(/\s+/g, ' ').trim();
    const codeParts = code.split('.');
    
    if (codeParts.length === 4) { // Process villages first to get district names
      const districtCode = `${codeParts[0]}.${codeParts[1]}.${codeParts[2]}`;
      if (!districtNames[districtCode]) {
        districtNames[districtCode] = cleanName; // Use first village name as a proxy for district
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

    if (codeParts.length === 1 && !shouldExclude(name)) {
      provinces.push({ code, name: cleanName });
    } else if (codeParts.length === 2) {
      const regencyName = regencyNames[code] || cleanName;
      if (shouldExclude(regencyName)) continue;
      const provinceCode = codeParts[0];
      const type = regencyName.toUpperCase().startsWith('KOTA') ? 'KOTA' : 'KABUPATEN';
      regencies.push({
        code,
        name: regencyName.replace(/^(KABUPATEN|KAB\.|KOTA ADM\.|KOTA)\s*/i, '').trim(),
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
const csvPath = path.join(__dirname, '..', '..', 'data', 'indonesia_administrative_data.csv');

// Create data directory if not exists
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
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

console.log('Done!');