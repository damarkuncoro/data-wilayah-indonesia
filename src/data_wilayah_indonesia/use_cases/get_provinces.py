from typing import List
from ..core.entities.province import Province
from ..core.interfaces.province_repository import ProvinceRepository

class GetProvinces:
    """
    Use case untuk mendapatkan semua provinsi.
    Mengikuti prinsip SRP (Single Responsibility Principle).
    """
    def __init__(self, province_repository: ProvinceRepository):
        self.province_repository = province_repository

    def execute(self) -> List[Province]:
        return self.province_repository.get_all()
