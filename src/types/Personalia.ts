interface Personalia {
    ident: string;
    fornavn: string;
    etternavn: string;
    fødselsdato: string;
    fortrolig: boolean;
    strengtFortrolig: boolean;
    skjermet: boolean;
    barn: Barn[];
}

export interface Barn extends Personalia {}

export default Personalia;
