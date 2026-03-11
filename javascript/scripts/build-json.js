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
  
  for (const row of csvData) {
    const code = row.code;
    const name = row.name;
    
    if (!code || !name || name.includes('Luas Wilayah') || name.includes('UU. No.') || name === '-' || name.includes('Perubahan nama')) {
      continue;
    }
    
    if (code.length === 2) {
      // Province
      provinces.push({ code, name });
    } else if (code.length === 5) {
      // Regency (Kabupaten/Kota)
      const provinceCode = code.substring(0, 2);
      const type = name.startsWith('KAB.') ? 'KABUPATEN' : 'KOTA';
      const cleanName = name.replace(/^(KAB\.|KOTA)\s*/i, '').trim();
      regencies.push({ 
        code, 
        name: cleanName, 
        provinceCode,
        type 
      });
    } else if (code.length === 8) {
      // District
      const regencyCode = code.substring(0, 5);
      districts.push({ code, name, regencyCode });
    } else if (code.length > 8) {
      // Village
      const districtCode = code.substring(0, 8);
      const type = name.startsWith('KEL.') ? 'KELURAHAN' : 'DESA';
      const cleanName = name.replace(/^(KEL\.|DESA)\s*/i, '').trim();
      villages.push({ code, name: cleanName, districtCode, type });
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