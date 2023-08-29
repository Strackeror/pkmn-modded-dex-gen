import { ModData } from "@pkmn/dex";
export function patch(data: ModData) {
  for (let specieName in data.Species) {
    data.FormatsData[specieName] = {
      inherit: true,
      tier: " ",
    };
  }

  // Hustle Typo
  data.Abilities["hustle"].desc =
    "Greatly boosts the Attack stat by 50% for a 20%\naccuracy drop on most Physical moves.";

  // Typechart fixes
  data.Types = {
    ice: {
      inherit: true,
      damageTaken: {
        Bug: 0,
        Dark: 0,
        Dragon: 2,
        Electric: 0,
        Fairy: 0,
        Fighting: 1,
        Fire: 1,
        Flying: 2,
        Ghost: 0,
        Grass: 0,
        Ground: 2,
        Ice: 2,
        Normal: 0,
        Poison: 0,
        Psychic: 0,
        Rock: 1,
        Steel: 1,
        Water: 0,
      },
    },

    fairy: {
      inherit: true,
      damageTaken: {
        Bug: 0,
        Dark: 2,
        Dragon: 3,
        Electric: 0,
        Fairy: 0,
        Fighting: 2,
        Fire: 0,
        Flying: 0,
        Ghost: 0,
        Grass: 0,
        Ground: 0,
        Ice: 0,
        Normal: 0,
        Poison: 1,
        Psychic: 0,
        Rock: 0,
        Steel: 1,
        Water: 0,
      },
    },

    fighting: {
      inherit: true,
      damageTaken: {
        Bug: 0,
        Dark: 2,
        Dragon: 0,
        Electric: 0,
        Fairy: 1,
        Fighting: 0,
        Fire: 0,
        Flying: 1,
        Ghost: 0,
        Grass: 0,
        Ground: 0,
        Ice: 0,
        Normal: 0,
        Poison: 0,
        Psychic: 1,
        Rock: 2,
        Steel: 0,
        Water: 0,
      },
    },

    ghost: {
      inherit: true,
      damageTaken: {
        Bug: 0,
        Dark: 1,
        Dragon: 0,
        Electric: 0,
        Fairy: 0,
        Fighting: 3,
        Fire: 0,
        Flying: 0,
        Ghost: 1,
        Grass: 0,
        Ground: 0,
        Ice: 0,
        Normal: 3,
        Poison: 2,
        Psychic: 0,
        Rock: 0,
        Steel: 0,
        Water: 0,
      },
    },
  };

  // Fix PPBoosts for low pp moves
  for (let move_key in data.Moves) {
    let move = data.Moves[move_key];
    if (move.pp <= 3) {
      move.noPPBoosts = true;
    }

    if (move.critRatio >= 6) {
      move.willCrit = true;
    }
  }

  // Bullet Tag
  let bullet_moves = [
    "triplecannonade",
    "bugbomber",
    "featherball",
    "scumshot",
    "magneticburst",
    "sludgeshot",
    "mudbomb",
    "zapcannon",
    "rockwrecker",
    "electroball",
    "gyroball",
    "shadowball",
    "energyball",
    "sludgebomb",
    "focusblast",
    "aurasphere",
    "searingshot",
    "weatherball",
    "seedbomb",
    "iceball",
    "bulletseed",
    "rockblast",
  ];

  for (let moveId of bullet_moves) {
    let move = data.Moves[moveId];
    move.flags = { ...move.flags, bullet: 1 };
  }
  
  // Pulse tag
  let pulse_moves = [
    "aurasphere",
    "darkpulse",
    "waterpulse",
    "healpulse",
    "dragonpulse",
    "torrentialpulse",
  ];
  for (let moveId of pulse_moves) {
    let move = data.Moves[moveId];
    move.flags = { ...move.flags, pulse: 1 };
  }


  // Bite tag
  let bite_moves = [
    "jaggedfangs",
    "crunch",
    "psychicfangs",
    "poisonfang",
    "firefang",
    "icefang",
    "thunderfang",
  ];


  for (let moveId of bite_moves) {
    let move = data.Moves[moveId];
    move.flags = { ...move.flags, bite: 1 };
  }

  // Couple of cases where the base forme should instead show another forme
  let replaceBaseFormes = [
    ["zygarde", "zygarde50"],
    ["gourgeist", "gourgeistsmall"],
  ];
  for (let [baseFormeName, formeName] of replaceBaseFormes) {
    let species = data.Species[formeName];
    let baseSpecies = data.Species[baseFormeName];
    baseSpecies.abilities = species.abilities;
    baseSpecies.baseStats = species.baseStats;
    baseSpecies.prevo = species.prevo;
    baseSpecies.evoLevel = species.evoLevel;
    baseSpecies.evoType = species.evoType;
    baseSpecies.evoItem = species.evoItem;
    data.Learnsets[baseFormeName] = data.Learnsets[formeName];
  }

  data.Species["zygarde"].otherFormes = ["zygarde10", "zygardecomplete"];
  data.Species["zygarde"].formeOrder = [
    "zygarde",
    "zygarde10",
    "zygardecomplete",
  ];
  data.Species["gourgeist"].otherFormes = ["gourgeistsuper"];
  data.Species["gourgeist"].formeOrder = ["gourgeist", "gourgeistsuper"];

  // Combat-Only formes
  let formes = [
    "venusaurmega",
    "charizardmegax",
    "charizardmegay",
    "blastoisemega",
    "beedrillmega",
    "pidgeotmega",
    "alakazammega",
    "slowbromega",
    "gengarmega",
    "kangaskhanmega",
    "pinsirmega",
    "gyaradosmega",
    "aerodactylmega",
    "ampharosmega",
    "steelixmega",
    "scizormega",
    "heracrossmega",
    "houndoommega",
    "tyranitarmega",
    "sceptilemega",
    "blazikenmega",
    "swampertmega",
    "gardevoirmega",
    "sableyemega",
    "mawilemega",
    "aggronmega",
    "medichammega",
    "manectricmega",
    "sharpedomega",
    "cameruptmega",
    "altariamega",
    "banettemega",
    "absolmega",
    "glaliemega",
    "salamencemega",
    "metagrossmega",
    "latiasmega",
    "latiosmega",
    "lopunnymega",
    "garchompmega",
    "lucariomega",
    "abomasnowmega",
    "gallademega",
    "audinomega",
    "dianciemega",
    "mimikyubusted",
    "mimikyubustedtotem",
    "wishiwashischool",
    "shayminsky",
    "darmanitanzen",
    "greninjaash",
    "kyuremwhite",
    "kyuremblack",
    "aegislashblade",
    "meloettapirouette",
    "cherrimsunshine",
    "castformsunny",
    "castformsnowy",
    "castformrainy"
  ];

  for (let forme of formes) {
    data.Learnsets[forme] = { learnset: null };
  }

  let unusables = [
    "mewtwo",
    "mewtwomegax",
    "mewtwomegay",

    "kyogre",
    "kyogreprimal",
    "groudon",
    "groudonprimal",
    "rayquaza",
    "rayquazamega",

    "dialga",
    "palkia",
    "arceus",

    "zekrom",
    "reshiram",

    "xerneas",
    "yveltal",
    "zygardecomplete",
  ];
  // Unusable pokes
  for (let unusable of unusables) {
    data.Learnsets[unusable].learnset = {};
    data.FormatsData[unusable] = {
      inherit: true,
      tier: "Unav",
    };
  }

  // Redundant formes to delete
  let deleteFormes = [
    "pumpkaboosmall",
    "pumpkaboolarge",
    "pumpkaboosuper",
    "gourgeistlarge",
    "gourgeistsmall",
    "zygarde50",
  ];
  for (let formeName of deleteFormes) {
    delete data.Species[formeName];
    data.FormatsData[formeName] = {
      inherit: true,
      isNonstandard: "Unobtainable",
    };
  }

  // Minior manual patches
  data.Species["minior"].baseForme = "Meteor";
  data.Species["minior"].cosmeticFormes = [];
  data.Learnsets["minior"].learnset = {};

  // Pumpkaboo manual patch
  delete data.Species["pumpkaboo"].formeOrder;
  delete data.Species["pumpkaboo"].otherFormes;
  data.Species["pumpkaboo"].evos[1] = "Gourgeist";

  // Aegislash-Blade manual patch
  data.Species["aegislashblade"].abilities = ["Stance Change"];

  // Porygon-Z evo loop
  data.Species["porygonz"].evos = [];

  // Floette Eternal
  data.FormatsData["floetteeternal"].isNonstandard = null;
}
