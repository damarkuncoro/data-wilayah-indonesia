const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

const villages = require('../data/villages.json');
const postalCodesPath = path.join(__dirname, '..', 'data', 'postal-codes.json');

const USER_AGENT = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36';
const BASE_URL = 'https://kodepos.posindonesia.co.id/CariKodepos';

// Helper function to add delay
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function fetchPostalCode(villageName) {
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
    const postalCode = $('#list-data tbody tr:first-child td:nth-child(2)').text().trim();

    if (postalCode && postalCode.length === 5) {
      return postalCode;
    }
    return null;
  } catch (error) {
    console.error(`Error fetching for ${villageName}:`, error.message);
    return null;
  }
}

async function main() {
  let existingPostalCodes = {};
  if (fs.existsSync(postalCodesPath)) {
    existingPostalCodes = JSON.parse(fs.readFileSync(postalCodesPath, 'utf-8'));
  }

  // To scrape a sample, add .slice(0, 10)
  const villagesToScrape = villages;

  for (const village of villagesToScrape) {
    if (existingPostalCodes[village.code]) {
      console.log(`[SKIP] Postal code for ${village.name} (${village.code}) already exists.`);
      continue;
    }

    console.log(`[FETCH] Scraping postal code for ${village.name} (${village.code})...`);
    const postalCode = await fetchPostalCode(village.name);

    if (postalCode) {
      existingPostalCodes[village.code] = postalCode;
      console.log(`[SUCCESS] Found postal code: ${postalCode}`);
    } else {
      console.log(`[FAIL] Could not find postal code for ${village.name}.`);
    }

    // Save progress after each fetch
    fs.writeFileSync(postalCodesPath, JSON.stringify(existingPostalCodes, null, 2));

    // Be respectful to the server, add a random delay
    const delay = Math.floor(Math.random() * (3000 - 1000 + 1) + 1000);
    await sleep(delay);
  }

  console.log('Scraping finished.');
}

main();
