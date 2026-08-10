import express, { type Request, type Response } from 'express';
import workoutRoutes from './router/workoutRoutes.js';
import setRoutes from './router/setRoutes.js';
import categoryRoutes from './router/categoryRoutes.js';
import exerciseRoutes from './router/exerciseRoutes.js';
import userRoutes from './router/userRoutes.js';
import cors from 'cors';

const app = express();
const PORT = 3030;

app.use(cors());

app.use(express.json()); //express cannot read json data by default

//testing if the server is alive
app.get('/api/status', (req: Request, res: Response) => {
    res.json({ message: '=^)'});
});

//connect routes
app.use('/api/categories', categoryRoutes);
app.use('/api/exercises', exerciseRoutes);
app.use('/api/sets', setRoutes);
app.use('/api/workouts', workoutRoutes);
app.use('/api/users', userRoutes);

//turn the server on
app.listen(PORT, () => {
    console.log('Server started at port ' + PORT);
})