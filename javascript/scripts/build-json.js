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
    const lowerName = name.toLowerCase();
    // Also exclude if name is purely numeric (like "2,028")
    if (/^[\d,\.]+$/.test(name)) return true;
    return excludePatterns.some(pattern => lowerName.includes(pattern.toLowerCase()));
  }
  
  // Check if code is valid (should match pattern XX, XX.XX, XX.XX.XX, XX.XX.XX.XXXX or more)
  function isValidCode(code) {
    if (!code) return false;
    // Must match pattern like: 11, 11.01, 11.01.01, 11.01.01.1001, 11.01.01.1001.2002
    return /^(\d{2}|\d{2}\.\d{2}|\d{2}\.\d{2}\.\d{2}|\d{2}\.\d{2}\.\d{2}\.\d+)$/.test(code);
  }
  
  for (const row of csvData) {
    const code = row.code;
    const name = row.name;
    
    // Skip invalid entries
    if (!isValidCode(code) || shouldExclude(name)) {
      continue;
    }
    
    // Clean name - remove extra whitespace
    const cleanName = name.replace(/\s+/g, ' ').trim();
    
    const codeParts = code.split('.');
    
    if (codeParts.length === 1) {
      // Province (e.g., "11")
      // Check for duplicate province codes
      const existing = provinces.find(p => p.code === code);
      if (!existing) {
        provinces.push({ code, name: cleanName });
      }
    } else if (codeParts.length === 2) {
      // Regency (Kabupaten/Kota) - e.g., "11.01"
      const provinceCode = codeParts[0];
      const type = cleanName.toUpperCase().startsWith('KABUPATEN') || cleanName.toUpperCase().startsWith('KAB.')
        ? 'KABUPATEN'
        : 'KOTA';
      const regencyName = cleanName.replace(/^(KABUPATEN|KAB\.|KOTA)\s*/i, '').trim();
      regencies.push({
        code,
        name: regencyName,
        provinceCode,
        type
      });
    } else if (codeParts.length === 3) {
      // District - e.g., "11.01.01"
      const regencyCode = `${codeParts[0]}.${codeParts[1]}`;
      districts.push({ code, name: cleanName, regencyCode });
    } else if (codeParts.length === 4) {
      // Village - e.g., "11.01.01.1001"
      const districtCode = `${codeParts[0]}.${codeParts[1]}.${codeParts[2]}`;
      const type = cleanName.toUpperCase().startsWith('KELURAHAN') || cleanName.toUpperCase().startsWith('KEL.')
        ? 'KELURAHAN'
        : 'DESA';
      const villageName = cleanName.replace(/^(KELURAHAN|KEL\.|DESA)\s*/i, '').trim();
      villages.push({ code, name: villageName, districtCode, type });
    }
  }
  
  return { provinces, regencies, districts, villages };
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