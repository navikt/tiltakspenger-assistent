import { Loader, Tabs } from '@navikt/ds-react';
import router from 'next/router';
import { useHentBehandling } from '../../hooks/useHentBehandling';
import { BehandlingStatus } from '../../types/BehandlingTypes';
import { useContext, useState } from 'react';
import { BehandlingContext } from '../layout/SaksbehandlingLayout';
import { SaksbehandlerContext } from '../../pages/_app';
import { kanSaksbehandleForBehandling } from '../../utils/tilganger';

export const Saksbehandlingstabs = () => {
  const aktivTab = router.route.split('/')[3];
  const { innloggetSaksbehandler } = useContext(SaksbehandlerContext);
  const { behandlingId } = useContext(BehandlingContext);
  const { valgtBehandling, isLoading } = useHentBehandling(behandlingId);
  const [value, setValue] = useState(aktivTab);

  if (isLoading || !valgtBehandling) {
    return <Loader />;
  }
  const underBehandling = (status: string) =>
    status === BehandlingStatus.UNDER_BEHANDLING;
  const iverksatt = (status: string) => status === BehandlingStatus.INNVILGET;

  return (
    <Tabs value={value} onChange={setValue}>
      <Tabs.List>
        {underBehandling(valgtBehandling.status) &&
          kanSaksbehandleForBehandling(
            valgtBehandling.status,
            innloggetSaksbehandler,
            valgtBehandling.saksbehandler,
          ) && (
            <Tabs.Tab
              value={'inngangsvilkar'}
              label={'Inngangsvilkår'}
              id="inngangsvilkår-tab"
              aria-controls="inngangsvilkår-panel"
              onClick={() =>
                router.push(
                  `/behandling/${behandlingId}/inngangsvilkar/kravfrist`,
                )
              }
            />
          )}
        <Tabs.Tab
          value={'oppsummering'}
          label={'Oppsummering'}
          id="oppsummering-tab"
          aria-controls="oppsummering-panel"
          onClick={() =>
            router.push(`/behandling/${behandlingId}/oppsummering`)
          }
        />
        {iverksatt(valgtBehandling.status) && (
          <>
            <Tabs.Tab
              value={'meldekort'}
              label={'Meldekort'}
              id="meldekort-tab"
              aria-controls="meldekort-panel"
              onClick={() =>
                router.push(`/behandling/${behandlingId}/meldekort`)
              }
            />
          </>
        )}
      </Tabs.List>
    </Tabs>
  );
};
