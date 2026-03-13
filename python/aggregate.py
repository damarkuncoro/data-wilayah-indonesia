import pandas as pd
import os
import json

# Directory containing the cleaned JSON files
input_dir = "/Users/damarkuncoro/SATU RAYA INTEGRASI/@damarkuncoro/data-wilayah-indonesia/docs/data-wilayah-indonesia/"

# Output file path for the aggregated database
output_csv_path = "/Users/damarkuncoro/SATU RAYA INTEGRASI/@damarkuncoro/data-wilayah-indonesia/docs/database_lengkap.csv"

all_data = []

print(f"Reading JSON files from: {input_dir}")

# Iterate over all files in the input directory
for filename in sorted(os.listdir(input_dir)):
    if filename.endswith("_cleaned.json"):
        file_path = os.path.join(input_dir, filename)
        print(f"Processing {filename}...")
        try:
            with open(file_path, 'r') as f:
                data = json.load(f)
                if isinstance(data, list):
                    all_data.extend(data)
                elif isinstance(data, dict):
                    all_data.append(data)
        except json.JSONDecodeError:
            print(f"  - Warning: Could not decode JSON from {filename}. Skipping.")
        except Exception as e:
            print(f"  - Error processing {filename}: {e}")

if not all_data:
    print("No data was loaded. Please check if the JSON files exist and are not empty.")
else:
    print(f"\nTotal rows aggregated: {len(all_data)}")

    # Convert the list of dictionaries to a Pandas DataFrame
    df = pd.DataFrame(all_data)
    print("DataFrame created successfully.")

    # --- Final Cleaning and Structuring ---

    # Define the desired column order for clarity
    desired_columns = [
        'level', 'kode', 'nama_wilayah', 'parent_provinsi', 'parent_kabupaten',
        'jumlah_desa', 'luas_wilayah', 'jumlah_penduduk', 'keterangan'
    ]
    
    # Get the columns that actually exist in the DataFrame
    existing_columns = [col for col in desired_columns if col in df.columns]
    
    # Reorder the DataFrame
    df = df[existing_columns]

    # Sort the data hierarchically by code
    df = df.sort_values(by='kode').reset_index(drop=True)

    # --- Save to CSV ---
    try:
        df.to_csv(output_csv_path, index=False)
        print(f"\nSuccessfully aggregated all data into: {output_csv_path}")
    except Exception as e:
        print(f"\nError saving the final CSV file: {e}")
