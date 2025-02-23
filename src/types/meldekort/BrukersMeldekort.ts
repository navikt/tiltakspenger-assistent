export type BrukersMeldekortId = `meldekort_${string}`;

export enum BrukersMeldekortDagStatus {
    DELTATT = 'DELTATT',
    FRAVÆR_SYK = 'FRAVÆR_SYK',
    FRAVÆR_SYKT_BARN = 'FRAVÆR_SYKT_BARN',
    FRAVÆR_ANNET = 'FRAVÆR_ANNET',
    // Denne er forvirrende, betyr her "ikke godkjent fravær", men i meldekort-behandlingen betyr den "ikke tiltak denne dagen"
    // Bør renames ett av stedene
    IKKE_DELTATT = 'IKKE_DELTATT',
    IKKE_REGISTRERT = 'IKKE_REGISTRERT',
}

export type BrukersMeldekortDagProps = {
    dato: string;
    status: BrukersMeldekortDagStatus;
};

export type BrukersMeldekortProps = {
    id: BrukersMeldekortId;
    mottatt: string;
    dager: BrukersMeldekortDagProps[];
};
