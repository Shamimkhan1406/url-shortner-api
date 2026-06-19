import express from 'express';
import userRoutes from './routes/user.routes.js';

const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());

app.get('/', (req, res) => {
    res.json({status: 'Hello World!'});
})

app.use('/user', userRoutes);

app.listen(PORT, ()=> {
    console.log(`Server is running on port ${PORT}`);
})