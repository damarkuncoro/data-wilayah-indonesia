const fs = require('fs');
const path = require('path');

const CONFIG = {
  LOG_PATH: path.join(__dirname, '..', 'data', 'postal-codes', 'postal-codes.log'),
  VILLAGES_PATH: path.join(__dirname, '..', 'data', 'base', 'villages.json'),
  OUTPUT_PATH: path.join(__dirname, '..', 'data', 'postal-codes', 'postal-codes.json'),
};

function buildJson() {
  if (!fs.existsSync(CONFIG.LOG_PATH)) {
    console.log('Log file not found. Nothing to build.');
    return;
  }

  console.log('Reading log file...');
  const logContent = fs.readFileSync(CONFIG.LOG_PATH, 'utf-8');
  const lines = logContent.split('\n').filter(line => line.trim() !== '');
  
  const districtPostalMap = new Map();
  lines.forEach(line => {
    const entry = JSON.parse(line);
    districtPostalMap.set(entry.districtCode, entry.postalCode);
  });

  console.log(`Loaded ${districtPostalMap.size} district-to-postal code mappings.`);

  const villages = require(CONFIG.VILLAGES_PATH);
  const finalPostalCodes = {};

  console.log(`Mapping postal codes to ${villages.length} villages...`);
  villages.forEach(village => {
    const postalCode = districtPostalMap.get(village.districtCode);
    if (postalCode) {
      finalPostalCodes[village.code] = postalCode;
    }
  });

  console.log(`Writing final postal-codes.json with ${Object.keys(finalPostalCodes).length} entries...`);
  fs.writeFileSync(CONFIG.OUTPUT_PATH, JSON.stringify(finalPostalCodes, null, 2));
  console.log('Done!');
}

buildJson();
