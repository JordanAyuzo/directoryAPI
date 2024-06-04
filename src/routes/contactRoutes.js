import { Router } from "express";
import { createContact, getContactsByUserId, updateContact, deleteContact } from "../controllers/contactController.js";
    const contactRouter = Router();
    contactRouter.post('/', createContact)
    contactRouter.get('/:id', getContactsByUserId)
    contactRouter.put('/:id', updateContact)
    contactRouter.delete('/:id', deleteContact)

export default contactRouter;