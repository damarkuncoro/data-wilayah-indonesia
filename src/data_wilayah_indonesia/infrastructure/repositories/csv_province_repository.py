import pandas as pd
from typing import List, Optional
from .base_csv_repository import BaseCSVRepository
from ...core.entities.province import Province
from ...core.interfaces.province_repository import ProvinceRepository

class CSVProvinceRepository(BaseCSVRepository[Province], ProvinceRepository):
    """
    Implementasi CSV untuk ProvinceRepository.
    Mengikuti prinsip Clean Architecture dengan memisahkan implementasi infra.
    """
    def __init__(self, data_path: str):
        super().__init__(data_path)
        self._province_df = None

    @property
    def df(self) -> pd.DataFrame:
        if self._province_df is None:
            full_df = super().df
            # Provinsi memiliki kode sepanjang 2 digit (misal: "11")
            self._province_df = full_df[full_df['code'].str.len() == 2]
        return self._province_df

    def _to_entity(self, row: pd.Series) -> Province:
        return Province(
            code=str(row['code']),
            name=str(row['name'])
        )
