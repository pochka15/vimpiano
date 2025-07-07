import { ExercisePage } from "@/components/exercise-page";
import { parseExercises } from "@/lib/main/exercises";
import { ModeToggle } from "@/components/mode-toggle";

export default function Home() {
  const exercises = parseExercises("1.txt");

  return (
    <div className="mx-auto max-w-screen-sm pt-32">
      <div className="mb-4 flex justify-end">
        <ModeToggle />
      </div>
      <div className="grid place-items-center">
        <ExercisePage exercises={exercises} />
      </div>
    </div>
  );
}
