import { NextApiRequest, NextApiResponse } from 'next';
import { getToken } from '../../../utils/auth';

const backendUrl = process.env.TILTAKSPENGER_VEDTAK_URL;

const buildApiUrl = (pathname: string) => {
    const pathnameWithoutPrefix = pathname.replace('/api', '');
    return `${backendUrl}${pathnameWithoutPrefix}`;
};

function getSøknad(onBehalfOfToken: string, søknadId: string) {
    const personUrl = buildApiUrl(`/soknad/${søknadId}`);
    console.log(personUrl);
    return fetch(personUrl, {
        method: 'GET',
        headers: {
            'content-type': 'application/json',
            authorization: `Bearer ${onBehalfOfToken}`,
        },
    });
}

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
    try {
        const onBehalfOfToken = await getToken(request);
        const { søknadId } = request.query;
        const apiResponse = await getSøknad(onBehalfOfToken, søknadId as string);
        console.log('apiResponse', apiResponse);

        if (apiResponse.status !== 200) {
            const errorMessage = await apiResponse.text();
            response.status(apiResponse.status).json({ error: errorMessage });
        } else {
            try {
                const jsonResponse = await apiResponse.json();
                console.log('body', jsonResponse);
                response.status(apiResponse.status).json(jsonResponse);
            } catch (error) {
                console.error('Error processing json response');
                response.status(500).json({ error: 'Internal server error' });
            }
        }
    } catch (error) {
        console.error('Something went wrong during authorization', error);
        response.status(401).json({ error: 'Unauthorized' });
    }
}
