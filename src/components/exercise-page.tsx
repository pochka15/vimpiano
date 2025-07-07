"use client";

import { Input } from "@/components/ui/input";
import { FC, useEffect, useState } from "react";
import { Exercise } from "@/lib/main/exercises";
import { capitalize, head, nth } from "lodash";

const NOT_FOUND_EXERCISE = { name: "Not found exercise", steps: [] };
const DUMMY_STEP = { name: "Not found", combo: [] };

export type ExercisePageProps = {
  exercises?: Exercise[];
};

export const ExercisePage: FC<ExercisePageProps> = ({ exercises }) => {
  const [searchValue, setSearchValue] = useState("");
  const [exercise, setExercise] = useState(
    head(exercises) || NOT_FOUND_EXERCISE,
  );
  const [stepNumb, setStepNumb] = useState(0);
  const actualStep = exercise.steps.length
    ? stepNumb % exercise.steps.length
    : 0;

  const step = nth(exercise.steps, actualStep) || DUMMY_STEP;

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === "p") {
        event.preventDefault();
        setStepNumb((prev) => prev - 1);
      }
      if (event.ctrlKey && event.key === "n") {
        event.preventDefault();
        setStepNumb((prev) => prev + 1);
      }
    };

    const handleFocus = () => {
      setStepNumb((prev) => prev + 1);
    };

    window.addEventListener("focus", handleFocus);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);

      window.removeEventListener("focus", handleFocus);
    };
  }, []);

  const handleChange = (value: string) => {
    setStepNumb(0);
    setSearchValue(value);
    setExercise(
      exercises?.find((it) => it.name.includes(value.trim())) ||
        NOT_FOUND_EXERCISE,
    );
  };

  return (
    <div className="flex w-full flex-col gap-10">
      <Input
        value={searchValue}
        onChange={(e) => handleChange(e.target.value)}
        placeholder="Search..."
        className="w-full"
      />

      <h1 className="text-xl">{exercise.name}</h1>
      <h2 className="text-xl">{`${actualStep + 1}. ${capitalize(step.name)}`}</h2>

      <ol className="grid w-fit grid-cols-4 gap-2 gap-y-8">
        {step.combo.map((key, ind) => (
          <li
            key={ind}
            className="min-w-10 rounded-sm border border-chart-4 py-2 text-center text-3xl"
          >
            {key}
          </li>
        ))}
      </ol>
    </div>
  );
};
