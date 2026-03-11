import pdfplumber
import pandas as pd
import os

def extract_tables_from_pdf(pdf_path, output_dir="extracted_tables"):
    """
    Mengekstrak semua tabel dari file PDF dan menyimpannya sebagai file CSV.
    
    Args:
        pdf_path (str): Path ke file PDF.
        output_dir (str): Direktori untuk menyimpan hasil ekstraksi.
    """
    # Buat direktori output jika belum ada
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
        print(f"Direktori '{output_dir}' telah dibuat.")

    print(f"Membuka file: {pdf_path}")
    
    with pdfplumber.open(pdf_path) as pdf:
        total_pages = len(pdf.pages)
        print(f"Total halaman: {total_pages}")
        
        table_count = 0
        for i, page in enumerate(pdf.pages):
            # Ekstrak tabel dari halaman
            tables = page.extract_tables()
            
            if not tables:
                print(f"Halaman {i+1}: Tidak ditemukan tabel.")
                continue
                
            print(f"Halaman {i+1}: Ditemukan {len(tables)} tabel.")
            
            for j, table in enumerate(tables):
                table_count += 1
                # Konversi tabel ke DataFrame pandas
                df = pd.DataFrame(table[1:], columns=table[0])
                
                # Bersihkan nama file dari karakter yang tidak valid
                base_name = os.path.splitext(os.path.basename(pdf_path))[0]
                output_file = os.path.join(output_dir, f"{base_name}_page{i+1}_table{j+1}.csv")
                
                # Simpan ke CSV
                df.to_csv(output_file, index=False)
                print(f"Tabel {table_count} berhasil disimpan ke: {output_file}")

    print("\nProses ekstraksi selesai.")
    print(f"Total tabel yang diekstrak: {table_count}")

if __name__ == "__main__":
    pdf_file = "1715587369092.pdf"
    if os.path.exists(pdf_file):
        extract_tables_from_pdf(pdf_file)
    else:
        print(f"Error: File '{pdf_file}' tidak ditemukan.")
