import { AbilityData, Dex, ModData, MoveData, SpeciesData } from "@pkmn/dex";
import { DeepPartial } from "@pkmn/dex-types"
import * as ps from "process";
import * as fs from "fs";
import { Generations } from "@pkmn/data";
import { patch } from "./patch";

function diffedSet<T extends {inherit?: boolean}>(
  base: { [id: string]: T },
  mod: { [id: string]: DeepPartial<T> }
): { [id: string]: DeepPartial<T> } {
  let diffedData: { [id: string]: DeepPartial<T> } = {};

  for (let id in mod) {
    let newData = mod[id];
    let baseData = base[id] as DeepPartial<T>;
    if (!baseData) {
      diffedData[id] = newData;
      continue;
    }

    let diffed: DeepPartial<T> = {} as DeepPartial<T>
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

function readJson(path: string) {
  let str = fs.readFileSync(dest_path + path).toString()
  return JSON.parse(str);
}

let newData: ModData = {
  FormatsData: {},
  Species: readJson("/pokedex.json"),
  Abilities: readJson("/abilities.json"),
  Moves: readJson("/moves.json"),
  Learnsets: readJson("/learnsets.json"),
}
patch(newData)

let modData: ModData = {
  FormatsData: newData.FormatsData
}

let baseSpecies = Object.fromEntries(
  [...baseDex.species].map((s) => [s.id, s])
);
modData.Species = diffedSet<SpeciesData>(baseSpecies, newData.Species);
for (let name in baseSpecies) {
  if (!(name in newData.Species)) {
    modData.FormatsData[name] = { inherit: true, isNonstandard: "Unobtainable" };
  }
}

let baseMoves = Object.fromEntries([...baseDex.moves].map((s) => [s.id, s]));
modData.Moves = diffedSet<MoveData>(baseMoves, newData.Moves as any);
for (let move in baseMoves) {
  if (!(move in newData.Moves)) {
    modData.Moves[move] = {
      inherit: true,
      isNonstandard: "Unobtainable",
    };
  }
}

let baseAbilities = Object.fromEntries(
  [...baseDex.abilities].map((s) => [s.id, s])
);
let diffedAbilities = diffedSet<AbilityData>(baseAbilities, newData.Abilities);
for (let ability in baseAbilities) {
  if (!diffedAbilities[ability]) {
    diffedAbilities[ability] = {
      inherit: true,
      isNonstandard: "Unobtainable",
    };
  }
}



fs.mkdirSync("out", { recursive: true });

let outputFile = `
import { ModData } from '@pkmn/dex';
export let Data: ModData = ${tsStringify(modData)}
`

fs.writeFileSync("out/mod-data.ts", outputFile);
fs.writeFileSync("out/mod-data.json", JSON.stringify(modData, undefined, 2));
