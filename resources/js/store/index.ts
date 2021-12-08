import axios, { AxiosError } from "axios";
import create from "zustand";
import { devtools } from "zustand/middleware";
import { Ok, Err, Result } from "ts-results";

export interface Spell {
    name: string;
    id: number;
    icon: string;
}

export interface Gem {
    id: string;
    itemLevel: string;
}

export interface Item {
    name: string;
    quality: string;
    id: number;
    icon: string;
    itemLevel: string;
    bonusIDs: string[];
    gems?: Gem[];
}

export interface Legendary {
    id: number;
    name: string;
    icon: string;
}

export interface Parse {
    encounterName: string;
    percentile: number;
    rank: number;
    outOf: number;
    total: number;
    characterName: string;
    class: string;
    spec: string;
    gear: Item[];
    talents?: Spell[];
    legendaryEffects?: Legendary[];
}

export interface SearchParameters {
    region: string;
    realm?: string;
    character?: string;
}

export type SearchParameterUpdate = Partial<SearchParameters>;

export interface State {
    searchParameters: SearchParameters;
    parse?: Result<Parse, any>;
    setSearchParameters: (update: SearchParameterUpdate) => void;
    loadLatestParse: () => Promise<void>;
    setParse: (parse: Parse) => void;
}

export const useStore = create<State>(
    devtools((set, get) => ({
        searchParameters: {
            region: "US",
        },
        setSearchParameters: (update: SearchParameterUpdate) =>
            set((state) => ({
                searchParameters: { ...state.searchParameters, ...update },
            })),
        loadLatestParse: async () => {
            const { region, realm, character } = get().searchParameters;
            if (!realm || !character) {
                return set(() => ({
                    parse: Err(
                        new Error("unable to load parse: missing parameters")
                    ),
                }));
            }
            set(() => ({ parse: undefined }));
            try {
                const data = await axios.get(
                    `/api/parse/latest/${region}/${realm}/${character}`
                );
                return set(() => ({ parse: Ok(data.data) }));
            } catch (err) {
                return set(() => ({
                    parse: Err((err as AxiosError).response),
                }));
            }
        },
        setParse: (parse: Parse) => set(() => ({ parse: Ok(parse) })),
    }))
);

export default useStore;
