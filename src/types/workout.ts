//this is where we declare the interfaces
//we use interfaces to define the "shape" of the js object

export interface SetInput {
    reps: number;
    weight: number;
}

export interface ExerciseInput {
    name: string;
    sets: SetInput[];
}

export interface WorkoutInput {
    name: string;
    exercises: ExerciseInput[];
    date: number;
}

