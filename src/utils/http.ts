import { logger } from '@navikt/next-logger';
import { NextApiRequest } from 'next';
import { MeldekortDTO } from '../types/MeldekortTypes';
import { finnFeilmelding } from './feilmeldinger';

const vedtakBackendUrl = process.env.TILTAKSPENGER_VEDTAK_URL || '';

export class FetcherError extends Error {
  info: { melding: string; kode: string };
  status: number | undefined;
}

export const fetcher = async (url: string) => {
  const res = await fetch(url);
  await throwErrorIfFatal(res);
  return res.json();
};

export async function mutateBehandling<R>(
  url,
  { arg }: { arg: { id: string } | { begrunnelse: string } | null },
): Promise<R> {
  const res = await fetch(url, {
    method: 'POST',
    body: JSON.stringify(arg),
  });
  await throwErrorIfFatal(res);
  return res.json();
}

export async function mutateMeldekort<R>(
  url,
  { arg }: { arg: MeldekortDTO },
): Promise<R> {
  const res = await fetch(url, {
    method: 'POST',
    body: JSON.stringify(arg),
  });
  await throwErrorIfFatal(res);
  return res.json();
}

export async function sakFetcher<R>(
  url,
  { arg }: { arg: { fnr: string } },
): Promise<R> {
  const res = await fetch(url, {
    method: 'POST',
    body: JSON.stringify(arg),
  });
  await throwErrorIfFatal(res);
  return res.json();
}

export const throwErrorIfFatal = async (res: Response) => {
  if (!res.ok) {
    const error = new FetcherError('Noe gikk galt');
    error.info = await res.json();
    error.status = res.status;
    error.message =
      finnFeilmelding(error.info.kode) ?? 'Noe har gått galt på serversiden';

    logger.error(error.message);

    throw error;
  }
};

export async function makeApiRequest(
  request: NextApiRequest,
  oboToken: string,
): Promise<Response> {
  const vedtakPath = request.url.replace('/api', '');
  const url = `${vedtakBackendUrl}${vedtakPath}`;

  logger.info(`Sender request til ${url}`);

  try {
    return await fetch(url, {
      method: request.method,
      body: request.method === 'GET' ? undefined : request.body,
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${oboToken}`,
      },
    });
  } catch (error) {
    logger.error('Fikk ikke kontakt med APIet', error);
  }
}
