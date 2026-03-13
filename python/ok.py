# Install camelot-py and its dependencies (ghostscript is required for camelot)
# Note: This might take a moment to install.

import camelot
import pandas as pd
import json
import os
import re # Import the regular expression module

# List of known provinces for "Auto-Split" logic
KNOWN_PROVINCES = [
    "ACEH", "SUMATERA UTARA", "SUMATERA BARAT", "RIAU", "JAMBI", "SUMATERA SELATAN",
    "BENGKULU", "LAMPUNG", "KEPULAUAN BANGKA BELITUNG", "KEPULAUAN RIAU", "DKI JAKARTA",
    "JAWA BARAT", "JAWA TENGAH", "DAERAH ISTIMEWA YOGYAKARTA", "JAWA TIMUR", "BANTEN",
    "BALI", "NUSA TENGGARA BARAT", "NUSA TENGGARA TIMUR", "KALIMANTAN BARAT",
    "KALIMANTAN TENGAH", "KALIMANTAN SELATAN", "KALIMANTAN TIMUR", "KALIMANTAN UTARA",
    "SULAWESI UTARA", "SULAWESI TENGAH", "SULAWESI SELATAN", "SULAWESI TENGGARA",
    "GORONTALO", "SULAWESI BARAT", "MALUKU", "MALUKU UTARA", "PAPUA", "PAPUA BARAT",
    "PAPUA SELATAN", "PAPUA TENGAH", "PAPUA PEGUNUNGAN", "PAPUA BARAT DAYA"
]

pdf_path = "/Users/damarkuncoro/SATU RAYA INTEGRASI/@damarkuncoro/data-wilayah-indonesia/docs/1715587369092.pdf"

