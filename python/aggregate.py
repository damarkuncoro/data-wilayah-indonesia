import pandas as pd
import os
import json
import numpy as np
import re

# Paths
input_dir = "/Users/damarkuncoro/SATU RAYA INTEGRASI/@damarkuncoro/data-wilayah-indonesia/docs/data-wilayah-indonesia/"
output_csv_path = "/Users/damarkuncoro/SATU RAYA INTEGRASI/@damarkuncoro/data-wilayah-indonesia/docs/database_final.csv"
aceh_correction_path = "/Users/damarkuncoro/SATU RAYA INTEGRASI/@damarkuncoro/data-wilayah-indonesia/packages/data-wilayah-indonesia/scripts/aceh_villages_corrected.json"

# Load Aceh corrections if exists
aceh_corrections = {}
if os.path.exists(aceh_correction_path):
    with open(aceh_correction_path, 'r') as f:
        aceh_corrections = json.load(f)
    print(f"Loaded {len(aceh_corrections)} Aceh village corrections.")

all_data = []

print(f"Reading JSON files from: {input_dir}")

# Iterate over all files in the input directory
for filename in sorted(os.listdir(input_dir)):
    if filename.endswith("_cleaned.json"):
        file_path = os.path.join(input_dir, filename)
        try:
            with open(file_path, 'r') as f:
                data = json.load(f)
                if isinstance(data, list):
                    all_data.extend(data)
                elif isinstance(data, dict):
                    all_data.append(data)
        except Exception as e:
            print(f"  - Error processing {filename}: {e}")

if not all_data:
    print("No data was loaded.")
else:
    print(f"\nTotal raw rows aggregated: {len(all_data)}")
    df = pd.DataFrame(all_data)

    # --- Cleaning ---
    
    # 1. Unified Name logic
    def get_name(row):
        # 1. Try fallback for Aceh
        kode = str(row.get('kode', '')).strip()
        if kode in aceh_corrections:
            return aceh_corrections[kode].title()
        
        # 2. Try various name columns from extraction
        for col in ['nama_desa', 'nama_wilayah', 'nama_bersih']:
            val = str(row.get(col, '')).strip()
            # Ignore purely numeric names (often sequence numbers like "1", "2")
            if val and not val.isdigit() and val.lower() != 'nan':
                return val
        return ""

    df['name_unified'] = df.apply(get_name, axis=1)

    # 2. Hierarchical sorting
    df = df.sort_values(by=['kode', 'level']).reset_index(drop=True)

    # 3. Propagate Context
    df = df.rename(columns={'parent_provinsi': 'provinsi', 'parent_kabupaten': 'kabupaten'})
    df['provinsi'] = df['provinsi'].replace(['', ' ', 'nan', None], np.nan).fillna(method='ffill')
    df['kabupaten'] = df['kabupaten'].replace(['', ' ', 'nan', None], np.nan).fillna(method='ffill')
    
    df['kecamatan_context'] = np.where(df['level'] == 'kecamatan', df['name_unified'], np.nan)
    df['kecamatan_context'] = df['kecamatan_context'].replace(['', ' ', 'nan', None], np.nan).fillna(method='ffill')

    # 4. Group by code to merge information
    def aggregate_rows(group):
        res = {}
        # Find first valid name
        names = group['name_unified'].replace(['', 'nan'], np.nan).dropna()
        res['nama'] = names.iloc[0] if not names.empty else ""
        
        # Context
        provs = group['provinsi'].dropna()
        res['provinsi'] = provs.iloc[0] if not provs.empty else ""
        
        kabs = group['kabupaten'].dropna()
        res['kabupaten'] = kabs.iloc[0] if not kabs.empty else ""
        
        kecs = group['kecamatan_context'].dropna()
        res['kecamatan'] = kecs.iloc[0] if not kecs.empty else ""
        
        if (group['level'] == 'desa').any():
            res['level'] = 'desa'
            res['desa'] = res['nama']
        else:
            res['level'] = group['level'].iloc[0]
            res['desa'] = ""
            
        return pd.Series(res)

    print("Merging data and applying corrections...")
    df_final = df.groupby('kode').apply(aggregate_rows).reset_index()
    
    # 5. Filter to villages
    df_final = df_final[df_final['level'] == 'desa'].copy()
    
    # 6. Final cleanup
    df_final['kode'] = df_final['kode'].str.replace('.', '', regex=False)
    
    # Format name to Title Case for consistency
    df_final['nama'] = df_final['nama'].str.title()
    df_final['desa'] = df_final['desa'].str.title()
    df_final['provinsi'] = df_final['provinsi'].str.title()
    df_final['kabupaten'] = df_final['kabupaten'].str.title()
    df_final['kecamatan'] = df_final['kecamatan'].str.title()

    # Final Columns
    cols = ['kode', 'nama', 'provinsi', 'kabupaten', 'kecamatan', 'desa']
    df_final = df_final[cols].replace('Nan', '').replace('nan', '')

    # Save
    try:
        df_final.to_csv(output_csv_path, index=False)
        print(f"\nAggregation complete! Saved to: {output_csv_path}")
        print("\nPratinjau 5 baris pertama (Sudah dengan nama desa):")
        print(df_final.head().to_string())
    except Exception as e:
        print(f"Error: {e}")
