import pandas as pd
import glob
import os
import re

class DataAggregator:
    """
    Kelas untuk mengumpulkan dan membersihkan data dari file CSV hasil ekstraksi PDF.
    Mengikuti prinsip SRP dengan fokus pada pembersihan data.
    """
    def __init__(self, input_dir: str):
        self.input_dir = input_dir

    def aggregate(self) -> pd.DataFrame:
        """
        Menggabungkan semua CSV hasil ekstraksi menjadi satu DataFrame yang bersih.
        """
        all_files = glob.glob(os.path.join(self.input_dir, "*.csv"))
        all_data = []

        for file in all_files:
            try:
                # Membaca CSV dengan header di baris pertama
                df = pd.read_csv(file)
                
                # Kita mencari baris yang memiliki pola kode (XX atau XX.XX atau XX.XX.XX atau XX.XX.XX.XXXX)
                code_col = df.columns[0]
                
                # Pola kode: 2 digit, atau 2.2, atau 2.2.2, atau 2.2.2.4
                code_pattern = r'^\d{2}(\.\d{2}){0,2}(\.\d{4})?$'
                valid_rows = df[df[code_col].astype(str).str.match(code_pattern, na=False)].copy()
                
                if not valid_rows.empty:
                    # Pastikan kode adalah string
                    valid_rows[code_col] = valid_rows[code_col].astype(str).str.strip()
                    
                    def extract_name(row):
                        # Cari nilai non-null terakhir yang mengandung teks
                        for val in reversed(row.values):
                            val_str = str(val).strip()
                            # Abaikan string kosong, "nan", atau angka murni (kecuali jika itu nama)
                            if val_str and val_str.lower() != 'nan' and not val_str.replace('.', '').isdigit():
                                # Hilangkan angka urut di depan jika ada (misal "27 Seureumo" -> "Seureumo")
                                return re.sub(r'^\d+\s+', '', val_str)
                        return "Unknown"

                    valid_rows['clean_name'] = valid_rows.apply(extract_name, axis=1)
                    valid_rows = valid_rows[[code_col, 'clean_name']]
                    valid_rows.columns = ['code', 'name']
                    
                    all_data.append(valid_rows)
            except Exception as e:
                print(f"Error processing {file}: {e}")

        if not all_data:
            return pd.DataFrame(columns=['code', 'name'])

        aggregated_df = pd.concat(all_data).drop_duplicates()
        # Bersihkan data: hapus baris dengan kode yang tidak valid atau nama "Unknown"
        code_pattern = r'^\d{2}(\.\d{2}){0,2}(\.\d{4})?$'
        aggregated_df = aggregated_df[aggregated_df['code'].str.match(code_pattern, na=False)]
        aggregated_df = aggregated_df[aggregated_df['name'] != "Unknown"]
        
        aggregated_df = aggregated_df.sort_values('code')
        return aggregated_df

if __name__ == "__main__":
    # Test aggregator
    aggregator = DataAggregator("extracted_tables")
    df = aggregator.aggregate()
    print(f"Total data terkumpul: {len(df)}")
    print(df.head(20))
    # Simpan hasil agregasi untuk digunakan repository
    os.makedirs("data", exist_ok=True)
    df.to_csv("data/indonesia_administrative_data.csv", index=False)
