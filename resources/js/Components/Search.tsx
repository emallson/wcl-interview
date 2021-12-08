import { useCallback } from "react";
import { useStore, SearchParameters } from "../store";
import { Link } from "@inertiajs/inertia-react";
import { Inertia } from "@inertiajs/inertia";
import styled from "styled-components";

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

const SearchContainer = styled.div`
    display: grid;
    grid-auto-flow: column;
    grid-column-gap: 0.5rem;

    & button {
        padding: 0 0.5em;
        &:disabled {
            border: 1px solid #ccc;
            color: #ccc;
        }

        border: 1px solid hsl(220, 8.9%, 46.1%);

        &:hover {
            box-shadow: 2px 1px 1px hsl(220, 8.9%, 46.1%);
        }
    }
`;

export default function Search() {
    const [region, setRegion] = useSearchParameter("region");
    const [realm, setRealm] = useSearchParameter("realm");
    const [character, setCharacter] = useSearchParameter("character");

    const url = `/character/${region}/${realm}/${character}`;

    return (
        <SearchContainer>
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
                onKeyDown={(e) => e.key === "Enter" && Inertia.visit(url)}
                value={character || ""}
            />
            <Link as="button" disabled={!realm || !character} href={url}>
                Search
            </Link>
        </SearchContainer>
    );
}
