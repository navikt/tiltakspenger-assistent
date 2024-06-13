import {
  BodyShort,
  Loader,
  Heading,
  Spacer,
  VStack,
  List,
} from '@navikt/ds-react';
import { useRouter } from 'next/router';
import { useHentBehandling } from '../../hooks/useHentBehandling';
import { formatPeriode } from '../../utils/date';
import { BehandlingKnapper } from '../behandling-knapper/BehandlingKnapper';
import { avklarLesevisning } from '../../utils/avklarLesevisning';
import { useContext, useRef } from 'react';
import { SaksbehandlerContext } from '../../pages/_app';
import { Utfall } from '../../types/Utfall';

const Oppsummering = () => {
  const router = useRouter();
  const behandlingId = router.query.behandlingId as string;
  const { valgtBehandling, isLoading } = useHentBehandling(behandlingId);
  const { innloggetSaksbehandler } = useContext(SaksbehandlerContext);
  const modalRef = useRef(null);

  if (isLoading || !valgtBehandling) {
    return <Loader />;
  }

  const girInnvilget = valgtBehandling.samletUtfall === 'OPPFYLT';

  const lesevisning = avklarLesevisning(
    innloggetSaksbehandler!!,
    valgtBehandling.saksbehandler,
    valgtBehandling.beslutter,
    valgtBehandling.behandlingsteg,
    girInnvilget,
  );

  const finnUtfallsperiodetekst = (utfall: string) => {
    switch (utfall) {
      case 'GIR_RETT_TILTAKSPENGER':
        return 'Søker har oppfylt vilkårene ';
      case 'GIR_IKKE_RETT_TILTAKSPENGER':
        return 'Søker har ikke oppfylt vilkårene ';
      case 'KREVER_MANUELL_VURDERING':
        return 'Totalvurdering er uavklart ';
      default:
        return 'Totalvurdering er uavklart ';
    }
  };

  const saksopplysning = valgtBehandling.alderssaksopplysning;

  if (!saksopplysning) return <Loader />;

  return (
    <VStack gap="10">
      <Heading size="medium">Oppsummering</Heading>
      <List style={{ background: '#FFFFFF', padding: '1em' }}>
        {valgtBehandling.utfallsperioder.map((periode) => (
          <List.Item key={periode.fom}>
            <BodyShort>{`${finnUtfallsperiodetekst(periode.utfall)} for perioden ${formatPeriode({ fra: periode.fom, til: periode.tom })}`}</BodyShort>
          </List.Item>
        ))}
      </List>
      <BehandlingKnapper
        behandlingid={valgtBehandling.behandlingId}
        status={valgtBehandling.status}
        lesevisning={lesevisning}
        modalRef={modalRef}
      />
    </VStack>
  );
};

export default Oppsummering;