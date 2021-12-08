import { Spell, Parse, Item } from "../store";
import styled from "styled-components";

const iconUrl = (icon: string, section: string = "abilities") =>
    `https://assets.rpglogs.com/img/warcraft/${section}/${icon}`;

interface Props {
    parse: Parse;
}

const Icon = styled.img`
    grid-area: icon;
    height: calc(1.5rem + 1.2rem + 1rem);
    width: calc(1.5rem + 1.2rem + 1rem);
`;

const SpecIcon = ({ parse }: Props) => (
    <Icon
        alt={`${parse.spec} ${parse.class} Spec Icon`}
        src={iconUrl(`${parse.class}-${parse.spec}.jpg`, "icons")}
    />
);

const SpecContainer = styled.div`
    display: grid;
    grid-template-areas: "icon class" "icon legendary";
    grid-template-columns: max-content auto;
    grid-column-gap: 1rem;
    justify-items: start;
    justify-content: start;
    grid-area: spec;
`;

const ClassName = styled.div`
    grid-area: class;
    font-size: 1.5rem;
`;

const PlayerName = styled.div`
    font-size: 3rem;
    font-family: serif;
    grid-area: player-name;
`;

const LegendaryName = styled.div`
    font-size: 1.2rem;
    grid-area: legendary;
    color: hsl(30.1, 100%, 50%);

    &:hover {
        text-decoration: underline;
    }
`;

const PaperDollContainer = styled.div`
    display: grid;
    justify-content: start;
    grid-template-areas:
        "player-name player-name"
        "spec parse"
        "sections sections";
`;

const ItemContainer = styled.div`
    display: grid;
    grid-template-areas: "icon name name" "icon desc gems";
    justify-content: start;
    grid-column-gap: 1rem;
`;

const qualityColors: { [k: string]: string } = {
    legendary: "hsl(30.1, 100%, 50%)",
    epic: "hsl(275.7, 84.5%, 57.1%)",
    rare: "hsl(213.6, 100%, 50%)",
    uncommon: "hsl(112.9, 100%, 50%)",
};

const defaultQlColor = "black";

const ItemName = styled.a<{ quality: string }>`
    grid-area: name;
    font-size: 1.2rem;
    color: ${(props) => qualityColors[props.quality] || defaultQlColor};

    &:hover[href] {
        text-decoration: underline;
    }
`;

const Desc = styled.div`
    grid-area: desc;
`;
const GemContainer = styled.div`
    display: grid;
    grid-auto-columns: max-content;
    grid-auto-flow: column;
    grid-column-gap: 0.5rem;
    grid-area: gems;

    & a:hover[href] {
        text-decoration: underline;
    }
`;

const Gems = ({ item }: { item: Item }) => {
    if (!item.gems || item.gems.length === 0) {
        return null;
    }
    return (
        <GemContainer>
            {item.gems.map((gem, ix) => (
                <a
                    key={ix}
                    href={`https://wowhead.com/item=${gem.id}`}
                    target="_blank"
                >
                    Gem {ix + 1}
                </a>
            ))}
        </GemContainer>
    );
};

const Item = ({ item }: { item: Item }) => (
    <ItemContainer>
        <Icon alt={`${item.name} icon`} src={iconUrl(item.icon)} />
        {/* bonus ids not included because of wowhead redirect loops */}
        <ItemName
            quality={item.quality}
            href={`https://wowhead.com/item=${item.id}`}
            target="_blank"
        >
            {item.name}
        </ItemName>
        <Desc>{item.itemLevel}</Desc>
        <Gems item={item} />
    </ItemContainer>
);

const Spec = ({ parse }: Props) => (
    <SpecContainer>
        <SpecIcon parse={parse} />
        <ClassName>
            {parse.spec} {parse.class}
        </ClassName>
        {parse.legendaryEffects && parse.legendaryEffects.length > 0 && (
            <LegendaryName
                as="a"
                target="_blank"
                href={`https://wowhead.com/spell=${parse.legendaryEffects[0].id}`}
            >
                {parse.legendaryEffects[0].name}
            </LegendaryName>
        )}
    </SpecContainer>
);

const SectionTitle = styled.legend`
    font-size: 1.5rem;
    font-weight: bold;
`;

const SectionContainer = styled.div`
    display: grid;
    grid-auto-flow: row;
    grid-row-gap: 0.2rem;
    justify-items: start;
    justify-content: start;
    align-items: start;
    align-content: start;
`;

const Section = ({
    title,
    children,
}: React.PropsWithChildren<{ title: string }>) => (
    <SectionContainer>
        <SectionTitle>{title}</SectionTitle>
        {children}
    </SectionContainer>
);

const SectionList = styled.div`
    grid-area: sections;
    display: grid;
    grid-auto-columns: max-content;
    grid-auto-flow: column;
    grid-column-gap: 2rem;
`;

const TalentContainer = styled.div`
    grid-template-areas: "icon name" "icon desc";
    display: grid;
    grid-column-gap: 2rem;
    justify-content: start;
`;

const talentLevel = (ix: number) => 15 + (ix > 0 ? 5 : 0) + ix * 5;

const Talent = ({ spell, index }: { spell: Spell; index: number }) => (
    <TalentContainer>
        <Icon alt={`${spell.name} icon`} src={iconUrl(spell.icon)} />
        <ItemName quality="none">{spell.name}</ItemName>
        <Desc>Level {talentLevel(index)}</Desc>
    </TalentContainer>
);

const ParseContainer = styled(TalentContainer)`
    align-self: end;
`;

const percentileColor = (pct: number): string => {
    if (pct >= 95) {
        return qualityColors["legendary"];
    } else if (pct >= 75) {
        return qualityColors["epic"];
    } else if (pct >= 50) {
        return qualityColors["rare"];
    } else if (pct >= 25) {
        return qualityColors["uncommon"];
    } else {
        return defaultQlColor;
    }
};

const ParseDetails = ({ parse }: Props) => (
    <ParseContainer>
        <ItemName quality="none">
            <strong>Most Recent Parse</strong>
        </ItemName>
        <Desc>
            {parse.encounterName} -{" "}
            <span style={{ color: percentileColor(parse.percentile) }}>
                {parse.percentile.toFixed(1)}%
            </span>{" "}
            (Rank {parse.rank} of {parse.outOf})
        </Desc>
    </ParseContainer>
);

export default function PaperDoll({ parse }: Props) {
    return (
        <PaperDollContainer>
            <PlayerName>{parse.characterName}</PlayerName>
            <Spec parse={parse} />
            <ParseDetails parse={parse} />
            <SectionList>
                <Section title="GEAR">
                    {parse.gear
                        .filter((item) => item.id !== 0)
                        .map((item, ix) => (
                            <Item item={item} key={ix} />
                        ))}
                </Section>
                {parse.talents && (
                    <Section title="TALENTS">
                        {parse.talents.map((talent, ix) => (
                            <Talent key={ix} spell={talent} index={ix} />
                        ))}
                    </Section>
                )}
            </SectionList>
        </PaperDollContainer>
    );
}