try:
    # Get the number of pages in the PDF using PyPDF2 (or pypdfium2 for a more robust page count)
    # We'll use PyPDF2 since it's already installed and imported in previous cells
    from PyPDF2 import PdfReader
    reader = PdfReader(pdf_path)
    num_pages = len(reader.pages)

    print(f"Processing PDF with {num_pages} pages...")

    # Define the custom output directory
    output_dir = os.path.join(os.path.dirname(pdf_path), "data-wilayah-indonesia")

    # Create the directory if it doesn't exist
    os.makedirs(output_dir, exist_ok=True)
    print(f"Saving cleaned tables to: {output_dir}")

    extracted_count = 0

    for page_num in range(1, 101):
        print(f"\n--- Processing Page {page_num} ---")
        try:
            # Use camelot to extract tables from the current page
            # flavor='lattice' for tables with lines, 'stream' for tables without lines
            # You might need to experiment with 'flavor' and 'table_areas' for best results
            tables = camelot.read_pdf(pdf_path, pages=str(page_num), flavor='lattice')

            if tables:
                print(f"Found {len(tables)} table(s) on page {page_num}.")
                for i, table in enumerate(tables):
                    df = table.df.copy() # Make a copy to avoid modifying original camelot output
                    print(f"Table {i+1} on page {page_num} (first 5 rows - raw):\n{df.head().to_string()}")

                    # --- Start Cleaning Steps ---

                    # Step 1: Combine header rows
                    new_columns = []
                    header_row_1 = df.iloc[0]
                    header_row_2 = df.iloc[1]

                    for col_idx in df.columns:
                        col1 = str(header_row_1[col_idx]).replace('\n', ' ').strip()
                        col2 = str(header_row_2[col_idx]).replace('\n', ' ').strip()
                        
                        # Remove internal spaces for specific headers (e.g., "K ET E R A N G A N" -> "KETERANGAN")
                        col1 = re.sub(r'([A-Z])\s+(?=[A-Z])', r'\1', col1)
                        col2 = re.sub(r'([A-Z])\s+(?=[A-Z])', r'\1', col2)

                        if col1 and col2 and col1 != col2:
                            if col1 == 'J U M L A H' and (col2 == 'KAB' or col2 == 'KOTA' or col2 == 'KEC' or col2 == 'KEL' or col2 == 'DESA'):
                                new_columns.append(f"JUMLAH_{col2}")
                            else:
                                new_columns.append(f"{col1}_{col2}".strip('_'))
                        elif col1:
                            new_columns.append(col1)
                        elif col2:
                            new_columns.append(col2)
                        else:
                            new_columns.append(f"Unnamed_Column_{col_idx}")

                    # Clean up column names further (e.g., remove '*)', '**)', '***)', '(****)', etc.)
                    cleaned_columns = []
                    seen_cols = {}
                    for col in new_columns:
                        cleaned_col = col.strip()

                        # Perform specific replacements for common phrases first
                        cleaned_col = cleaned_col.replace('P R O V I N S I', 'PROVINSI')
                        cleaned_col = cleaned_col.replace('LUAS WILAYAH (Km2)', 'luas_wilayah')
                        cleaned_col = cleaned_col.replace('LUAS WILAYAH (Km2', 'luas_wilayah')
                        cleaned_col = cleaned_col.replace('LUASWILAYAH (Km2', 'luas_wilayah')
                        cleaned_col = cleaned_col.replace('JUMLAH PENDUDUK (Jiwa)', 'jumlah_penduduk')
                        cleaned_col = cleaned_col.replace('JUMLAH PULAU', 'jumlah_pulau')

                        # Then, remove any remaining trailing special markers like '*)', '**)', '(****)', etc.
                        cleaned_col = re.sub(r'[\*\(\)\s]+$', '', cleaned_col).strip()
                        
                        # Ensure uniqueness
                        if cleaned_col in seen_cols:
                            seen_cols[cleaned_col] += 1
                            cleaned_col = f"{cleaned_col}_{seen_cols[cleaned_col]}"
                        else:
                            seen_cols[cleaned_col] = 0
                        
                        cleaned_columns.append(cleaned_col)

                    df.columns = cleaned_columns

                    # Step 2: Remove irrelevant rows (the original header rows and the '1,2,3...' row)
                    df = df.iloc[3:].copy() # Keep data from the 4th row (index 3) onwards

                    # --- New Step 3: Handle Merged Rows (Multiline or Space-separated) ---
                    df_cleaned = df.copy()
                    
                    # Detect if we have merged rows (usually indicated by newlines or multiple codes in one cell)
                    is_merged = False
                    if len(df_cleaned) > 0:
                        first_kode = str(df_cleaned.iloc[0, 1]) if len(df_cleaned.columns) > 1 else ""
                        if '\n' in first_kode or ' ' in first_kode.strip():
                            is_merged = True
                    
                    if is_merged:
                        print(f"Detected merged data on page {page_num}. Attempting to reconstruct rows...")
                        reconstructed_data = []
                        
                        for _, row in df_cleaned.iterrows():
                            # Split each cell into parts
                            row_parts = {}
                            max_parts = 0
                            for col_idx, col_name in enumerate(df_cleaned.columns):
                                val = str(row.iloc[col_idx])
                                # Split by newline or multiple spaces
                                if '\n' in val:
                                    parts = [p.strip() for p in val.split('\n')]
                                else:
                                    parts = [p.strip() for p in re.split(r'\s{2,}', val)]
                                    if len(parts) <= 1:
                                        parts = val.split()
                                
                                # Special handling for province names in summary tables
                                if col_idx == 2: # Usually NAMA PROVINSI
                                    # Fix "P A P U A" style
                                    joined_val = ' '.join(parts)
                                    joined_val = re.sub(r'(?<=[A-Z])\s+(?=[A-Z]\b)', '', joined_val)
                                    
                                    found_provinces = []
                                    remaining_text = joined_val.upper()
                                    while remaining_text:
                                        matched = False
                                        for p in KNOWN_PROVINCES:
                                            if remaining_text.startswith(p):
                                                found_provinces.append(p)
                                                remaining_text = remaining_text[len(p):].strip()
                                                matched = True
                                                break
                                        if not matched:
                                            if remaining_text.strip():
                                                # If no province matches, just take the next word
                                                next_word = remaining_text.split(None, 1)[0]
                                                found_provinces.append(next_word)
                                                remaining_text = remaining_text[len(next_word):].strip()
                                            else:
                                                break
                                    parts = found_provinces

                                row_parts[col_name] = parts
                                max_parts = max(max_parts, len(parts))
                            
                            # Create individual rows from parts
                            for idx in range(max_parts):
                                new_row = {}
                                for col_name in df_cleaned.columns:
                                    parts = row_parts[col_name]
                                    new_row[col_name] = parts[idx] if idx < len(parts) else ""
                                reconstructed_data.append(new_row)
                        
                        df_cleaned = pd.DataFrame(reconstructed_data)
                    else:
                        # Standard cleaning for non-merged rows
                        for col in df_cleaned.columns:
                            if df_cleaned[col].dtype == 'object':
                                df_cleaned[col] = df_cleaned[col].astype(str).str.replace('\n', ' ', regex=False).str.strip()
                                if col == 'D E S A' or 'DESA' in str(col).upper():
                                    df_cleaned[col] = df_cleaned[col].apply(lambda x: re.sub(r'^\d+\s+', '', str(x)).strip())

                    # Final Column Mapping for a cleaner JSON
                    column_mapping = {
                        'K O D E': 'kode',
                        'KODE': 'kode',
                        'NAMA PROVINSI / KABUPATEN / KOTA': 'nama_wilayah',
                        'PROVINSI': 'nama_wilayah',
                        'KETERANGAN': 'keterangan',
                        'LUAS  WILAYAH (Km2': 'luas_wilayah',
                        'LUAS WILAYAH (Km2': 'luas_wilayah',
                        'LUASWILAYAH (Km2': 'luas_wilayah',
                        'JUMLAH_PENDUDUK_Jiwa': 'jumlah_penduduk'
                    }
                    
                    # Rename columns if they exist
                    df_cleaned = df_cleaned.rename(columns={k: v for k, v in column_mapping.items() if k in df_cleaned.columns})
                    
                    # --- New: Ensure 'nama_wilayah' exists if possible ---
                    # Sometimes the column name might be slightly different or missing from mapping
                    if 'nama_wilayah' not in df_cleaned.columns:
                        # Look for common column indices or names that might contain names
                        potential_name_cols = [c for c in df_cleaned.columns if any(x in str(c).upper() for x in ['NAMA', 'PROVINSI', 'KABUPATEN', 'KOTA', 'KECAMATAN', 'DESA'])]
                        if potential_name_cols:
                            df_cleaned = df_cleaned.rename(columns={potential_name_cols[0]: 'nama_wilayah'})

                    # Logic for 'DESA' column
                    for col in df_cleaned.columns:
                        if 'DESA' in str(col).upper() and col != 'nama_wilayah':
                            if 'kode' in df_cleaned.columns:
                                village_count = df_cleaned['kode'].apply(lambda x: len(str(x).split('.')) == 4).sum()
                                if village_count > len(df_cleaned) / 2:
                                    df_cleaned = df_cleaned.rename(columns={col: 'nama_desa'})
                                else:
                                    df_cleaned = df_cleaned.rename(columns={col: 'jumlah_desa'})
                            break

                    # Drop columns that are entirely empty or NaN
                    df_cleaned = df_cleaned.dropna(axis=1, how='all')
                    df_cleaned = df_cleaned.loc[:, (df_cleaned != '').any(axis=0)]
                    
                    # Also drop columns that still have "JUMLAH" or "N A M A" in their name but are mostly empty
                    cols_to_drop = [c for c in df_cleaned.columns if any(x in c for x in ['JUMLAH', 'N A M A', 'Unnamed', 'KAB', 'KOTA', 'KEC', 'KEL']) and c not in column_mapping.values() and c not in ['jumlah_desa', 'nama_desa', 'nama_wilayah']]
                    df_cleaned = df_cleaned.drop(columns=cols_to_drop, errors='ignore')

                    # Remove rows where kode is empty
                    if 'kode' in df_cleaned.columns:
                        df_cleaned = df_cleaned[df_cleaned['kode'].str.contains(r'\d', na=False)]

                    # Drop the 'NO' column if it exists and is considered unnecessary
                    if 'NO' in df_cleaned.columns:
                        df_cleaned = df_cleaned.drop(columns=['NO'])

                    # --- New Step 3.5: Context Propagation (Hierarchical Awareness) ---
                    if 'kode' in df_cleaned.columns:
                        current_provinsi = ""
                        current_kabupaten = ""
                        
                        prop_data = []
                        for _, row in df_cleaned.iterrows():
                            kode = str(row['kode']).strip()
                            nama = str(row['nama_wilayah']).strip() if 'nama_wilayah' in row else ""
                            
                            # Determine level based on code pattern
                            parts = kode.split('.')
                            level = ""
                            
                            if len(parts) == 1 and len(kode) == 2:
                                level = "provinsi"
                                current_provinsi = re.sub(r'^\d+\s+', '', nama).strip()
                                current_kabupaten = ""
                            elif len(parts) == 2:
                                level = "kabupaten"
                                current_kabupaten = re.sub(r'^\d+\s+', '', nama).strip()
                            elif len(parts) == 3:
                                level = "kecamatan"
                            elif len(parts) == 4:
                                level = "desa"
                            
                            # Clean the current name
                            # Remove leading/trailing numbers like "1 Bakongan" or "Bakongan 1"
                            cleaned_nama = re.sub(r'^\d+\s+|\s+\d+$', '', nama).strip()
                            
                            new_row = row.to_dict()
                            new_row['level'] = level
                            new_row['nama_bersih'] = cleaned_nama
                            new_row['parent_provinsi'] = current_provinsi
                            new_row['parent_kabupaten'] = current_kabupaten
                            prop_data.append(new_row)
                        
                        df_cleaned = pd.DataFrame(prop_data)
                    # --- End of Context Propagation ---

                    # Drop 'nama_wilayah' if 'nama_bersih' exists to avoid redundancy
                    if 'nama_bersih' in df_cleaned.columns and 'nama_wilayah' in df_cleaned.columns:
                        df_cleaned = df_cleaned.drop(columns=['nama_wilayah'])
                        df_cleaned = df_cleaned.rename(columns={'nama_bersih': 'nama_wilayah'})

                    # Step 4: Clean and convert data types
                    numeric_cols = [
                        'jumlah_desa', 'luas_wilayah', 'jumlah_penduduk', 'JUMLAH_PULAU'
                    ]

                    for col in numeric_cols:
                        if col in df_cleaned.columns:
                            df_cleaned[col] = df_cleaned[col].astype(str).str.replace('.', '', regex=False) # Remove '.' thousands separator
                            df_cleaned[col] = df_cleaned[col].astype(str).str.replace(',', '.', regex=False) # Replace ',' decimal separator with '.'
                            df_cleaned[col] = pd.to_numeric(df_cleaned[col], errors='coerce')
                    
                    # --- End Cleaning Steps ---

                    print(f"Table {i+1} on page {page_num} (first 5 rows - cleaned):\n{df_cleaned.head().to_string()}")
                    
                    # Save each cleaned DataFrame to a separate JSON file
                    table_output_filename = os.path.join(output_dir, f"page_{page_num}_table_{i+1}_cleaned.json")
                    df_cleaned.to_json(table_output_filename, orient='records', indent=2)
                    print(f"Cleaned Table {i+1} on page {page_num} saved to '{table_output_filename}'")
                    extracted_count += 1
            else:
                print(f"No tables found on page {page_num}.")

        except Exception as e_camelot:
            print(f"Error extracting tables from page {page_num} with camelot: {e_camelot}")

    if extracted_count > 0:
        print(f"\nSuccessfully extracted and cleaned {extracted_count} tables, saved individually to '{output_dir}'.")
    else:
        print("No tables were extracted from the entire PDF.")

except FileNotFoundError:
    print(f"Error: The file '{pdf_path}' was not found.")
except Exception as e:
    print(f"An error occurred during PDF processing: {e}")
