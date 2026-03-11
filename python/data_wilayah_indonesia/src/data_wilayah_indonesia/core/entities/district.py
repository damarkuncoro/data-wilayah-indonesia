from dataclasses import dataclass
from .administrative_unit import AdministrativeUnit

@dataclass(frozen=True)
class District(AdministrativeUnit):
    """
    Entitas untuk tingkat Kecamatan.
    """
    regency_code: str

    def __post_init__(self):
        super().__post_init__()
        if not self.regency_code:
            raise ValueError("Regency code tidak boleh kosong.")
