import { CardIcon } from '@navikt/aksel-icons';
import { Detail, Heading, Label, VStack } from '@navikt/ds-react';
import React from 'react';
import styles from './MeldekortMeny.module.css';
import { useHentMeldekortListe } from '../../hooks/useHentMeldekortListe';
import { getWeekNumber, formatPeriode } from '../../utils/date';
import { MeldekortUtenDager } from '../../types/MeldekortTypes';
import IkonMedTekst from '../ikon-med-tekst/IkonMedTekst';
import { useRouter } from 'next/router';

interface MeldekortmenyProps {
  behandlingId: string;
}

const meldekortUkeNummer = (fom: Date, tom: Date): string => {
  return `Uke ${getWeekNumber(fom)} / ${getWeekNumber(tom)}`;
};

export const MeldekortMeny = ({ behandlingId }: MeldekortmenyProps) => {
  const { meldekortliste } = useHentMeldekortListe(behandlingId);
  const router = useRouter()

  return (
    <VStack className={styles.section}>
      <Heading size="xsmall" level="1" className={styles.heading}>
        <IkonMedTekst
          text={'Meldekort'}
          iconRenderer={() => <CardIcon stroke="#22262A" />}
          weight="semibold"
        />
      </Heading>
      <div className={styles.meldekortliste}>
        {meldekortliste?.map((meldekort: MeldekortUtenDager) => {
          return (
            <div key={meldekort.id} className={styles.listeelement} onClick={() => router.push(`/behandling/${behandlingId}/meldekort/${meldekort.id}`)}>
              <Label size="small">
                {meldekortUkeNummer(
                  meldekort.fom,
                  meldekort.tom
                )}
              </Label>
              <Detail>
                {formatPeriode({
                  fra: meldekort.fom.toString(),
                  til: meldekort.tom.toString(),
                })}
              </Detail>
            </div>
          );
        })}
      </div>
    </VStack>
  );
};