type CensusGeoResponse = {
    result?: {
        geographies?: Record<string, Array<Record<string, any>>>;
        input?: any;
    };
};

type CountyCity = { county: string; city: string };

export async function getCountyCityByLatLonNY(lat: number, lon: number, signal?: AbortSignal): Promise<CountyCity> {
    const url = new URL("https://geocoding.geo.census.gov/geocoder/geographies/coordinates");
    url.searchParams.set("x", String(lon));
    url.searchParams.set("y", String(lat));
    url.searchParams.set("benchmark", "Public_AR_Current");
    url.searchParams.set("vintage", "Current_Current");
    url.searchParams.set("format", "json");

    const r = await fetch(url.toString(), { signal });
    console.log(url.toString());
    //ОБРОБКА ПОМИЛОК ПОТІМ
    if (!r.ok) throw new Error(`Census geocoder failed: HTTP ${r.status}`);

    const data = (await r.json()) as CensusGeoResponse;

    const geos = data.result?.geographies;
    if (!geos) throw new Error("No geographies in Census response");

    // state перевірка (NY = 36, або STUSAB = "NY")
    const st = geos["States"]?.[0];
    const stusab = st?.STUSAB ?? null;
    if (stusab !== "NY") throw new Error(`Not NY (STUSAB=${stusab ?? "null"})`);

    const county = (geos["Counties"]?.[0]?.NAME as string | undefined)?.trim();
    if (!county) throw new Error("County not found");

    // Для “city” краще брати Incorporated Places (якщо є), інакше county subdivision (borough/town)
    const city =
        ((geos["Incorporated Places"]?.[0]?.NAME as string | undefined)?.trim() ??
            (geos["County Subdivisions"]?.[0]?.NAME as string | undefined)?.trim() ??
            "");

    return { county, city };
}