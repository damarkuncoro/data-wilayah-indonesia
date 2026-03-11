from dataclasses import dataclass

@dataclass(frozen=True)
class AdministrativeUnit:
    """
    Base class untuk semua unit administratif di Indonesia.
    Mengikuti prinsip SRP dengan hanya menyimpan data dasar.
    """
    code: str
    name: str

    def __post_init__(self):
        """
        Validasi dasar setelah inisialisasi.
        """
        if not self.code:
            raise ValueError("Kode administratif tidak boleh kosong.")
        if not self.name:
            raise ValueError("Nama administratif tidak boleh kosong.")
