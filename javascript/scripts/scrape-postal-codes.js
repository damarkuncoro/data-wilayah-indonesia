const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

// --- 1. Configuration Object ---
const CONFIG = {
  BASE_URL: 'https://kodepos.posindonesia.co.id/CariKodepos',
  USER_AGENT: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36',
  MIN_DELAY: 1000, // ms
  MAX_DELAY: 3000, // ms
  DATA_DIR: path.join(__dirname, '..', 'data'),
  VILLAGES_PATH: path.join(__dirname, '..', 'data', 'villages.json'),
  DISTRICTS_PATH: path.join(__dirname, '..', 'data', 'districts.json'),
  POSTAL_CODES_PATH: path.join(__dirname, '..', 'data', 'postal-codes.json'),
};

// --- 2. Structured Logger ---
const logger = {
  log: (level, message) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] [${level.toUpperCase()}] ${message}`);
  },
  info: (message) => logger.log('info', message),
  warn: (message) => logger.log('warn', message),
  error: (message) => logger.log('error', message),
};

// --- Data Loading ---
const villages = require(CONFIG.VILLAGES_PATH);
const districts = require(CONFIG.DISTRICTS_PATH);
const districtMap = new Map(districts.map(d => [d.code, d.name]));

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function fetchPostalCode(query) {
  try {
    const response = await axios.post(CONFIG.BASE_URL, `kodepos=${encodeURIComponent(query)}`, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': CONFIG.USER_AGENT,
      }
    });
    const $ = cheerio.load(response.data);
    return $('#list-data tbody tr:first-child td:nth-child(2)').text().trim();
  } catch (err) {
    logger.error(`Network error while fetching for "${query}": ${err.message}`);
    return null;
  }
}

// --- 3. Fallback Search Logic ---
async function findPostalCode(village) {
  // Strategy 1: Search by exact village name
  let postalCode = await fetchPostalCode(village.name);
  if (postalCode) {
    logger.info(`Strategy 1 (Exact Match) successful for ${village.name}`);
    return postalCode;
  }
  await sleep(500); // Small delay between strategies

  // Strategy 2: Search by cleaned village name
  const cleanedName = village.name.replace(/^(Desa|Kelurahan|Gampong)\s+/i, '');
  if (cleanedName !== village.name) {
    postalCode = await fetchPostalCode(cleanedName);
    if (postalCode) {
      logger.info(`Strategy 2 (Cleaned Name) successful for ${village.name}`);
      return postalCode;
    }
    await sleep(500);
  }

  // Strategy 3: Fallback to district name
  const districtName = districtMap.get(village.districtCode);
  if (districtName) {
    postalCode = await fetchPostalCode(districtName);
    if (postalCode) {
      logger.warn(`Strategy 3 (District Fallback) used for ${village.name}. Found code: ${postalCode}`);
      return postalCode;
    }
  }

  return null;
}

async function main() {
  // --- 4. Flexible CLI ---
  const args = process.argv.slice(2).reduce((acc, arg) => {
    const [key, value] = arg.split('=');
    acc[key.replace(/^--/, '')] = value || true;
    return acc;
  }, {});

  let villagesToScrape = villages;
  if (args.sample) {
    villagesToScrape = villages.slice(0, parseInt(args.sample, 10));
    logger.info(`Running in sample mode for ${args.sample} villages.`);
  }
  if (args['resume-from']) {
    const resumeIndex = villages.findIndex(v => v.code === args['resume-from']);
    if (resumeIndex !== -1) {
      villagesToScrape = villages.slice(resumeIndex + 1);
      logger.info(`Resuming scrape from after village code ${args['resume-from']}.`);
    }
  }

  let existingPostalCodes = {};
  if (fs.existsSync(CONFIG.POSTAL_CODES_PATH)) {
    existingPostalCodes = JSON.parse(fs.readFileSync(CONFIG.POSTAL_CODES_PATH, 'utf-8'));
  }

  for (const village of villagesToScrape) {
    if (existingPostalCodes[village.code]) {
      logger.info(`[SKIP] Postal code for ${village.name} (${village.code}) already exists.`);
      continue;
    }

    logger.info(`[FETCH] Scraping for ${village.name} (${village.code})...`);
    const postalCode = await findPostalCode(village);

    if (postalCode && postalCode.length === 5) {
      existingPostalCodes[village.code] = postalCode;
      logger.info(`[SUCCESS] Found postal code: ${postalCode}`);
    } else {
      logger.warn(`[FAIL] Could not find postal code for ${village.name}.`);
    }

    fs.writeFileSync(CONFIG.POSTAL_CODES_PATH, JSON.stringify(existingPostalCodes, null, 2));

    const delay = Math.random() * (CONFIG.MAX_DELAY - CONFIG.MIN_DELAY) + CONFIG.MIN_DELAY;
    await sleep(delay);
  }

  logger.info('Scraping finished.');
}

main();
