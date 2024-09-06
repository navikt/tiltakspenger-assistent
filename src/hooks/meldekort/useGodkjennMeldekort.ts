import useSWRMutation from 'swr/mutation';
import { FetcherError, throwErrorIfFatal } from '../../utils/http';

export async function mutateMeldekort<R>(
  url,
  { arg }: { arg: any },
): Promise<R> {
  const res = await fetch(url, {
    method: 'POST',
    body: JSON.stringify(arg),
  });
  await throwErrorIfFatal(res);
  return res.json();
}

export function useGodkjennMeldekort(meldekortId: string) {
  const {
    trigger: onGodkjennMeldekort,
    isMutating: isMeldekortMutating,
    error,
  } = useSWRMutation<any, FetcherError, any, any>(
    `/api/meldekort/${meldekortId}/iverksett`,
    mutateMeldekort,
  );

  return { onGodkjennMeldekort, isMeldekortMutating, error };
}
