import { Periode } from '../../types/Periode';

export interface TiltaksdeltagelseDTO {
  deltagelsesperioder: Deltagelsesperiode[];
  tiltaksvariant: string;
  status: string;
  periode: Periode;
  antallDager: number;
  harSøkt: boolean;
  girRett: boolean;
  kilde: string;
}

export interface Deltagelsesperiode {
  periode: Periode;
  antallDager: number;
  status: String;
}
