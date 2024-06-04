import express from "express";
import morgan from "morgan";
import './config.js';
import userRouter from "./routes/userRoutes.js";
import contactRouter from "./routes/contactRoutes.js";
import { PORT } from "./config.js";
    const app = express()

    app.use(morgan("dev"));
    app.use(express.json());
    //Rutas principales
    app.get('/', (req, res) => res.send('Server is running...'))
    app.use('/api/user', userRouter)
    app.use('/api/contact', contactRouter)
    
    app.listen(PORT)
    console.log('server on port ' + PORT)