import express from 'express';
import { AuthController } from './controllers/auth.controller';

export default () => {
    const router = express.Router();
    const authController = new AuthController();

    router.post('/login', authController.login)
    router.post('/register', authController.register)

    return router;
}