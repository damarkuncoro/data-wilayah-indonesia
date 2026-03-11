const fs = require('fs');
const path = require('path');

const extractedTablesDir = path.join(__dirname, '..', '..', 'extracted_tables');
const villageNames = {};

const files = fs.readdirSync(extractedTablesDir).filter(f => f.endsWith('.csv'));

console.log(`[INFO] Starting smart extraction for Aceh villages from ${files.length} files...`);

files.forEach(file => {
  const content = fs.readFileSync(path.join(extractedTablesDir, file), 'utf-8');
  const lines = content.split('\n');
  
  lines.forEach(line => {
    const parts = line.split(',');
    if (parts.length < 3) return;
    
    const code = parts[0].trim();
    // Focus only on Aceh village codes (11.XX.XX.XXXX)
    if (/^11\.\d{2}\.\d{2}\.\d{4}$/.test(code)) {
      // Iterate through all possible columns to find a valid name
      for (let i = 1; i < parts.length; i++) {
        let potentialName = parts[i].trim().replace(/"/g, '');
        
        // Clean the name: remove leading numbers, etc.
        potentialName = potentialName.replace(/^\d+/, '').trim();
        
        // Basic validation for a plausible village name
        if (potentialName && potentialName.length > 2 && !potentialName.match(/^-|KECAMATAN|JUMLAH|NAMA|LUAS|DESA|KELURAHAN|QONUN/i)) {
          // If a name for this code doesn't exist or the new one is longer, replace it
          if (!villageNames[code] || potentialName.length > villageNames[code].length) {
            villageNames[code] = potentialName.toUpperCase();
          }
        }
      }
    }
  });
});

console.log(`[SUCCESS] Found ${Object.keys(villageNames).length} potential village names for Aceh.`);

// Save the extracted names to be used by the main build script
fs.writeFileSync(path.join(__dirname, 'aceh_villages_corrected.json'), JSON.stringify(villageNames, null, 2));
console.log('[SUCCESS] Saved corrected Aceh village names to aceh_villages_corrected.json');
