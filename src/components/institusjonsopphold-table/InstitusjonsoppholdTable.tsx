import React from 'react';
import { Table } from '@navikt/ds-react';
import { Institusjonsopphold } from '../../types/Søknad';
import { formatÅpenPeriode } from '../../utils/date';
import { ÅpenPeriode } from '../../types/Periode';
import VedtakUtfallText from '../vedtak-utfall-text/VedtakUtfallText';

interface InstitusjonsoppholdTableProps {
    institusjonsopphold: Institusjonsopphold;
}

const InstitusjonsoppholdTable = ({ institusjonsopphold }: InstitusjonsoppholdTableProps) => {
    const { vilkårsvurderinger } = institusjonsopphold;
    return (
        <div>
            <Table>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>Registrering</Table.HeaderCell>
                        <Table.HeaderCell>Institusjon</Table.HeaderCell>
                        <Table.HeaderCell>Periode</Table.HeaderCell>
                        <Table.HeaderCell>Kilde</Table.HeaderCell>
                        <Table.HeaderCell>Detaljer</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {vilkårsvurderinger.map(({ utfall, kilde, detaljer, ytelse, periode }, index) => (
                        <Table.Row key={`${utfall}${index}`}>
                            <Table.DataCell>
                                <VedtakUtfallText utfall={utfall} />
                            </Table.DataCell>
                            <Table.DataCell>{ytelse}</Table.DataCell>
                            <Table.DataCell>{periode ? formatÅpenPeriode(periode as ÅpenPeriode) : '-'}</Table.DataCell>
                            <Table.DataCell>{kilde}</Table.DataCell>
                            <Table.DataCell>{detaljer}</Table.DataCell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table>
        </div>
    );
};

export default InstitusjonsoppholdTable;