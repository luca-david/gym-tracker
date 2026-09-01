import 'dotenv/config';
import express, { type Request, type Response } from 'express';
import workoutRoutes from './router/workoutRoutes';
import setRoutes from './router/setRoutes';
import categoryRoutes from './router/categoryRoutes';
import exerciseRoutes from './router/exerciseRoutes';
import userRoutes from './router/userRoutes';
import cors from 'cors';
import ngrok from '@ngrok/ngrok';

const app = express();
const PORT = process.env.PORT || 3030;

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
app.listen(PORT, async () => {
    console.log('Server started at http://localhost:' + PORT);

    const authToken = process.env.NGROK_AUTHTOKEN;

    if (!authToken) {
        console.error('Could not find authToken in .env file');
        return
    }

    try {
        const forwarder = await ngrok.forward({
            addr: PORT,
            authtoken: authToken,
            domain: "refusal-thrill-squander.ngrok-free.dev",
        });
        console.log('Public ngrok URL: ' + forwarder.url());
    } catch (error) {
        console.error('Ngrok failed to connect', error);
    }
})