const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

const CONFIG = {
  BASE_URL: 'https://kodepos.posindonesia.co.id/CariKodepos',
  USER_AGENT: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36',
  MIN_DELAY: 1000, 
  MAX_DELAY: 3000,
  DISTRICTS_PATH: path.join(__dirname, '..', 'data', 'base', 'districts.json'),
  LOG_PATH: path.join(__dirname, '..', 'data', 'postal-codes', 'postal-codes.log'),
};

const logger = {
  log: (level, message) => console.log(`[${new Date().toISOString()}] [${level.toUpperCase()}] ${message}`),
  info: (message) => logger.log('info', message),
  warn: (message) => logger.log('warn', message),
  error: (message) => logger.log('error', message),
};

const districts = require(CONFIG.DISTRICTS_PATH);
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function fetchPostalCode(query) {
  try {
    const response = await axios.post(CONFIG.BASE_URL, `kodepos=${encodeURIComponent(query)}`, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'User-Agent': CONFIG.USER_AGENT },
      timeout: 10000 // 10 second timeout
    });
    const $ = cheerio.load(response.data);
    return $('#list-data tbody tr:first-child td:nth-child(2)').text().trim();
  } catch (err) {
    logger.error(`Network error for "${query}": ${err.message}`);
    return null;
  }
}

function getScrapedDistrictCodes() {
  if (!fs.existsSync(CONFIG.LOG_PATH)) {
    return new Set();
  }
  const logContent = fs.readFileSync(CONFIG.LOG_PATH, 'utf-8');
  const lines = logContent.split('\n').filter(line => line.trim() !== '');
  const codes = lines.map(line => JSON.parse(line).districtCode);
  return new Set(codes);
}

async function main() {
  const scrapedCodes = getScrapedDistrictCodes();
  logger.info(`${scrapedCodes.size} districts already scraped. Resuming...`);

  const districtsToScrape = districts.filter(d => !scrapedCodes.has(d.code));
  logger.info(`Starting scrape for ${districtsToScrape.length} districts.`);

  for (const district of districtsToScrape) {
    logger.info(`[FETCH] Scraping for District: ${district.name} (${district.code})`);
    const postalCode = await fetchPostalCode(district.name);

    if (postalCode && postalCode.length === 5) {
      const logEntry = { districtCode: district.code, postalCode: postalCode };
      fs.appendFileSync(CONFIG.LOG_PATH, JSON.stringify(logEntry) + '\n');
      logger.info(`[SUCCESS] Found: ${postalCode}. Logged to file.`);
    } else {
      logger.warn(`[FAIL] Could not find postal code for ${district.name}.`);
    }

    const delay = Math.random() * (CONFIG.MAX_DELAY - CONFIG.MIN_DELAY) + CONFIG.MIN_DELAY;
    await sleep(delay);
  }

  logger.info('Scraping by district finished.');
}

main();
