from abc import ABC, abstractmethod
from typing import List
from ..entities.regency import Regency
from .repository import Repository

class RegencyRepository(Repository[Regency], ABC):
    """
    Interface Repository khusus untuk Kabupaten/Kota.
    """
    @abstractmethod
    def find_by_province_code(self, province_code: str) -> List[Regency]:
        pass
