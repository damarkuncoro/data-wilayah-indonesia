from dataclasses import dataclass
from enum import Enum
from .administrative_unit import AdministrativeUnit

class RegencyType(Enum):
    KABUPATEN = "KABUPATEN"
    KOTA = "KOTA"

@dataclass(frozen=True)
class Regency(AdministrativeUnit):
    """
    Entitas untuk tingkat Kabupaten/Kota.
    """
    province_code: str
    type: RegencyType

    def __post_init__(self):
        super().__post_init__()
        if not self.province_code:
            raise ValueError("Province code tidak boleh kosong.")
        if not isinstance(self.type, RegencyType):
            raise ValueError("Regency type tidak valid.")
