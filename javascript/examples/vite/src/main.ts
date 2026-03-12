import { DataWilayahService, PostalCodePlugin } from '@damarkuncoro/data-wilayah-indonesia';

// Inisialisasi service dengan PostalCodePlugin
const service = new DataWilayahService(undefined, [new PostalCodePlugin()]);

// Ambil elemen UI
const provinceSelect = document.querySelector<HTMLSelectElement>('#province')!;
const regencySelect = document.querySelector<HTMLSelectElement>('#regency')!;
const districtSelect = document.querySelector<HTMLSelectElement>('#district')!;
const villageSelect = document.querySelector<HTMLSelectElement>('#village')!;
const resultBox = document.querySelector<HTMLDivElement>('#result')!;
const searchInput = document.querySelector<HTMLInputElement>('#search')!;
const searchResults = document.querySelector<HTMLDivElement>('#search-results')!;

// Fungsi pembantu untuk mengisi dropdown dengan hierarki
function fillSelect(select: HTMLSelectElement, data: any[], placeholder: string) {
  select.innerHTML = `<option value="">${placeholder}</option>`;
  data.forEach(item => {
    const option = document.createElement('option');
    option.value = item.code;
    // Tampilkan hierarki nama
    let displayName = item.name;
    if (item.districtName) displayName = `${item.name}, ${item.districtName}`;
    if (item.regencyName) displayName = `${displayName}, ${item.regencyName}`;
    if (item.provinceName) displayName = `${displayName}, ${item.provinceName}`;
    option.textContent = displayName;
    select.appendChild(option);
  });
  select.disabled = data.length === 0;
}

// 1. Isi daftar Provinsi
const provinces = service.getAllProvinces();
fillSelect(provinceSelect, provinces, 'Pilih Provinsi...');

// 2. Event saat Provinsi dipilih
provinceSelect.addEventListener('change', () => {
  const provinceCode = provinceSelect.value;
  resultBox.innerHTML = '';
  fillSelect(regencySelect, [], 'Pilih Kabupaten...');
  fillSelect(districtSelect, [], 'Pilih Kecamatan...');
  fillSelect(villageSelect, [], 'Pilih Desa...');
  if (provinceCode) {
    const regencies = service.getRegenciesByProvince(provinceCode);
    fillSelect(regencySelect, regencies, 'Pilih Kabupaten...');
  }
});

// 3. Event saat Kabupaten dipilih
regencySelect.addEventListener('change', () => {
  const regencyCode = regencySelect.value;
  resultBox.innerHTML = '';
  fillSelect(districtSelect, [], 'Pilih Kecamatan...');
  fillSelect(villageSelect, [], 'Pilih Desa...');
  if (regencyCode) {
    const districts = service.getDistrictsByRegency(regencyCode);
    fillSelect(districtSelect, districts, 'Pilih Kecamatan...');
  }
});

// 4. Event saat Kecamatan dipilih
districtSelect.addEventListener('change', () => {
  const districtCode = districtSelect.value;
  resultBox.innerHTML = '';
  fillSelect(villageSelect, [], 'Pilih Desa...');
  if (districtCode) {
    const villages = service.getVillagesByDistrict(districtCode);
    fillSelect(villageSelect, villages, 'Pilih Desa...');
  }
});

// 5. Event saat Desa dipilih
villageSelect.addEventListener('change', () => {
  const villageCode = villageSelect.value;
  if (villageCode) {
    const village = service.getVillageByCode(villageCode);
    if (village) {
      resultBox.innerHTML = `<h3>Detail Wilayah</h3>
        <p><b>Nama:</b> ${village.name}</p>
        <p><b>Kode:</b> ${village.code}</p>
        <p><b>Kodepos:</b> ${village.postalCode || 'Tidak tersedia'}</p>
        <p><b>Hierarki:</b> ${village.districtName}, ${village.regencyName}, ${village.provinceName}</p>`;
    }
  }
});

// 6. Event untuk Pencarian
searchInput.addEventListener('input', () => {
  const query = searchInput.value;
  searchResults.innerHTML = '';
  if (query.length > 2) {
    const results = service.search(query);
    results.forEach(result => {
      const div = document.createElement('div');
      div.className = 'search-item';
      const item = result.item;
      let displayName = '';
      switch (result.type) {
        case 'village':
          displayName = `${item.name}, ${item.districtName}, ${item.regencyName}, ${item.provinceName}`;
          break;
        case 'district':
          displayName = `${item.name}, ${item.regencyName}, ${item.provinceName}`;
          break;
        case 'regency':
          displayName = `${item.name}, ${item.provinceName}`;
          break;
        case 'province':
          displayName = item.name;
          break;
      }
      div.textContent = `[${result.type}] ${displayName}`;
      searchResults.appendChild(div);
    });
  }
});
