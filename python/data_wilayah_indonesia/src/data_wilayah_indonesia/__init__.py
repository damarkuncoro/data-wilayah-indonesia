"""
Data Wilayah Indonesia - Package Python untuk data wilayah administratif Indonesia.

Package ini menyediakan akses mudah ke data wilayah administratif Indonesia
yang mencakup:
- Provinsi
- Kabupaten/Kota (Regency)
- Kecamatan (District)
- Desa/Kelurahan (Village)

Contoh penggunaan:
    from data_wilayah_indonesia import DataWilayahService
    
    service = DataWilayahService()
    provinces = service.get_all_provinces()
    
    for province in provinces:
        print(f"{province.code}: {province.name}")
"""

__version__ = "1.0.0"
__author__ = "Nama Anda"
__email__ = "email@example.com"

from .core.entities.province import Province
from .core.entities.regency import Regency, RegencyType
from .core.entities.district import District
from .core.entities.village import Village, VillageType
from .service import DataWilayahService

__all__ = [
    "DataWilayahService",
    "Province",
    "Regency",
    "RegencyType",
    "District",
    "Village",
    "VillageType",
]