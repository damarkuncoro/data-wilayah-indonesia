from dataclasses import dataclass
from enum import Enum
from .administrative_unit import AdministrativeUnit

class VillageType(Enum):
    DESA = "DESA"
    KELURAHAN = "KELURAHAN"

@dataclass(frozen=True)
class Village(AdministrativeUnit):
    """
    Entitas untuk tingkat Desa/Kelurahan.
    """
    district_code: str
    type: VillageType

    def __post_init__(self):
        super().__post_init__()
        if not self.district_code:
            raise ValueError("District code tidak boleh kosong.")
        if not isinstance(self.type, VillageType):
            raise ValueError("Village type tidak valid.")
