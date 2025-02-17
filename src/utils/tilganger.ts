import {
    BehandlingDeprecatedOgNy,
    BehandlingForOversiktProps,
    BehandlingStatus,
} from '../types/BehandlingTypes';
import {
    MeldekortBehandlingProps,
    MeldekortBehandlingStatus,
} from '../types/meldekort/MeldekortBehandling';
import { erBeslutter, erSaksbehandler, Saksbehandler } from '../types/Saksbehandler';

export const kanBeslutteForBehandling = (
    behandling: BehandlingDeprecatedOgNy,
    innloggetSaksbehandler: Saksbehandler,
) => {
    const { status, saksbehandler, beslutter } = behandling;

    return (
        erBeslutter(innloggetSaksbehandler) &&
        innloggetSaksbehandler.navIdent === beslutter &&
        innloggetSaksbehandler.navIdent !== saksbehandler &&
        status === BehandlingStatus.UNDER_BESLUTNING
    );
};

const kanBehandle = (
    innloggetSaksbehandler: Saksbehandler,
    saksbehandlerForBehandling?: string | null,
) =>
    erSaksbehandler(innloggetSaksbehandler) &&
    innloggetSaksbehandler.navIdent === saksbehandlerForBehandling;

export const kanSaksbehandleForBehandling = (
    behandling: BehandlingDeprecatedOgNy,
    innloggetSaksbehandler: Saksbehandler,
) => {
    return (
        kanBehandle(innloggetSaksbehandler, behandling.saksbehandler) &&
        behandling.status === BehandlingStatus.UNDER_BEHANDLING
    );
};

export const eierBehandling = (
    behandling: BehandlingForOversiktProps,
    innloggetSaksbehandler: Saksbehandler,
): boolean => {
    const { status, saksbehandler, beslutter } = behandling;

    switch (status) {
        case BehandlingStatus.UNDER_BEHANDLING:
            return innloggetSaksbehandler.navIdent === saksbehandler;
        case BehandlingStatus.UNDER_BESLUTNING:
            return innloggetSaksbehandler.navIdent === beslutter;
        default:
            return false;
    }
};

export const kanSaksbehandleForMeldekort = (
    meldekortBehandling: MeldekortBehandlingProps,
    innloggetSaksbehandler: Saksbehandler,
) =>
    kanBehandle(innloggetSaksbehandler, meldekortBehandling.saksbehandler) &&
    meldekortBehandling.status === MeldekortBehandlingStatus.KLAR_TIL_UTFYLLING;

export const kanBeslutteForMeldekort = (
    meldekort: MeldekortBehandlingProps,
    innloggetSaksbehandler: Saksbehandler,
) => {
    const { status, saksbehandler } = meldekort;

    return (
        erBeslutter(innloggetSaksbehandler) &&
        innloggetSaksbehandler.navIdent !== saksbehandler &&
        status === MeldekortBehandlingStatus.KLAR_TIL_BESLUTNING
    );
};

export const skalKunneTaBehandling = (
    behandling: BehandlingForOversiktProps,
    innloggetSaksbehandler: Saksbehandler,
) => {
    const { status, saksbehandler } = behandling;

    switch (status) {
        case BehandlingStatus.KLAR_TIL_BESLUTNING:
            return (
                erBeslutter(innloggetSaksbehandler) &&
                innloggetSaksbehandler.navIdent != saksbehandler
            );
        case BehandlingStatus.KLAR_TIL_BEHANDLING:
            return erSaksbehandler(innloggetSaksbehandler);
        default:
            return false;
    }
};
