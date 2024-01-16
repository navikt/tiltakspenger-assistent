import {useState} from "react";
import useSWR from "swr";
import {fetcher, FetcherError} from "../utils/http";
import toast from "react-hot-toast";
import {MeldekortUtenDager} from "../types/MeldekortTypes";

//TODO: Bruk vedtakId isf. behandlingId
export function useMeldekortListe(behandlingId: string) {
    const [meldekortliste, setMeldekortliste] = useState<MeldekortUtenDager[]>();
    const [fantGrunnlag, setFantGrunnlag]  = useState<Boolean>(true);
    const { data, isLoading } = useSWR<MeldekortUtenDager[]>(`/api/meldekort/hentAlleForBehandling/${behandlingId}`, fetcher, {
        shouldRetryOnError: false,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        onSuccess: (data) => {
            setMeldekortliste(data);
        },
        onError: (error: FetcherError) => {
            setFantGrunnlag(false);
            toast.error(`[${error.status}]: ${error.info}`);
        },
    });
    return { meldekortliste, isLoading, fantGrunnlag };
}