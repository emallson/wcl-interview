import Search from "../Components/Search";
import PaperDoll from "../Components/PaperDoll";
import useStore, { SearchParameters, Parse } from "../store";
import shallow from "zustand/shallow";
import { useEffect } from "react";
import styled from "styled-components";

const Error = styled.span`
    color: red;
`;

export default function Character(
    {
        realm,
        region,
        character,
        data,
    }: SearchParameters & {
        data?: Parse;
    } /* destructuring because inertia also provides other props */
) {
    const { setSearchParameters, loadParse, parse, setParse } = useStore(
        ({ setSearchParameters, loadLatestParse, parse, setParse }) => ({
            setSearchParameters,
            loadParse: loadLatestParse,
            parse,
            setParse,
        }),
        shallow
    );

    useEffect(() => {
        setSearchParameters({ realm, region, character });
        if (data) {
            setParse(data);
        } else {
            loadParse();
        }
    }, [realm, region, character]);

    return (
        <div>
            <Search />
            {parse &&
                (parse.ok ? (
                    <PaperDoll parse={parse.val} />
                ) : (
                    <Error>{parse.val.data.reason}</Error>
                ))}
        </div>
    );
}
