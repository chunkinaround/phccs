import {
    abort,
    availableAmount,
    cliExecute,
    drink,
    inHardcore,
    isDarkMode,
    myInebriety,
    myLevel,
    myPathId,
    setAutoAttack,
    use,
    useSkill,
    visitUrl,
} from "kolmafia";
import coilWire from "./coil wire";
import familiarTest from "./familiarweight";
import hotTest from "./hotres";
import itemTest from "./item";
import levelUp from "./level";
import noncombatTest from "./noncombat";
import { PropertyManager } from "./lib";
import spellTest from "./spell";
import { HPTest, moxTest, muscleTest, mystTest } from "./stattests";
import weaponTest from "./weapon";
import { $effect, $item, $skill, CommunityService, have } from "libram";

const HIGHLIGHT = isDarkMode() ? "yellow" : "blue";

const assertCompleted = (action: string, warning: string) => {
    if (action === "failed") throw new Error(warning);
};

//preamble
if (myPathId() !== 25) abort();
visitUrl("council.php");
cliExecute("ccs twiddle");

PropertyManager.set({
    customCombatScript: "twiddle",
    battleAction: "custom combat script",
    dontStopForCounters: true,
    hpAutoRecovery: -0.05,
    mpAutoRecovery: -0.05,
    logPreferenceChange: true,
});

try {
    assertCompleted(CommunityService.CoilWire.run(coilWire, 60), "Failed to coil wire!");
    if (myLevel() < 13) CommunityService.logTask("levelling", levelUp);
    assertCompleted(CommunityService.Moxie.run(moxTest, 1), "Failed to cap Moxie test!");
    assertCompleted(CommunityService.HP.run(HPTest, 1), "Failed to cap HP test!");
    assertCompleted(CommunityService.Muscle.run(muscleTest, 1), "Failed to cap Muscle test!");
    assertCompleted(
        CommunityService.Mysticality.run(mystTest, 1),
        "Failed to cap Mysticality test!"
    );
    CommunityService.logTask("getting drunk", () => {
        if (availableAmount($item`astral six-pack`) !== 0) use(1, $item`astral six-pack`);
        if (have($effect`The Magical Mojomuscular Melody`))
            cliExecute("shrug The Magical Mojomuscular Melody");
        useSkill($skill`The Ode to Booze`);
        while (myInebriety() < 5) {
            drink(1, $item`astral pilsner`);
        }
    });
    assertCompleted(CommunityService.BoozeDrop.run(itemTest, 1), "Failed to cap Item test!");
    assertCompleted(CommunityService.HotRes.run(hotTest, 1), "Failed to cap Hot Res test!");
    assertCompleted(CommunityService.Noncombat.run(noncombatTest, 1), "Failed to cap NC test!");
    assertCompleted(
        CommunityService.FamiliarWeight.run(familiarTest, 30),
        "Failed to perform Familiar test!"
    );
    assertCompleted(
        CommunityService.WeaponDamage.run(weaponTest, 1),
        "Failed to cap Weapon Damage test!"
    );
    assertCompleted(
        CommunityService.SpellDamage.run(spellTest, 30),
        "Failed to perform Spell Damage test!"
    );
} finally {
    CommunityService.printLog(HIGHLIGHT);
    if (!inHardcore()) CommunityService.donate();
    setAutoAttack(0);
    PropertyManager.resetAll();
}
