import { create, eat } from "kolmafia";
import { $item, $items, $location, $skill, get, have, Macro } from "libram";
import uniform, { wireOutfit } from "./outfits";
import { delevel, easyFight } from "./combat";
import { advMacro, fightSausageIfAble, useDefaultFamiliar } from "./lib";
import runStart from "./runstart";

function firstFights() {
    // eslint-disable-next-line libram/verify-constants
    uniform(...$items`protonic accelerator pack, Daylight Shavings Helmet`);
    useDefaultFamiliar();
    fightSausageIfAble(
        $location`Noob Cave`,
        Macro.skill($skill`Micrometeorite`)
            .attack()
            .repeat()
    );

    if (have($item`magical sausage casing`)) {
        create(1, $item`magical sausage`);
    }
    if (have($item`magical sausage`)) {
        eat(1, $item`magical sausage`);
    }

    const ghostLocation = get("ghostLocation");
    if (ghostLocation) {
        uniform(...$items`latte lovers member's mug, protonic accelerator pack`);
        useDefaultFamiliar();
        advMacro(
            ghostLocation,
            Macro.step(delevel)
                .step(easyFight)
                .trySkill($skill`Shoot Ghost`)
                .trySkill($skill`Shoot Ghost`)
                .trySkill($skill`Shoot Ghost`)
                .trySkill($skill`Trap Ghost`)
        );
    }
}

export default function coilWire(): number {
    runStart();
    firstFights();
    wireOutfit();
    return 60;
}
