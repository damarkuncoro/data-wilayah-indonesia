from abc import ABC, abstractmethod
from typing import List, Optional, TypeVar, Generic

T = TypeVar('T')

class Repository(Generic[T], ABC):
    """
    Interface Repository dasar (Generic).
    Mengikuti prinsip SOLID (ISP, DIP).
    """
    @abstractmethod
    def get_all(self) -> List[T]:
        pass

    @abstractmethod
    def get_by_code(self, code: str) -> Optional[T]:
        pass

    @abstractmethod
    def find_by_name(self, name: str) -> List[T]:
        pass
