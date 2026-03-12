const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '..', 'data', 'base');
const provinces = require(path.join(dataDir, 'provinces.json'));
const regencies = require(path.join(dataDir, 'regencies.json'));
const districts = require(path.join(dataDir, 'districts.json'));
const villages = require(path.join(dataDir, 'villages.json'));
const postalCodes = fs.existsSync(path.join(dataDir, 'postal-codes.json')) 
  ? require(path.join(dataDir, 'postal-codes.json')) 
  : {};

function validateData() {
  const errors = [];
  const warnings = [];

  console.log('--- START DATA AUDIT ---');

  // 1. Check for Duplicate Codes
  function checkDuplicates(data, type) {
    const codes = new Set();
    data.forEach(item => {
      if (codes.has(item.code)) {
        errors.push(`[DUPLICATE] ${type} code found: ${item.code} (${item.name})`);
      }
      codes.add(item.code);
    });
  }

  checkDuplicates(provinces, 'PROVINCE');
  checkDuplicates(regencies, 'REGENCY');
  checkDuplicates(districts, 'DISTRICT');
  checkDuplicates(villages, 'VILLAGE');

  // 2. Check for Parent-Child Integrity (Orphan Records)
  const provinceCodes = new Set(provinces.map(p => p.code));
  const regencyCodes = new Set(regencies.map(r => r.code));
  const districtCodes = new Set(districts.map(d => d.code));

  const missingDistricts = new Set();

  regencies.forEach(r => {
    if (!provinceCodes.has(r.provinceCode)) {
      errors.push(`[ORPHAN] Regency ${r.name} (${r.code}) has invalid provinceCode: ${r.provinceCode}`);
    }
    if (!r.name || r.name.startsWith('Kabupaten ') || r.name.startsWith('Kota ')) {
      warnings.push(`[REGENCY NAME] Invalid or placeholder name for regency: ${r.name} (${r.code})`);
    }
  });

  districts.forEach(d => {
    if (!regencyCodes.has(d.regencyCode)) {
      errors.push(`[ORPHAN] District ${d.name} (${d.code}) has invalid regencyCode: ${d.regencyCode}`);
    }
  });

  villages.forEach(v => {
    if (!districtCodes.has(v.districtCode)) {
      missingDistricts.add(v.districtCode);
      errors.push(`[ORPHAN] Village ${v.name} (${v.code}) has invalid districtCode: ${v.districtCode}`);
    }
  });

  if (missingDistricts.size > 0) {
    console.log('\n--- MISSING DISTRICT CODES ---');
    console.log(Array.from(missingDistricts).sort().join(', '));
  }

  // 3. Check for Naming Standards (Title Case)
  function isTitleCase(str) {
    if (!str) return true;
    // Simple check: first letter should be uppercase
    const words = str.split(' ');
    return words.every(word => {
      if (word.length === 0) return true;
      // Exceptions for small words like 'di', 'ke', etc. if needed, 
      // but Indonesian administrative names are usually Title Case for everything
      return word[0] === word[0].toUpperCase();
    });
  }

  function checkNaming(data, type) {
    data.forEach(item => {
      if (!isTitleCase(item.name)) {
        warnings.push(`[NAMING] ${type} name might not be Title Case: "${item.name}" (${item.code})`);
      }
    });
  }

  // checkNaming(provinces, 'PROVINCE');
  // checkNaming(regencies, 'REGENCY');
  // checkNaming(districts, 'DISTRICT');
  // checkNaming(villages, 'VILLAGE');

  // 4. Check Postal Codes Integrity
  const villageCodes = new Set(villages.map(v => v.code));
  Object.keys(postalCodes).forEach(code => {
    if (!villageCodes.has(code)) {
      warnings.push(`[POSTAL] Postal code exists for non-existent village code: ${code}`);
    }
    const postalCode = postalCodes[code];
    if (!/^\d{5}$/.test(postalCode)) {
      errors.push(`[POSTAL] Invalid postal code format for ${code}: ${postalCode}`);
    }
  });

  // Summary
  console.log(`\nAudit Summary:`);
  console.log(`- Errors: ${errors.length}`);
  console.log(`- Warnings: ${warnings.length}`);

  if (errors.length > 0) {
    console.log('\n--- ERRORS ---');
    errors.forEach(e => console.log(e));
  }

  if (warnings.length > 0) {
    console.log('\n--- WARNINGS ---');
    // Limit warnings output if too many
    warnings.slice(0, 50).forEach(w => console.log(w));
    if (warnings.length > 50) console.log(`... and ${warnings.length - 50} more warnings.`);
  }

  console.log('\n--- END DATA AUDIT ---');
}

validateData();
