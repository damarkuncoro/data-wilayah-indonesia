from typing import List
from .core.entities.province import Province
from .core.entities.regency import Regency
from .core.entities.district import District
from .core.entities.village import Village
from .infrastructure.repositories.csv_province_repository import CSVProvinceRepository
from .infrastructure.repositories.csv_regency_repository import CSVRegencyRepository
from .infrastructure.repositories.csv_district_repository import CSVDistrictRepository
from .infrastructure.repositories.csv_village_repository import CSVVillageRepository
from .use_cases.get_provinces import GetProvinces
from .use_cases.get_regencies import GetRegencies

class DataWilayahService:
    """
    Facade class untuk mengakses data wilayah Indonesia.
    Mengikuti prinsip Clean Architecture (Composition Root).
    """
    def __init__(self, data_path: str):
        # Inisialisasi Repositories (Infrastructure Layer)
        self.province_repo = CSVProvinceRepository(data_path)
        self.regency_repo = CSVRegencyRepository(data_path)
        self.district_repo = CSVDistrictRepository(data_path)
        self.village_repo = CSVVillageRepository(data_path)
        
        # Inisialisasi Use Cases (Application Layer)
        self.get_provinces_uc = GetProvinces(self.province_repo)
        self.get_regencies_uc = GetRegencies(self.regency_repo)

    def get_all_provinces(self) -> List[Province]:
        """
        Mendapatkan semua daftar provinsi.
        """
        return self.get_provinces_uc.execute()

    def get_regencies_by_province(self, province_code: str) -> List[Regency]:
        """
        Mendapatkan daftar kabupaten/kota di suatu provinsi.
        """
        return self.get_regencies_uc.execute(province_code)

    def get_districts_by_regency(self, regency_code: str) -> List[District]:
        """
        Mendapatkan daftar kecamatan di suatu kabupaten/kota.
        """
        # Note: Implement use case if needed, but for now we can call repo directly or add UC
        return self.district_repo.find_by_regency_code(regency_code)

    def get_villages_by_district(self, district_code: str) -> List[Village]:
        """
        Mendapatkan daftar desa/kelurahan di suatu kecamatan.
        """
        return self.village_repo.find_by_district_code(district_code)
