#!/usr/bin/env python3
"""
Convert extracted_tables CSV files to JSON format
"""
import csv
import json
import os
import re
from pathlib import Path

def parse_csv_to_json(csv_path):
    """Parse a CSV file and extract village data"""
    villages = []
    
    with open(csv_path, 'r', encoding='utf-8') as f:
        reader = csv.reader(f)
        
        for row in reader:
            if len(row) < 1:
                continue
            
            # First column should be the village code
            code = row[0].strip() if row[0] else ""
            
            # Skip header rows and empty codes
            if not code or code.startswith('K O D E') or code.startswith('KODE'):
                continue
            
            # Skip district-level codes (they have format XX.XX.XX but no village part)
            code_parts = code.split('.')
            if len(code_parts) < 4:
                continue
            
            # Extract village name - typically in column 6 (index 5) or 7 (index 6)
            name = ""
            if len(row) > 5 and row[5].strip():
                name = row[5].strip()
            elif len(row) > 6 and row[6].strip():
                name = row[6].strip()
            
            # Clean up name
            name = re.sub(r'^\d+\s+', '', name)  # Remove leading number
            
            if name and code:
                villages.append({
                    "code": code,
                    "name": name
                })
    
    return villages

def main():
    input_dir = Path("extracted_tables")
    output_dir = Path("extracted_tables_json")
    output_dir.mkdir(exist_ok=True)
    
    csv_files = list(input_dir.glob("*.csv"))
    print(f"Found {len(csv_files)} CSV files")
    
    all_villages = []
    
    for csv_file in csv_files:
        villages = parse_csv_to_json(csv_file)
        if villages:
            all_villages.extend(villages)
            print(f"Processed {csv_file.name}: {len(villages)} villages")
    
    # Save all villages to a single JSON file
    output_file = output_dir / "all_villages.json"
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(all_villages, f, ensure_ascii=False, indent=2)
    
    print(f"\nTotal villages extracted: {len(all_villages)}")
    print(f"Saved to: {output_file}")

if __name__ == "__main__":
    main()
