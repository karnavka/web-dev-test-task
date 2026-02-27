type CountyCity = { county: string; city: string };

type CensusGeoResponse = {
    result?: {
        addressMatches?: Array<{
            addressComponents?: { city?: string; state?: string };
            geographies?: Record<string, Array<{ NAME?: string }>>;
        }>;
    };
};

export async function getCountyCityByLatLonNY(lat: number, lon: number, signal?: AbortSignal): Promise<CountyCity> {
    const url = new URL("https://geocoding.geo.census.gov/geocoder/geographies/coordinates");
    url.searchParams.set("x", String(lon));
    url.searchParams.set("y", String(lat));
    url.searchParams.set("benchmark", "Public_AR_Current");
    url.searchParams.set("vintage", "Current_Current");
    url.searchParams.set("format", "json");

    const r = await fetch(url.toString(), { signal });
    //ОБРОБКА ПОМИЛОК ПОТІМ
    if (!r.ok) throw new Error(`Census geocoder failed: HTTP ${r.status}`);

    const data = (await r.json()) as CensusGeoResponse;

    const match = data.result?.addressMatches?.[0];
    const state = match?.addressComponents?.state ?? null;
    //ОБРОБКА ПОМИЛОК ПОТІМ
    /* if (state !== "NY") {
       throw new Error(`Not NY (state=${state ?? "null"})`);
     }*/

    let county = match?.geographies?.["Counties"]?.[0]?.NAME?.trim();
    //ОБРОБКА ПОМИЛОК ПОТІМ
    if (!county) county = "Unknown County";

    const city = (match?.addressComponents?.city ?? "").trim();
    return { county, city };
}