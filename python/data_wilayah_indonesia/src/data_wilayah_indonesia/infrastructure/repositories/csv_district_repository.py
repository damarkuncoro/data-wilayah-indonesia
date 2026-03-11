import pandas as pd
from typing import List, Optional
from .base_csv_repository import BaseCSVRepository
from ...core.entities.district import District
from ...core.interfaces.district_repository import DistrictRepository

class CSVDistrictRepository(BaseCSVRepository[District], DistrictRepository):
    """
    Implementasi CSV untuk DistrictRepository.
    """
    def __init__(self, data_path: str):
        super().__init__(data_path)
        self._district_df = None

    @property
    def df(self) -> pd.DataFrame:
        if self._district_df is None:
            full_df = super().df
            # Kecamatan memiliki kode sepanjang 8 digit (misal: "11.01.01")
            self._district_df = full_df[full_df['code'].str.len() == 8]
        return self._district_df

    def find_by_regency_code(self, regency_code: str) -> List[District]:
        results = self.df[self.df['code'].str.startswith(f"{regency_code}.")]
        return [self._to_entity(row) for _, row in results.iterrows()]

    def _to_entity(self, row: pd.Series) -> District:
        return District(
            code=str(row['code']),
            name=str(row['name']),
            regency_code=str(row['code'])[:5]
        )
