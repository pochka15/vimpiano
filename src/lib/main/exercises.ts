import fs from "fs";
import path from "path";

export type ExerciseStep = {
  name: string;
  combo: string[];
};

export type Exercise = {
  name: string;
  steps: ExerciseStep[];
};

const EXERCISES_PATH = "./exercises";

const parseTitle = (line: string) =>
  line.startsWith("# ") ? line.substring(2).trim() : undefined;

const parseStep = (line: string): ExerciseStep | undefined => {
  if (line.startsWith("- ")) {
    const part1 = line.substring("- ".length);
    const colInd = part1.indexOf(":");
    if (colInd === -1) return { name: part1, combo: [] };

    return {
      name: part1.substring(0, colInd),
      combo: part1
        .substring(colInd + 1, part1.length)
        .trim()
        .split(" "),
    };
  }
  return undefined;
};

export const parseExercises = (
  exerciseName: string,
): Exercise[] | undefined => {
  const pathToEx = [EXERCISES_PATH, exerciseName].join("/");
  const absolutePath = path.resolve(process.cwd(), pathToEx);
  const res: Exercise[] = [];
  let content: string;
  let cur: Exercise | null = null;

  const store = () => {
    if (cur) res.push(cur);
  };

  try {
    content = fs.readFileSync(absolutePath, "utf-8");
  } catch (error) {
    console.error(`Error reading file at ${pathToEx}:`, error);
    return undefined;
  }

  content.split("\n").forEach((line) => {
    const title = parseTitle(line);
    const step = parseStep(line);

    if (title) {
      store();
      cur = { name: title, steps: [] };
    } else if (step && cur) {
      cur.steps.push(step);
    }
  });

  store();

  return res;
};
