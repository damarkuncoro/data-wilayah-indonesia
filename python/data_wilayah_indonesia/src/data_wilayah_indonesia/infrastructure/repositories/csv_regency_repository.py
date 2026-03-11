import pandas as pd
from typing import List, Optional
from .base_csv_repository import BaseCSVRepository
from ...core.entities.regency import Regency, RegencyType
from ...core.interfaces.regency_repository import RegencyRepository

class CSVRegencyRepository(BaseCSVRepository[Regency], RegencyRepository):
    """
    Implementasi CSV untuk RegencyRepository.
    """
    def __init__(self, data_path: str):
        super().__init__(data_path)
        self._regency_df = None

    @property
    def df(self) -> pd.DataFrame:
        if self._regency_df is None:
            full_df = super().df
            # Kabupaten/Kota memiliki kode sepanjang 5 digit (misal: "11.01")
            self._regency_df = full_df[full_df['code'].str.len() == 5]
        return self._regency_df

    def find_by_province_code(self, province_code: str) -> List[Regency]:
        results = self.df[self.df['code'].str.startswith(f"{province_code}.")]
        return [self._to_entity(row) for _, row in results.iterrows()]

    def _to_entity(self, row: pd.Series) -> Regency:
        name = str(row['name'])
        # Tentukan tipe berdasarkan nama
        reg_type = RegencyType.KOTA if "KOTA" in name.upper() else RegencyType.KABUPATEN
        
        return Regency(
            code=str(row['code']),
            name=name,
            province_code=str(row['code'])[:2],
            type=reg_type
        )
