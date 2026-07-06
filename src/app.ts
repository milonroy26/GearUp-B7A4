import cors from 'cors';
import express, { Request, Response } from 'express';
import config from './config';
import { globalErrorHandler } from './middlewares/globalErrorHandler';
import { authRoute } from './modules/auth/auth.route';
import { CategoryRoutes } from './modules/category/category.route';

const app = express();

app.use(cors({
    origin: config.app_url,
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
    res.send("Hello, World!");
});


// routes
app.use("/api/auth", authRoute);

app.use("/api/categories", CategoryRoutes);

//* 404 Not Found
app.use((req, res, next) => {
    res.status(404).json({
        success: false,
        message: 'API Endpoint Not Found',
        errorDetails: null
    });
});

//* Global Error Handler
app.use(globalErrorHandler);

export default app;