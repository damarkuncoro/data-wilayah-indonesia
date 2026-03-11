from abc import ABC, abstractmethod
from typing import List
from ..entities.village import Village
from .repository import Repository

class VillageRepository(Repository[Village], ABC):
    """
    Interface Repository khusus untuk Desa/Kelurahan.
    """
    @abstractmethod
    def find_by_district_code(self, district_code: str) -> List[Village]:
        pass
