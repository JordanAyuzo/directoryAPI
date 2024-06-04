import {pool} from "../db.js";
import bcrypt from "bcrypt";

    export const createUser = async (req, res) => {
    const { email, name, paternalSurname, maternalSurname, password } = req.body;

    try {
        if (!email || !name || !paternalSurname || !password) {
            res.status(400).json({ error: '400 Missing required fields' });
            return;
        }

        const [existingUser] = await pool.query('SELECT * FROM User WHERE email = ?', [email]);
        if (existingUser.length > 0) {
            res.status(409).json({ error: '409 Email already in use' });
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await pool.query('INSERT INTO User (email, name, paternalSurname, maternalSurname, password) VALUES (?, ?, ?, ?, ?)', [email, name, paternalSurname, maternalSurname, hashedPassword]);
        res.status(200).json({ message: '200 User created successfully' });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: '500 Internal Server Error' });
    }
    };
    
    export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        if (!email || !password) {
            res.status(400).json({ error: '400 Missing email or password' });
            return;
        }

        const [user] = await pool.query('SELECT * FROM User WHERE email = ?', [email]);
        if (user.length === 0) {
            res.status(401).json({ error: '401 Invalid email or password' });
            return;
        }

        const validPassword = await bcrypt.compare(password, user[0].password);
        if (!validPassword) {
            res.status(401).json({ error: '401 Invalid email or password' });
            return;
        }
        delete user[0].password;
        res.status(200).json({ message: '200 Login successful', user: user[0] });
    } catch (error) {
        res.status(500).json({ error: '500 Internal Server Error' });
    }
    };
    
    export const getUser = async (req, res) => {
    const { id } = req.params;

    try {
        const [user] = await pool.query('SELECT email, name, paternalSurname, maternalSurname FROM User WHERE id = ?', [id]);
        if (user.length === 0) {
            res.status(404).json({ error: 'User not found' });
            return;
        }
        res.status(200).json(user[0]);
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
    };
    
    export const updateUser = async (req, res) => {
    const { id } = req.params;
    const { email, name, paternalSurname, maternalSurname, password, oldPassword } = req.body;

    try {
        const [user] = await pool.query('SELECT * FROM User WHERE id = ?', [id]);

        if (user.length === 0) {
            res.status(404).json({ error: 'Usuario no encontrado' });
            return;
        }

        if (oldPassword && !await bcrypt.compare(oldPassword, user[0].password)) {
            res.status(400).json({ error: 'La contraseña antigua es incorrecta' });
            return;
        }

        let updateUserQuery = 'UPDATE User SET email = ?, name = ?, paternalSurname = ?, maternalSurname = ?';
        const queryParams = [email, name, paternalSurname, maternalSurname];

        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            updateUserQuery += ', password = ?';
            queryParams.push(hashedPassword);
        }

        updateUserQuery += ' WHERE id = ?';
        queryParams.push(id);
        await pool.query(updateUserQuery, queryParams);

        res.status(200).json({ message: 'Usuario actualizado correctamente' });
    } catch (error) {
        console.error('Error al actualizar el usuario:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
    };
    
    export const deleteUser = async (req, res) => {
    const userId = req.params.id;

    try {
        const [existingUser] = await pool.query('SELECT * FROM User WHERE id = ?', [userId]);
        if (existingUser.length === 0) {
            res.status(404).json({ error: '404 User not found' });
            return;
        }
        
        await pool.query('DELETE FROM User WHERE id = ?', [userId]);

        res.status(200).json({ message: '200 User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ error: '500 Internal Server Error' });
    }
    };