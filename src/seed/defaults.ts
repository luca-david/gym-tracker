//default muscle group categories and their exercises, so the app works right out of the box
//the SQLite version paired these up by counting ids (category 1 gets exercises 0 and 1, and so
//on), which silently breaks the moment a list changes - they are matched by name here instead

export const defaultCategories = [
    'Chest',
    'Back',
    'Biceps',
    'Triceps',
    'Abs',
    'Shoulders',
    'Legs',
];

export const defaultExercises: { name: string; category: string }[] = [
    { name: 'Incline Dumbbell Press', category: 'Chest' },
    { name: 'Flat Machine Press', category: 'Chest' },
    { name: 'Lat Pulldown', category: 'Back' },
    { name: 'Chest Supported T-Bar Row', category: 'Back' },
    { name: 'Cable Curl', category: 'Biceps' },
    { name: 'Dumbell Curl', category: 'Biceps' },
    { name: 'Straight Bar Pushdown', category: 'Triceps' },
    { name: 'Rope Pushdown', category: 'Triceps' },
    { name: 'Cable Crunch', category: 'Abs' },
    { name: 'Decline Crunch', category: 'Abs' },
    { name: 'Cable Lateral Raise', category: 'Shoulders' },
    { name: 'Dumbell Overhead Press', category: 'Shoulders' },
    { name: 'Leg Press', category: 'Legs' },
    { name: 'Leg Extensions', category: 'Legs' },
];
