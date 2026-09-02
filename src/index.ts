import 'dotenv/config';
import express, { type Request, type Response } from 'express';
import workoutRoutes from './router/workoutRoutes.js';
import setRoutes from './router/setRoutes.js';
import categoryRoutes from './router/categoryRoutes.js';
import exerciseRoutes from './router/exerciseRoutes.js';
import userRoutes from './router/userRoutes.js';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3030;

// Allowed origins for CORS.
// These are the origins of the *frontend* that is allowed to call this API - not this
// API's own address. Set FRONTEND_ORIGINS in the Vercel project settings to a comma
// separated list, e.g. "https://gym-tracker-4jje.vercel.app". Vercel hands every
// deployment its own hostname, so list any extra ones you want to keep working.
// With FRONTEND_ORIGINS unset every origin is allowed, which is what a bare cors() does.
const configuredOrigins = (process.env.FRONTEND_ORIGINS ?? '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:3000',
    ...configuredOrigins
];

//no credentials option: the frontend sends no cookies or auth headers, and asking for
//credentials while reflecting any origin is the combination browsers refuse anyway
app.use(cors({
    origin: configuredOrigins.length > 0 ? allowedOrigins : true
}));

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
// Only start the local server and Ngrok tunnel when NOT running on Vercel
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
    app.listen(PORT, async () => {
        console.log('Server started at http://localhost:' + PORT);

        const authToken = process.env.NGROK_AUTHTOKEN;

        if (!authToken) {
            console.error('Could not find authToken in .env file');
            return;
        }

        try {
            const ngrok = await import('@ngrok/ngrok');
            const forwarder = await ngrok.forward({
                addr: PORT,
                authtoken: authToken,
                domain: "refusal-thrill-squander.ngrok-free.dev",
            });
            console.log('Public ngrok URL: ' + forwarder.url());
        } catch (error) {
            console.error('Ngrok failed to connect', error);
        }
    });
}

export default app;