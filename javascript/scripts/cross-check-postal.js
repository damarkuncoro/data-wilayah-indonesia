const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '..', 'data');
const villages = require(path.join(dataDir, 'villages.json'));
const postalCodes = fs.existsSync(path.join(dataDir, 'postal-codes.json')) 
  ? require(path.join(dataDir, 'postal-codes.json')) 
  : {};

const USER_AGENT = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36';
const BASE_URL = 'https://kodepos.posindonesia.co.id/CariKodepos';

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function verifyPostalCode(villageName, expectedPostalCode) {
  try {
    const response = await axios.post(BASE_URL, `kodepos=${encodeURIComponent(villageName)}`, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': USER_AGENT,
        'Accept': 'text/html',
        'Referer': BASE_URL
      }
    });

    const $ = cheerio.load(response.data);
    let found = false;
    
    $('#list-data tbody tr').each((i, el) => {
      const actualCode = $(el).find('td:nth-child(2)').text().trim();
      const actualVillage = $(el).find('td:nth-child(3)').text().trim().toLowerCase();
      
      if (actualCode === expectedPostalCode && actualVillage.includes(villageName.toLowerCase())) {
        found = true;
        return false; // break loop
      }
    });

    return found;
  } catch (error) {
    console.error(`Error verifying ${villageName}:`, error.message);
    return null;
  }
}

async function runCrossCheck(sampleSize = 10) {
  const scrapedCodes = Object.keys(postalCodes);
  if (scrapedCodes.length === 0) {
    console.log('No scraped postal codes found to verify.');
    return;
  }

  console.log(`--- START CROSS-CHECK AUDIT (Sample Size: ${sampleSize}) ---`);
  
  // Pick random samples
  const samples = [];
  for (let i = 0; i < sampleSize; i++) {
    const randomIndex = Math.floor(Math.random() * scrapedCodes.length);
    const code = scrapedCodes[randomIndex];
    const village = villages.find(v => v.code === code);
    if (village) {
      samples.push({
        code: code,
        name: village.name,
        expected: postalCodes[code]
      });
    }
  }

  let passed = 0;
  let failed = 0;
  let errors = 0;

  for (const sample of samples) {
    console.log(`[CHECK] Verifying ${sample.name} (${sample.code}) - Expected: ${sample.expected}...`);
    const result = await verifyPostalCode(sample.name, sample.expected);

    if (result === true) {
      console.log(`[OK] Match found!`);
      passed++;
    } else if (result === false) {
      console.log(`[FAIL] No match found on Pos Indonesia site for this village/code combination.`);
      failed++;
    } else {
      errors++;
    }

    await sleep(2000); // Be nice to the server
  }

  console.log(`\nCross-Check Summary:`);
  console.log(`- Passed: ${passed}`);
  console.log(`- Failed: ${failed}`);
  console.log(`- Network Errors: ${errors}`);
  console.log(`- Accuracy: ${((passed / (passed + failed)) * 100).toFixed(2)}%`);
  console.log('--- END CROSS-CHECK AUDIT ---');
}

// Default sample size 10
const size = process.argv[2] ? parseInt(process.argv[2]) : 10;
runCrossCheck(size);
