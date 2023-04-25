import { AbilityData, Dex, FormatData, ModData, MoveData, SpeciesData } from "@pkmn/dex";
import * as ps from "process";
import * as fs from "fs";
import { Generations } from "@pkmn/data";
import { patch } from "./patch";

function diffedSet<T extends { inherit?: boolean; isNonstandard?: string }>(
  base: { [id: string]: T },
  mod: { [id: string]: T }
): { [id: string]: Partial<T> } {
  let diffedData: { [id: string]: Partial<T> } = {};

  for (let id in mod) {
    let newData = mod[id];
    let baseData = base[id];
    if (!baseData) {
      diffedData[id] = newData;
      continue;
    }

    let diffed: Partial<T> = {};
    let modified = false;
    for (let key in newData) {
      if (JSON.stringify(baseData[key]) !== JSON.stringify(newData[key])) {
        modified = true;
        diffed[key] = newData[key];
      }
    }

    if (modified) {
      diffed.inherit = true;
      diffedData[id] = diffed;
    }
  }
  return diffedData;
}

function tsStringify(out: unknown): string {
  let json = JSON.stringify(out, undefined, 2);
  return json.replace(/\"[a-zA-Z_][a-zA-Z0-9_]*\":/g, (n) => {
    if (n == '"return":') {
      return n
    }
    return n.slice(1, -2) + ":"
  });
}

let dest_path = ps.argv[2];
let gen = +ps.argv[3];

let baseDex = new Generations(Dex).get(gen);
let newSpecies: { [species: string]: SpeciesData } = JSON.parse(
  fs.readFileSync(dest_path + "/pokedex.json").toString()
);


let baseSpecies = Object.fromEntries(
  [...baseDex.species].map((s) => [s.id, s])
);
let diffedSpecies = diffedSet<SpeciesData>(baseSpecies, newSpecies);


let formatsData: {[id: string]: FormatData} = {};
for (let name in baseSpecies) {
  if (!(name in newSpecies)) {
    formatsData[name] = { inherit: true, isNonstandard: "Unobtainable" };
  }
}

let newMoves = JSON.parse(
  fs.readFileSync(dest_path + "/moves.json").toString()
);

let baseMoves = Object.fromEntries([...baseDex.moves].map((s) => [s.id, s]));
let diffedMoves = diffedSet<MoveData>(baseMoves, newMoves);

for (let move in baseMoves) {
  if (!(move in newMoves)) {
    diffedMoves[move] = {
      inherit: true,
      isNonstandard: "Unobtainable",
    };
  }
}


let newAbilities = JSON.parse(
  fs.readFileSync(dest_path + "/abilities.json").toString()
);
let baseAbilities = Object.fromEntries(
  [...baseDex.abilities].map((s) => [s.id, s])
);
let diffedAbilities = diffedSet<AbilityData>(baseAbilities, newAbilities);
for (let ability in baseAbilities) {
  if (!diffedAbilities[ability]) {
    diffedAbilities[ability] = {
      inherit: true,
      isNonstandard: "Unobtainable",
    };
  }
}

let learnsets = JSON.parse(
  fs.readFileSync(dest_path + "/learnsets.json").toString()
);

fs.mkdirSync("out", { recursive: true });

let data: ModData = {
  FormatsData: formatsData,
  Species: diffedSpecies,
  Abilities: diffedAbilities,
  Moves: diffedMoves,
  Learnsets: learnsets,
}
patch(data)

let outputFile = `
import { ModData } from '@pkmn/dex';

export let Data: ModData = ${tsStringify(data)}
`

fs.writeFileSync("out/mod-data.ts", outputFile);
fs.writeFileSync("out/mod-data.json", JSON.stringify(data, undefined, 2));
