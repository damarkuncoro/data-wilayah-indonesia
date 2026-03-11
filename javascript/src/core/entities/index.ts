export interface Province {
  code: string;
  name: string;
  [key: string]: any;
}

export interface Regency {
  code: string;
  name: string;
  provinceCode: string;
  type: string;
  [key: string]: any;
}

export interface District {
  code: string;
  name: string;
  regencyCode: string;
  [key: string]: any;
}

export interface Village {
  code: string;
  name: string;
  districtCode: string;
  type: string;
  [key: string]: any;
}
