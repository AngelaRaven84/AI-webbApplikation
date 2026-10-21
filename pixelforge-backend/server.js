import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import chatRoutes from './src/routes/chat.route.js';

const app = express();
const PORT = process.env.PORT || 8080;

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/chat', chatRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}...`);
});