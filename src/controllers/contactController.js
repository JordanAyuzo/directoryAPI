import {pool} from "../db.js";

export const createContact = async (req, res) => {
    const { id_user, email, name, paternalSurname, maternalSurname, phoneNumber, address } = req.body;

    try {
        if (!id_user || !email || !name || !paternalSurname) {
            res.status(400).json({ error: '400 Missing required fields' });
            return;
        }

        const [existingContact] = await pool.query('SELECT * FROM Contact WHERE id_user = ? AND email = ?', [id_user, email]);
        if (existingContact.length > 0) {
            res.status(409).json({ error: '409 Contact with this email already exists for the user' });
            return;
        }

        await pool.query('INSERT INTO Contact (id_user, email, name, paternalSurname, maternalSurname, phoneNumber, address) VALUES (?, ?, ?, ?, ?, ?, ?)', [id_user, email, name, paternalSurname, maternalSurname, phoneNumber, address]);
        res.status(200).json({ message: '200 Contact created successfully' });
    } catch (error) {
        console.error('Error creating contact:', error);
        res.status(500).json({ error: '500 Internal Server Error' });
    }
};

export const getContactsByUserId = async (req, res) => {
    const userId = req.params.id;

    try {
        const [contacts] = await pool.query('SELECT * FROM Contact WHERE id_user = ?', [userId]);
        res.status(200).json({ contacts });
    } catch (error) {
        console.error('Error fetching contacts:', error);
        res.status(500).json({ error: '500 Internal Server Error' });
    }
};

export const updateContact = async (req, res) => {
    const contactId = req.params.id;
    const { email, name, paternalSurname, maternalSurname, phoneNumber, address } = req.body;

    try {
        const [existingContact] = await pool.query('SELECT * FROM Contact WHERE id = ?', [contactId]);
        if (existingContact.length === 0) {
            res.status(404).json({ error: '404 Contact not found' });
            return;
        }

        await pool.query(
            'UPDATE Contact SET email = ?, name = ?, paternalSurname = ?, maternalSurname = ?, phoneNumber = ?, address = ? WHERE id = ?', 
            [email, name, paternalSurname, maternalSurname, phoneNumber, address, contactId]
        );
        
        res.status(200).json({ message: '200 Contact updated successfully' });
    } catch (error) {
        console.error('Error updating contact:', error);
        res.status(500).json({ error: '500 Internal Server Error' });
    }
};

export const deleteContact = async (req, res) => {
    const contactId = req.params.id;

    try {
        const [existingContact] = await pool.query('SELECT * FROM Contact WHERE id = ?', [contactId]);
        if (existingContact.length === 0) {
            res.status(404).json({ error: '404 Contact not found' });
            return;
        }

        await pool.query('DELETE FROM Contact WHERE id = ?', [contactId]);
        
        res.status(200).json({ message: '200 Contact deleted successfully' });
    } catch (error) {
        console.error('Error deleting contact:', error);
        res.status(500).json({ error: '500 Internal Server Error' });
    }
};