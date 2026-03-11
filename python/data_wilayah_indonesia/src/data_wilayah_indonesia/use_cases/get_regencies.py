from typing import List
from ..core.entities.regency import Regency
from ..core.interfaces.regency_repository import RegencyRepository

class GetRegencies:
    """
    Use case untuk mendapatkan kabupaten/kota berdasarkan kode provinsi.
    """
    def __init__(self, regency_repository: RegencyRepository):
        self.regency_repository = regency_repository

    def execute(self, province_code: str) -> List[Regency]:
        return self.regency_repository.find_by_province_code(province_code)
