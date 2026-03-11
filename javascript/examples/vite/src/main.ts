import { DataWilayahService } from '@damarkuncoro/data-wilayah-indonesia'

// Inisialisasi service
const service = new DataWilayahService();

// Ambil elemen dropdown
const provinceSelect = document.querySelector<HTMLSelectElement>('#province')!;
const regencySelect = document.querySelector<HTMLSelectElement>('#regency')!;
const districtSelect = document.querySelector<HTMLSelectElement>('#district')!;
const villageSelect = document.querySelector<HTMLSelectElement>('#village')!;

// Fungsi pembantu untuk mengisi dropdown
function fillSelect(select: HTMLSelectElement, data: { code: string; name: string }[], placeholder: string) {
  select.innerHTML = `<option value="">${placeholder}</option>`;
  data.forEach(item => {
    const option = document.createElement('option');
    option.value = item.code;
    option.textContent = item.name;
    select.appendChild(option);
  });
  select.disabled = data.length === 0;
}

// 1. Isi daftar Provinsi saat pertama kali dimuat
const provinces = service.getAllProvinces();
fillSelect(provinceSelect, provinces, 'Pilih Provinsi...');

// 2. Event saat Provinsi dipilih
provinceSelect.addEventListener('change', () => {
  const provinceCode = provinceSelect.value;
  
  // Reset dropdown di bawahnya
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
  
  // Reset dropdown di bawahnya
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
  
  // Reset dropdown di bawahnya
  fillSelect(villageSelect, [], 'Pilih Desa...');

  if (districtCode) {
    const villages = service.getVillagesByDistrict(districtCode);
    fillSelect(villageSelect, villages, 'Pilih Desa...');
  }
});
