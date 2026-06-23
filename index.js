import express from 'express';
import userRoutes from './routes/user.routes.js';
import urlRoutes from './routes/url.routes.js';
import { authMiddleware } from './middleware/auth.middleware.js';

const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use(authMiddleware);

app.get('/', (req, res) => {
    res.json({status: 'Hello World!'});
})

app.use(urlRoutes);
app.use('/user', userRoutes);

app.listen(PORT, ()=> {
    console.log(`Server is running on port ${PORT}`);
})