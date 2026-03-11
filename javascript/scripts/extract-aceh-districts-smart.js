const fs = require('fs');
const path = require('path');

const extractedTablesDir = path.join(__dirname, '..', '..', 'extracted_tables');
const districtNames = {};

const files = fs.readdirSync(extractedTablesDir).filter(f => f.endsWith('.csv'));

console.log(`[INFO] Starting smart extraction for Aceh districts from ${files.length} files...`);

files.forEach(file => {
  const content = fs.readFileSync(path.join(extractedTablesDir, file), 'utf-8');
  const lines = content.split('\n');
  
  lines.forEach(line => {
    const parts = line.split(',');
    if (parts.length < 3) return;
    
    const code = parts[0].trim();
    // Focus only on Aceh district codes (11.XX.XX)
    if (/^11\.\d{2}\.\d{2}$/.test(code)) {
      // Iterate through all possible columns to find a valid name
      for (let i = 1; i < parts.length; i++) {
        let potentialName = parts[i].trim().replace(/"/g, '');
        
        // Clean the name: remove leading numbers, etc.
        potentialName = potentialName.replace(/^\d+/, '').trim();
        
        // Basic validation for a plausible district name
        if (potentialName && potentialName.length > 2 && !potentialName.match(/^-|KECAMATAN|JUMLAH|NAMA|LUAS/i)) {
          // If a name for this code doesn't exist or the new one is longer (more specific), replace it
          if (!districtNames[code] || potentialName.length > districtNames[code].length) {
            districtNames[code] = potentialName.toUpperCase();
          }
        }
      }
    }
  });
});

console.log(`[SUCCESS] Found ${Object.keys(districtNames).length} potential district names for Aceh.`);

// Save the extracted names to be used by the main build script
fs.writeFileSync(path.join(__dirname, 'aceh_districts_corrected.json'), JSON.stringify(districtNames, null, 2));
console.log('[SUCCESS] Saved corrected Aceh district names to aceh_districts_corrected.json');
