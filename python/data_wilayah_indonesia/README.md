# Data Wilayah Indonesia

Package Python untuk data wilayah administratif Indonesia yang mencakup Provinsi, Kabupaten/Kota, Kecamatan, dan Desa/Kelurahan.

## Instalasi

```bash
pip install data-wilayah-indonesia
```

## Penggunaan

```python
from data_wilayah_indonesia import DataWilayahService

# Inisialisasi service (menggunakan data bundled)
service = DataWilayahService()

# Atau dengan path data eksternal
# service = DataWilayahService("/path/to/data.csv")

# Mendapatkan semua provinsi
provinces = service.get_all_provinces()
for province in provinces:
    print(f"{province.code}: {province.name}")

# Mendapatkan kabupaten/kota berdasarkan kode provinsi
regencies = service.get_regencies_by_province("11")  # Aceh
for regency in regencies:
    print(f"  {regency.code}: {regency.name}")

# Mendapatkan kecamatan berdasarkan kode kabupaten/kota
districts = service.get_districts_by_regency("11.01")  # Aceh Selatan
for district in districts:
    print(f"    {district.code}: {district.name}")

# Mendapatkan desa/kelurahan berdasarkan kode kecamatan
villages = service.get_villages_by_district("11.01.01")
for village in villages:
    print(f"      {village.code}: {village.name}")
```

## API

### DataWilayahService

Kelas utama untuk mengakses data wilayah Indonesia.

#### Konstruktor

```python
DataWilayahService(data_path: Optional[str] = None)
```

- `data_path`: Path ke file CSV data wilayah. Jika tidak diberikan, menggunakan data bundled.

#### Metode

- `get_all_provinces() -> List[Province]`: Mendapatkan semua provinsi
- `get_regencies_by_province(province_code: str) -> List[Regency]`: Mendapatkan kabupaten/kota berdasarkan kode provinsi
- `get_districts_by_regency(regency_code: str) -> List[District]`: Mendapatkan kecamatan berdasarkan kode kabupaten/kota
- `get_villages_by_district(district_code: str) -> List[Village]`: Mendapatkan desa/kelurahan berdasarkan kode kecamatan

### Entitas

- `Province`: Entity untuk Provinsi
- `Regency`: Entity untuk Kabupaten/Kota
- `District`: Entity untuk Kecamatan
- `Village`: Entity untuk Desa/Kelurahan

Setiap entity memiliki properti:
- `code`: Kode wilayah
- `name`: Nama wilayah

## Lisensi

MIT License