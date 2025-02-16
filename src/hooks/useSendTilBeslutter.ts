import useSWRMutation from 'swr/mutation';
import { FetcherError, mutateBehandling } from '../utils/http';
import router from 'next/router';
import { mutate } from 'swr';
import { Behandling, TypeBehandling } from '../types/BehandlingTypes';

export const finnOversiktslenke = (saksnummer: string, type: TypeBehandling) => {
    return type === TypeBehandling.REVURDERING ? `/sak/${saksnummer}` : '/';
};

export function useSendTilBeslutter(behandlingId: string) {
    const {
        trigger: sendTilBeslutter,
        isMutating: senderTilBeslutter,
        error: sendTilBeslutterError,
    } = useSWRMutation<Behandling, FetcherError, any>(
        `/api/behandling/beslutter/${behandlingId}`,
        mutateBehandling,
        {
            onSuccess: (data) => {
                mutate(`/api/behandlinger`);
                mutate(`/api/behandling/${behandlingId}`);
                router.push(finnOversiktslenke(data.saksnummer, data.behandlingstype));
            },
        },
    );

    return { sendTilBeslutter, senderTilBeslutter, sendTilBeslutterError };
}
