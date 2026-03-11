import { DataProvider } from '../../core/provider';
import { Province, Regency, District, Village } from '../../core/entities';
import { provinces } from '../../data/provinces';
import { regencies } from '../../data/regencies';
import { districts } from '../../data/districts';
import { villages } from '../../data/villages';

export class JsonDataProvider implements DataProvider {
  getProvinces(): Province[] {
    return provinces;
  }

  getRegencies(): Regency[] {
    return regencies;
  }

  getDistricts(): District[] {
    return districts;
  }

  getVillages(): Village[] {
    return villages;
  }
}
