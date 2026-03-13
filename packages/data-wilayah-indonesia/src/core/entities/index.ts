export interface Province {
  code: string;
  name: string;
  lat?: number;
  lon?: number;
  [key: string]: any;
}

export interface Regency {
  code: string;
  name: string;
  provinceCode: string;
  provinceName?: string;
  type: string;
  lat?: number;
  lon?: number;
  [key: string]: any;
}

export interface District {
  code: string;
  name: string;
  regencyCode: string;
  provinceName?: string;
  regencyName?: string;
  lat?: number;
  lon?: number;
  [key: string]: any;
}

export interface Village {
  code: string;
  name: string;
  districtCode: string;
  type: string;
  provinceName?: string;
  regencyName?: string;
  districtName?: string;
  postalCode?: string;
  lat?: number;
  lon?: number;
  [key: string]: any;
}
