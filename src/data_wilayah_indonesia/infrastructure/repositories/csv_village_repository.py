import pandas as pd
from typing import List, Optional
from .base_csv_repository import BaseCSVRepository
from ...core.entities.village import Village, VillageType
from ...core.interfaces.village_repository import VillageRepository

class CSVVillageRepository(BaseCSVRepository[Village], VillageRepository):
    """
    Implementasi CSV untuk VillageRepository.
    """
    def __init__(self, data_path: str):
        super().__init__(data_path)
        self._village_df = None

    @property
    def df(self) -> pd.DataFrame:
        if self._village_df is None:
            full_df = super().df
            # Desa/Kelurahan memiliki kode sepanjang 13 digit (misal: "11.01.01.2001")
            # Dalam data hasil ekstraksi, kode desa mungkin berbeda, sesuaikan polanya
            self._village_df = full_df[full_df['code'].str.len() > 8]
        return self._village_df

    def find_by_district_code(self, district_code: str) -> List[Village]:
        results = self.df[self.df['code'].str.startswith(f"{district_code}.")]
        return [self._to_entity(row) for _, row in results.iterrows()]

    def _to_entity(self, row: pd.Series) -> Village:
        name = str(row['name'])
        # Tentukan tipe berdasarkan kode (dalam sistem Kemendagri, desa mulai 2XXX, kelurahan mulai 1XXX)
        # Atau berdasarkan nama jika datanya eksplisit
        code_parts = str(row['code']).split('.')
        village_id = code_parts[-1] if code_parts else ""
        
        v_type = VillageType.KELURAHAN if village_id.startswith('1') else VillageType.DESA
        
        return Village(
            code=str(row['code']),
            name=name,
            district_code=".".join(code_parts[:-1]),
            type=v_type
        )
