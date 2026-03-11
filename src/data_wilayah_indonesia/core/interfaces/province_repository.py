from abc import ABC, abstractmethod
from typing import List
from ..entities.province import Province
from .repository import Repository

class ProvinceRepository(Repository[Province], ABC):
    """
    Interface Repository khusus untuk Provinsi.
    """
    pass
