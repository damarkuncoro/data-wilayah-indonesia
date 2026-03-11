import sys
import os

# Tambahkan src ke path agar bisa import package
sys.path.append(os.path.abspath("src"))

from data_wilayah_indonesia.service import DataWilayahService

def main():
    # Gunakan data hasil agregasi
    data_path = "data/indonesia_administrative_data.csv"
    
    if not os.path.exists(data_path):
        print(f"Error: File data '{data_path}' tidak ditemukan.")
        print("Silakan jalankan aggregator terlebih dahulu.")
        return

    # Inisialisasi service (Clean Architecture)
    service = DataWilayahService(data_path)

    # 1. Ambil semua Provinsi
    print("--- DAFTAR PROVINSI ---")
    provinces = service.get_all_provinces()
    for prov in provinces[:10]: # Tampilkan 10 saja
        print(f"[{prov.code}] {prov.name}")

    # 2. Ambil Kabupaten/Kota di Provinsi DKI Jakarta (kode: 31)
    # Catatan: Karena data ekstraksi mungkin memiliki kode berbeda, sesuaikan
    # Berdasarkan sample aggregator, 11 adalah DKI JAKARTA (wait, 11 itu Aceh biasanya)
    # Mari kita cari kode untuk "JAKARTA"
    
    search_name = "JAKARTA"
    print(f"\n--- MENCARI PROVINSI '{search_name}' ---")
    for prov in provinces:
        if search_name in prov.name.upper():
            print(f"Ditemukan: [{prov.code}] {prov.name}")
            
            # Ambil regency di provinsi tersebut
            print(f"\n--- DAFTAR KABUPATEN/KOTA DI {prov.name} ---")
            regencies = service.get_regencies_by_province(prov.code)
            if not regencies:
                print("Tidak ditemukan kabupaten/kota (Data mungkin belum lengkap)")
            for reg in regencies:
                print(f"[{reg.code}] {reg.name} ({reg.type.value})")

if __name__ == "__main__":
    main()
