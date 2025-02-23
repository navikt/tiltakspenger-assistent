import React from 'react';
import { Button, CopyButton, Heading, HStack, Table, VStack } from '@navikt/ds-react';
import { useHentSøknaderOgBehandlinger } from '../hooks/useHentSøknaderOgBehandlinger';
import { pageWithAuthentication } from '../auth/pageWithAuthentication';
import { formaterTidspunkt, periodeTilFormatertDatotekst } from '../utils/date';
import {
    finnBehandlingstypeTekst,
    finnBehandlingStatusTekst,
} from '../utils/tekstformateringUtils';
import Varsel from '../components/varsel/Varsel';
import { BehandlingKnappForOversikt } from '../components/behandlingsknapper/BehandlingKnappForOversikt';
import Link from 'next/link';
import { StartSøknadBehandling } from '../components/behandlingsknapper/start-behandling/StartSøknadBehandling';
import { fetchJsonFraApi } from '../utils/server-fetch';
import { BehandlingEllerSøknadForOversiktData } from '../types/BehandlingTypes';

type Props = {
    initialData: BehandlingEllerSøknadForOversiktData[];
};

const Oversikten = ({ initialData }: Props) => {
    const { søknaderOgBehandlinger, error } = useHentSøknaderOgBehandlinger(initialData);

    if (error) {
        return (
            <Varsel
                variant={'error'}
                melding={`Feil ved lasting av data til oversikten - [${error.status}] ${error.message}`}
            />
        );
    }

    if (!søknaderOgBehandlinger || søknaderOgBehandlinger.length === 0) {
        return <Varsel variant="info" melding={`Ingen søknader eller behandlinger i basen`} />;
    }

    return (
        <VStack gap="5" style={{ padding: '1rem' }}>
            <Heading size="medium" level="2">
                Oversikt over behandlinger og søknader
            </Heading>
            <Table>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell scope="col">Fødselsnummer</Table.HeaderCell>
                        <Table.HeaderCell scope="col">Type</Table.HeaderCell>
                        <Table.HeaderCell scope="col">Kravtidspunkt</Table.HeaderCell>
                        <Table.HeaderCell scope="col">Status</Table.HeaderCell>
                        <Table.HeaderCell scope="col">Periode</Table.HeaderCell>
                        <Table.HeaderCell scope="col">Saksbehandler</Table.HeaderCell>
                        <Table.HeaderCell scope="col">Beslutter</Table.HeaderCell>
                        <Table.HeaderCell scope="col">Handlinger</Table.HeaderCell>
                        <Table.HeaderCell scope="col"></Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {søknaderOgBehandlinger.map((søknadEllerBehandling) => {
                        const {
                            fnr,
                            typeBehandling,
                            kravtidspunkt,
                            status,
                            underkjent,
                            periode,
                            saksbehandler,
                            beslutter,
                            saksnummer,
                            id,
                        } = søknadEllerBehandling;

                        return (
                            <Table.Row shadeOnHover={false} key={id}>
                                <Table.HeaderCell scope="row" style={{ wordBreak: 'unset' }}>
                                    <HStack align="center">
                                        {fnr}
                                        <CopyButton copyText={fnr} variant="action" size="small" />
                                    </HStack>
                                </Table.HeaderCell>
                                <Table.DataCell>
                                    {finnBehandlingstypeTekst[typeBehandling]}
                                </Table.DataCell>
                                <Table.DataCell>
                                    {kravtidspunkt ? formaterTidspunkt(kravtidspunkt) : 'Ukjent'}
                                </Table.DataCell>
                                <Table.DataCell>
                                    {finnBehandlingStatusTekst(status, underkjent)}
                                </Table.DataCell>
                                <Table.DataCell>
                                    {periode && `${periodeTilFormatertDatotekst(periode)}`}
                                </Table.DataCell>
                                <Table.DataCell>{saksbehandler ?? 'Ikke tildelt'}</Table.DataCell>
                                <Table.DataCell>{beslutter ?? 'Ikke tildelt'}</Table.DataCell>
                                <Table.DataCell scope="col">
                                    {status === 'SØKNAD' ? (
                                        <StartSøknadBehandling søknad={søknadEllerBehandling} />
                                    ) : (
                                        <BehandlingKnappForOversikt
                                            behandling={søknadEllerBehandling}
                                        />
                                    )}
                                </Table.DataCell>
                                <Table.DataCell>
                                    {status !== 'SØKNAD' && (
                                        <>
                                            <Button
                                                as={Link}
                                                style={{ marginRight: '1rem' }}
                                                size="small"
                                                variant={'secondary'}
                                                href={`/sak/${saksnummer}`}
                                            >
                                                Se sak
                                            </Button>
                                            <Button
                                                as={Link}
                                                size="small"
                                                variant={'secondary'}
                                                href={`/behandling/${id}`}
                                            >
                                                Se behandling
                                            </Button>
                                        </>
                                    )}
                                </Table.DataCell>
                            </Table.Row>
                        );
                    })}
                </Table.Body>
            </Table>
        </VStack>
    );
};
export const getServerSideProps = pageWithAuthentication(async (context) => {
    const behandlingerOgSøknader = await fetchJsonFraApi<BehandlingEllerSøknadForOversiktData[]>(
        context.req,
        '/behandlinger',
    );

    return { props: { initialData: behandlingerOgSøknader || [] } satisfies Props };
});

export default Oversikten;
