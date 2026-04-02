require("dotenv").config();
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcrypt');
const session = require('express-session');
const app = express();

app.use(express.json());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, httpOnly: true, maxAge: 1000 * 60 * 60 * 24 * 15 }
}));

app.use(cors({
    origin: process.env.ORIGIN,
    credentials: true
}));

const db = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DB
});

db.connect((err) => {
    if (err) {
        console.log('database connection failed:', err);
        return;
    }
    console.log('connected to database');
});

// middleware to check if user is logged in
function requireLogin(req, res, next) {
    if (!req.session.userId) {
        res.status(401).json({ error: 'you must be logged in' });
        return;
    }
    next();
}

app.get('/products', (req, res) => {
    db.query('SELECT * FROM products', (err, results) => {
        if (err) {
            res.status(500).json({ error: 'database error' });
            return;
        }
        res.json(results);
    });
});

app.get('/products/:id', (req, res) => {
    db.query('SELECT * FROM products WHERE id = ?', [req.params.id], (err, results) => {
        if (err) {
            res.status(500).json({ error: 'database error' });
            return;
        }
        if (results.length === 0) {
            res.status(404).json({ error: 'product not found' });
            return;
        }
        res.json(results[0]);
    });
});

app.get('/cart', requireLogin, (req, res) => {
    const userId = req.session.userId;
    const sql = `
        SELECT cart.id, cart.product_id, cart.quantity,
        products.name, products.price, products.image
        FROM cart
        JOIN products ON cart.product_id = products.id
        WHERE cart.user_id = ?
    `;
    db.query(sql, [userId], (err, results) => {
        if (err) {
            res.status(500).json({ error: 'database error' });
            return;
        }
        res.json(results);
    });
});

app.post('/cart', requireLogin, (req, res) => {
    const userId = req.session.userId;
    const pid = req.body.product_id;

    db.query(
        'SELECT * FROM cart WHERE user_id = ? AND product_id = ?',
        [userId, pid],
        (err, results) => {
            if (err) {
                res.status(500).json({ error: 'database error' });
                return;
            }
            if (results.length > 0) {
                db.query(
                    'UPDATE cart SET quantity = quantity + 1 WHERE user_id = ? AND product_id = ?',
                    [userId, pid],
                    (err) => {
                        if (err) {
                            res.status(500).json({ error: 'database error' });
                            return;
                        }
                        res.json({ message: 'updated' });
                    }
                );
            } else {
                db.query(
                    'INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, 1)',
                    [userId, pid],
                    (err) => {
                        if (err) {
                            res.status(500).json({ error: 'database error' });
                            return;
                        }
                        res.json({ message: 'added' });
                    }
                );
            }
        }
    );
});

app.put('/cart/:pid', requireLogin, (req, res) => {
    const userId = req.session.userId;
    const qty = req.body.quantity;

    if (qty <= 0) {
        db.query(
            'DELETE FROM cart WHERE user_id = ? AND product_id = ?',
            [userId, req.params.pid],
            (err) => {
                if (err) {
                    res.status(500).json({ error: 'database error' });
                    return;
                }
                res.json({ message: 'removed' });
            }
        );
    } else {
        db.query(
            'UPDATE cart SET quantity = ? WHERE user_id = ? AND product_id = ?',
            [qty, userId, req.params.pid],
            (err) => {
                if (err) {
                    res.status(500).json({ error: 'database error' });
                    return;
                }
                res.json({ message: 'updated' });
            }
        );
    }
});

app.delete('/cart/:pid', requireLogin, (req, res) => {
    const userId = req.session.userId;
    db.query(
        'DELETE FROM cart WHERE user_id = ? AND product_id = ?',
        [userId, req.params.pid],
        (err) => {
            if (err) {
                res.status(500).json({ error: 'database error' });
                return;
            }
            res.json({ message: 'removed' });
        }
    );
});

app.delete('/cart', requireLogin, (req, res) => {
    const userId = req.session.userId;
    db.query('DELETE FROM cart WHERE user_id = ?', [userId], (err) => {
        if (err) {
            res.status(500).json({ error: 'database error' });
            return;
        }
        res.json({ message: 'cart cleared' });
    });
});

app.post('/order', requireLogin, (req, res) => {
    const userId = req.session.userId;
    const name = req.body.name;
    const phone = req.body.phone;
    const address = req.body.address;

    if (!name || !phone || !address) {
        res.status(400).json({ error: 'please fill all fields' });
        return;
    }

    db.query(
        'INSERT INTO orders (name, phone, address) VALUES (?, ?, ?)',
        [name, phone, address],
        (err, result) => {
            if (err) {
                res.status(500).json({ error: 'could not save order' });
                return;
            }

            db.query('DELETE FROM cart WHERE user_id = ?', [userId]);
            res.json({ message: 'Order placed successfully!', orderId: result.insertId });
        }
    );
});


app.post('/register', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        res.status(400).json({ error: 'please fill all fields' });
        return;
    }

    try {
        const hashPassword = await bcrypt.hash(password, 10);

        db.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
            if (err) {
                res.status(500).json({ error: 'database error' });
                return;
            }
            if (results.length > 0) {
                res.status(400).json({ error: 'username already taken' });
                return;
            }

            db.query(
                'INSERT INTO users (username, password) VALUES (?, ?)',
                [username, hashPassword],
                (err) => {
                    if (err) {
                        res.status(500).json({ error: 'database error' });
                        return;
                    }
                    res.json({ message: 'account created' });
                }
            );
        });
    } catch (error) {
        res.status(500).json({ error: 'hash error' });
    }
});

app.post('/login', (req, res) =>  {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        res.status(400).json({ error: 'please fill all fields' });
        return;
    }

    db.query('SELECT * FROM users WHERE username = ?', [username], async (err, results) => {
        if (err) {
            res.status(500).json({ error: 'database error' });
            return;
        }
        if (results.length === 0) {
            res.status(401).json({ error: 'wrong username or password' });
            return;
        }

        const valid = await bcrypt.compare(password, results[0].password);
        if (!valid) {
            res.status(401).json({ error: 'wrong username or password' });
            return;
        }

        req.session.userId = results[0].id;
        res.json({ message: 'logged in', username: results[0].username });
    });
});

app.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            res.status(500).json({ error: 'logout failed' });
            return;
        }
        res.json({ message: 'logged out' });
    });
});

app.listen(4000, () => {
    console.log('server running on port 4000');
});