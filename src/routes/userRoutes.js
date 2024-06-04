
import { Router } from "express";
import { createUser, loginUser, getUser, updateUser, deleteUser} from "../controllers/userController.js";
    const userRouter = Router();
    userRouter.post('/', createUser)
    userRouter.post('/login', loginUser)
    userRouter.get('/:id', getUser) 
    userRouter.put('/updateUser/:id', updateUser)
    userRouter.delete('/:id', deleteUser)


export default userRouter;