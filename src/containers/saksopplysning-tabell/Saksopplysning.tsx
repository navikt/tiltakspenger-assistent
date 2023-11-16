import { PencilIcon } from '@navikt/aksel-icons';
import { Table, BodyShort, Button } from '@navikt/ds-react';
import { UtfallIcon } from '../../components/utfall-icon/UtfallIcon';
import { RedigeringSkjema } from './RedigeringSkjema';
import { useState } from 'react';

interface SaksopplysningProps {
    vilkår: string;
    utfall: string;
    fom: string;
    tom: string;
    kilde: string;
    detaljer: string;
    fakta: string;
    behandlingId: string;
}

export const Saksopplysning = ({
    vilkår,
    utfall,
    fom,
    tom,
    kilde,
    detaljer,
    fakta,
    behandlingId,
}: SaksopplysningProps) => {
    const [åpneRedigering, onÅpneRedigering] = useState<boolean>(false);

    const håndterLukkRedigering = () => {
        onÅpneRedigering(false);
    };

    return (
        <>
            <Table.Row key={vilkår}>
                <Table.DataCell>
                    <UtfallIcon utfall={utfall} />
                </Table.DataCell>
                <Table.DataCell>
                    <BodyShort>{vilkår}</BodyShort>
                </Table.DataCell>
                <Table.DataCell>
                    <BodyShort>{fakta}</BodyShort>
                </Table.DataCell>
                <Table.DataCell>
                    <BodyShort>{fom && tom ? `${fom} - ${tom}` : '-'}</BodyShort>
                </Table.DataCell>
                <Table.DataCell>
                    <BodyShort>{kilde ? kilde : '-'}</BodyShort>
                </Table.DataCell>
                <Table.DataCell>
                    <BodyShort>{detaljer ? detaljer : '-'}</BodyShort>
                </Table.DataCell>
                <Table.DataCell>
                    <Button
                        onClick={() => onÅpneRedigering(!åpneRedigering)}
                        variant="tertiary"
                        iconPosition="left"
                        icon={<PencilIcon />}
                        aria-label="hidden"
                    />
                </Table.DataCell>
            </Table.Row>

            {åpneRedigering && (
                <Table.DataCell colSpan={7} style={{ padding: '0' }}>
                    <RedigeringSkjema
                        behandlingId={behandlingId}
                        vilkår={vilkår}
                        håndterLukkRedigering={håndterLukkRedigering}
                    />
                </Table.DataCell>
            )}
        </>
    );
};