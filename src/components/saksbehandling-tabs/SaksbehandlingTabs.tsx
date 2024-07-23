import { FileTextIcon, TasklistIcon } from '@navikt/aksel-icons';
import { Tabs } from '@navikt/ds-react';
import { useRouter } from 'next/router';
import { useHentMeldekortListe } from '../../hooks/useHentMeldekortListe';
import { useHentBehandling } from '../../hooks/useHentBehandling';
import { useHentUtbetalingListe } from '../../hooks/useHentUtbetalingListe';
import { BehandlingTilstand } from '../../types/BehandlingTypes';

interface SaksbehandlingTabsProps {
  behandlingId: string;
}

export const SaksbehandlingTabs = ({
  behandlingId,
}: SaksbehandlingTabsProps) => {
  const router = useRouter();
  const { valgtBehandling } = useHentBehandling(behandlingId);
  const tilBeslutter =
    valgtBehandling?.behandlingTilstand === BehandlingTilstand.TIL_BESLUTTER;
  const iverksatt =
    valgtBehandling?.behandlingTilstand === BehandlingTilstand.IVERKSATT;
  const { meldekortliste } = useHentMeldekortListe(iverksatt, behandlingId);
  const { utbetalingliste } = useHentUtbetalingListe(iverksatt, behandlingId);

  return (
    <Tabs defaultValue="Inngangsvilkår">
      <Tabs.List>
        {!tilBeslutter && !iverksatt && (
          <Tabs.Tab
            key={'Inngangsvilkår'}
            value={'Inngangsvilkår'}
            label={'Inngangsvilkår'}
            icon={<FileTextIcon />}
            onClick={() => {
              router.push(
                `/behandling/${behandlingId}/inngangsvilkar/kravfrist`,
              );
            }}
          />
        )}
        <Tabs.Tab
          key={'Oppsummering'}
          value={'Oppsummering'}
          label={'Oppsummering'}
          icon={<TasklistIcon />}
          onClick={() => {
            router.push(`/behandling/${behandlingId}/oppsummering`);
          }}
        />
        {iverksatt && (
          <>
            <Tabs.Tab
              key={'Meldekort'}
              value={'Meldekort'}
              label={'Meldekort'}
              icon={<FileTextIcon />}
              onClick={() => {
                meldekortliste &&
                  router.push(
                    `/behandling/${behandlingId}/meldekort/${meldekortliste[0].id}`,
                  );
              }}
            />
            <Tabs.Tab
              key={'Utbetaling'}
              value={'Utbetaling'}
              label={'Utbetaling'}
              icon={<FileTextIcon />}
              onClick={() => {
                router.push(
                  `/behandling/${behandlingId}/utbetaling/${utbetalingliste[0].id}`,
                );
              }}
            />
          </>
        )}
      </Tabs.List>
    </Tabs>
  );
};
