from dataclasses import dataclass
from .administrative_unit import AdministrativeUnit

@dataclass(frozen=True)
class Province(AdministrativeUnit):
    """
    Entitas untuk tingkat Provinsi.
    Mengikuti prinsip DDD dengan fokus pada domain provinsi.
    """
    pass
