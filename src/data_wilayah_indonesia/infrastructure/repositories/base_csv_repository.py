import pandas as pd
from typing import List, Optional, Generic, TypeVar
from ...core.interfaces.repository import Repository

T = TypeVar('T')

class BaseCSVRepository(Repository[T]):
    """
    Base implementation for CSV-based repositories.
    Mengikuti prinsip DRY dengan menyediakan fungsionalitas umum.
    """
    def __init__(self, data_path: str):
        self.data_path = data_path
        self._df: Optional[pd.DataFrame] = None

    @property
    def df(self) -> pd.DataFrame:
        if self._df is None:
            self._df = pd.read_csv(self.data_path)
            # Pastikan kode adalah string
            self._df['code'] = self._df['code'].astype(str)
        return self._df

    def get_all(self) -> List[T]:
        return [self._to_entity(row) for _, row in self.df.iterrows()]

    def get_by_code(self, code: str) -> Optional[T]:
        result = self.df[self.df['code'] == code]
        if result.empty:
            return None
        return self._to_entity(result.iloc[0])

    def find_by_name(self, name: str) -> List[T]:
        results = self.df[self.df['name'].str.contains(name, case=False, na=False)]
        return [self._to_entity(row) for _, row in results.iterrows()]

    def _to_entity(self, row: pd.Series) -> T:
        """
        Metode abstrak untuk mengonversi baris CSV menjadi entitas.
        Harus diimplementasikan oleh subclass.
        """
        raise NotImplementedError("Subclasses must implement _to_entity")
