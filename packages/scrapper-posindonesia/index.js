const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const fs = require('fs');

const URL = 'https://www.posindonesia.co.id/id/check-postal-code';

async function getProvinces() {
    console.log('Launching browser...');
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    console.log(`Navigating to ${URL}...`);
    await page.goto(URL, { waitUntil: 'networkidle2' });

    console.log('Extracting province data...');
    const provinces = await page.evaluate(() => {
        const options = Array.from(document.querySelectorAll('#province option'));
        return options.map(option => ({
            id: option.value,
            name: option.innerText.trim()
        })).filter(p => p.id); // Filter out the default "Pilih Provinsi" option
    });

    console.log(`Found ${provinces.length} provinces.`);

    await browser.close();

    // Save to file
    fs.writeFileSync('provinces.json', JSON.stringify(provinces, null, 2));
    console.log('Province data saved to provinces.json');

    return provinces;
}

async function main() {
    try {
        await getProvinces();
    } catch (error) {
        console.error('An error occurred:', error);
    }
}

main();
