import { NextApiRequest, NextApiResponse } from 'next';
import { withAuthenticatedApi } from '../../../auth/pageWithAuthentication';
import { getToken, requestOboToken } from '@navikt/oasis';
import { makeApiRequest } from '../../../utils/http';

async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> {
  const token = await getToken(req);
  const obo = await requestOboToken(
    token,
    `api://${process.env.UTBETALING_SCOPE}/.default`,
  );
  if (!obo.ok) {
    throw new Error(
      `Kunne ikke gjøre on-behalf-of-utveksling for saksbehandlertoken`,
    );
  }

  const response = await makeApiRequest(req, obo.token);
  if (response.ok) {
    const body = await response.json();
    res.status(response.status).json(body);
  } else {
    const error = await response.text();
    res
      .status(response.status)
      .json({ error: !error ? response.statusText : error });
  }
}

export default withAuthenticatedApi(handler);
