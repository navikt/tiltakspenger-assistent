import TiltaksdeltagelseDemo from '../../../components/tiltaksdeltagelse-demo/TiltaksdeltagelseDemo';
import {
  pageWithAuthentication,
  redirectToLogin,
} from '../../../utils/pageWithAuthentication';
import { getOnBehalfOfToken } from '../../../utils/auth';
import { TiltaksdeltagelseDTO } from '../../../components/tiltaksdeltagelse-demo/types';

interface SandboxPageProps {
  tiltaksdeltagelser: TiltaksdeltagelseDTO[];
}

const SandboxPageWithBehandlingId = ({
  tiltaksdeltagelser,
}: SandboxPageProps) => {
  return <TiltaksdeltagelseDemo tiltaksdeltagelser={tiltaksdeltagelser} />;
};

export default SandboxPageWithBehandlingId;

export const getServerSideProps = pageWithAuthentication(async (context) => {
  const backendUrl = process.env.TILTAKSPENGER_VEDTAK_URL;
  const scope = `api://${process.env.SCOPE}/.default`;

  let token = null;
  try {
    token = await getOnBehalfOfToken(
      context.req.headers.authorization!!.replace('Bearer ', ''),
      scope!!,
    );
  } catch (error) {
    console.error(
      `Bruker har ikke tilgang, feilet på tokenveksling: ${JSON.stringify(error)}`,
    );
    return redirectToLogin(context);
  }

  const behandlingId = context.params!.behandlingId;
  const response: Response = await fetch(
    `${backendUrl}/behandling/${behandlingId}/inngangsvilkar`,
    {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${token}`,
      },
    },
  );

  const responseJson = await response.json();
  return {
    props: {
      tiltaksdeltagelser: responseJson.tiltaksdeltagelser,
    },
  };
});
