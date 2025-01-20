"use client";
import React, { useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import FHIR from "fhirclient"
import Client from "fhirclient/lib/Client";
import { AppContext } from "@/lib/hooks/AppContext/AppContext";

interface IPage {
    params: { [key: string]: any }
    searchParams: { [key: string]: string | string[] | undefined }
}

export default function Page(props: IPage) {
    const router = useRouter();
    const appContext = useContext(AppContext);

    useEffect(() => {
        FHIR.oauth2.ready()
            .then(async (client: Client) => {
                // Save the fhirClient...
                appContext.setFhirClient(client);

                // Save some data from the response...
                if (client.patient.id) { appContext.setPatientFhirId(client.patient.id ?? ""); }
                if (client.state.serverUrl) { appContext.setFhirUrl(client.state.serverUrl ?? ""); }
                appContext.setAccessToken(client.state.tokenResponse?.access_token ?? "");
                appContext.setIdToken(client.state.tokenResponse?.id_token ?? "");

                // Redirect to /patient-sphere/patient/patient-details...
                router.push("/patient-sphere/patient/patient-details");
            })
            .catch(console.error);
    }, [appContext]);

    return (<div>Loading...</div>);
}