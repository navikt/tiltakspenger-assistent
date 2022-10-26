import { NextApiRequest } from 'next';

const clientId = process.env.AZURE_APP_CLIENT_ID || '';
const clientSecret = process.env.AZURE_APP_CLIENT_SECRET || '';

function getFieldsForOnBehalfOfGrant(token: string, scope: string) {
    return {
        grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
        client_id: clientId,
        client_secret: clientSecret,
        assertion: token,
        scope: scope,
        requested_token_use: 'on_behalf_of',
    };
}

function createOnBehalfOfGrantBody(token: string, scope: string) {
    const oboGrantFields = getFieldsForOnBehalfOfGrant(token, scope);
    const body = new URLSearchParams();
    Object.entries(oboGrantFields).map(([fieldName, fieldValue = '']) => {
        body.append(fieldName, fieldValue);
    });
    return body;
}

const createOnBehalfOfGrantUrl = (tenantId: string) => `${process.env.AUTH_PROVIDER_URL}/${tenantId}/oauth2/v2.0/token`;

async function makeOnBehalfOfGrant(body: URLSearchParams) {
    const url = createOnBehalfOfGrantUrl('966ac572-f5b7-4bbe-aa88-c76419c0f851');
    return fetch(url, {
        method: 'POST',
        body,
        headers: {
            ['Content-Type']: 'application/x-www-form-urlencoded',
        },
    });
}

async function getOnBehalfOfToken(token: string, scope: string) {
    const grantBody = createOnBehalfOfGrantBody(token, scope);
    const response = await makeOnBehalfOfGrant(grantBody);
    if (!response.ok) {
        return Promise.reject({
            status: response.status,
            content: response.headers.get('content-type'),
            body: response.body,
        });
    }
    const jsonResponse = await response.json();
    return jsonResponse.access_token;
}

const tokenRegex = /^Bearer (?<token>(\.?([A-Za-z0-9-_]+)){3})$/m;

function validateAuthorizationHeader(request: NextApiRequest) {
    const { authorization } = request.headers;
    if (!authorization) {
        throw new Error('Ingen tilgang');
    }
    const authToken = authorization.match(tokenRegex)?.groups?.token;
    if (!authToken) {
        throw new Error('Ingen tilgang');
    }
    return authToken;
}

export async function getToken(request: NextApiRequest) {
    const scope = 'api://eafda703-c821-44de-990c-950dec1ad22f/.default';
    try {
        const authToken = validateAuthorizationHeader(request);
        const onBehalfOfToken = await getOnBehalfOfToken(authToken, scope);
        return onBehalfOfToken;
    } catch (error) {
        console.error('Something went wrong during authorization');
        throw new Error('Ingen tilgang');
    }
}
