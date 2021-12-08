import { useCallback } from "react";
import { useStore, SearchParameters } from "../store";
import { Link } from "@inertiajs/inertia-react";

function useSearchParameter<T extends keyof SearchParameters>(
    key: T
): [SearchParameters[T], (val: string) => void] {
    const { datum, setSearchParameters } = useStore((state) => ({
        datum: state.searchParameters[key],
        setSearchParameters: state.setSearchParameters,
    }));

    const setter = useCallback(
        (val: string) => setSearchParameters({ [key]: val }),
        [key, setSearchParameters]
    );

    return [datum, setter];
}

export default function Search() {
    const [region, setRegion] = useSearchParameter("region");
    const [realm, setRealm] = useSearchParameter("realm");
    const [character, setCharacter] = useSearchParameter("character");

    return (
        <div>
            <select value={region} onChange={(e) => setRegion(e.target.value)}>
                {["US", "EU", "KR", "TW", "CN"].map((region) => (
                    <option key={region} value={region}>
                        {region}
                    </option>
                ))}
            </select>
            <input
                type="text"
                aria-label="Realm Name"
                placeholder="Realm Name"
                onChange={(e) => setRealm(e.target.value)}
                value={realm || ""}
            />
            <input
                type="text"
                aria-label="Character Name"
                placeholder="Character Name"
                onChange={(e) => setCharacter(e.target.value)}
                value={character || ""}
            />
            <Link
                as="button"
                disabled={!realm || !character}
                href={`/character/${region}/${realm}/${character}`}
            >
                Search
            </Link>
        </div>
    );
}
