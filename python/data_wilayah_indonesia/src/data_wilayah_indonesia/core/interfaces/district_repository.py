from abc import ABC, abstractmethod
from typing import List
from ..entities.district import District
from .repository import Repository

class DistrictRepository(Repository[District], ABC):
    """
    Interface Repository khusus untuk Kecamatan.
    """
    @abstractmethod
    def find_by_regency_code(self, regency_code: str) -> List[District]:
        pass
