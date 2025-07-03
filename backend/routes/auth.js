const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../config/db');
const router = express.Router();


router.post('/signup', async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).send('Name, email, and password are required.');
    }

    const checkEmailQuery = `SELECT * FROM users WHERE email = ?`;
    db.get(checkEmailQuery, [email], async (err, row) => {
        if (err) {
            console.error("❌ Email check error:", err.message);
            return res.status(500).send('Internal server error');
        }
        if (row) return res.status(409).send('User already exists.');

        const hashedPassword = await bcrypt.hash(password, 10);
        const insertUserQuery = `INSERT INTO users (name, email, password) VALUES (?, ?, ?)`;

        db.run(insertUserQuery, [name, email, hashedPassword], function (err) {
            if (err) {
                console.error("❌ Error inserting user:", err.message);
                return res.status(500).send('Failed to register user.');
            }
            res.status(201).send('User registered successfully.');
        });
    });
});


router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).send('Email and password are required.');
    }

    const query = `SELECT * FROM users WHERE email = ?`;
    db.get(query, [email], async (err, row) => {
        if (err) {
            console.error("❌ Login DB error:", err.message);
            return res.status(500).send('Internal server error');
        }

        if (!row) return res.status(401).send('Invalid credentials');

        const isMatch = await bcrypt.compare(password, row.password);
        if (!isMatch) return res.status(401).send('Invalid credentials');

        // If login successful
        res.status(200).json({
            message: 'Login successful',
            user: {
                id: row.id,
                name: row.name,
                email: row.email,
                role: row.role
            }
        });
    });
});
module.exports = router;
