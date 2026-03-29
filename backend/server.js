const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcrypt');
const session = require('express-session');
const app = express();

app.use(express.json());
app.use(session({
    secret: 'El@de#azl#sahs_accessories&*S#ec$ret+KEy',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, httpOnly: true, maxAge: 1000 * 60 * 60 * 24 * 15 }
}));
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'sahs_store'
});

db.connect(function(err) {
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

app.get('/products', function(req, res) {
    db.query('SELECT * FROM products', function(err, results) {
        if (err) {
            res.status(500).json({ error: 'database error' });
            return;
        }
        res.json(results);
    });
});

app.get('/products/:id', function(req, res) {
    db.query('SELECT * FROM products WHERE id = ?', [req.params.id], function(err, results) {
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

app.get('/cart', requireLogin, function(req, res) {
    const userId = req.session.userId;
    const sql = `
        SELECT cart.id, cart.product_id, cart.quantity,
        products.name, products.price, products.image
        FROM cart
        JOIN products ON cart.product_id = products.id
        WHERE cart.user_id = ?
    `;
    db.query(sql, [userId], function(err, results) {
        if (err) {
            res.status(500).json({ error: 'database error' });
            return;
        }
        res.json(results);
    });
});

app.post('/cart', requireLogin, function(req, res) {
    const userId = req.session.userId;
    const pid = req.body.product_id;

    db.query(
        'SELECT * FROM cart WHERE user_id = ? AND product_id = ?',
        [userId, pid],
        function(err, results) {
            if (err) {
                res.status(500).json({ error: 'database error' });
                return;
            }
            if (results.length > 0) {
                db.query(
                    'UPDATE cart SET quantity = quantity + 1 WHERE user_id = ? AND product_id = ?',
                    [userId, pid],
                    function(err) {
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
                    function(err) {
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

app.put('/cart/:pid', requireLogin, function(req, res) {
    const userId = req.session.userId;
    const qty = req.body.quantity;

    if (qty <= 0) {
        db.query(
            'DELETE FROM cart WHERE user_id = ? AND product_id = ?',
            [userId, req.params.pid],
            function(err) {
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
            function(err) {
                if (err) {
                    res.status(500).json({ error: 'database error' });
                    return;
                }
                res.json({ message: 'updated' });
            }
        );
    }
});

app.delete('/cart/:pid', requireLogin, function(req, res) {
    const userId = req.session.userId;
    db.query(
        'DELETE FROM cart WHERE user_id = ? AND product_id = ?',
        [userId, req.params.pid],
        function(err) {
            if (err) {
                res.status(500).json({ error: 'database error' });
                return;
            }
            res.json({ message: 'removed' });
        }
    );
});

app.delete('/cart', requireLogin, function(req, res) {
    const userId = req.session.userId;
    db.query('DELETE FROM cart WHERE user_id = ?', [userId], function(err) {
        if (err) {
            res.status(500).json({ error: 'database error' });
            return;
        }
        res.json({ message: 'cart cleared' });
    });
});

app.post('/order', requireLogin, function(req, res) {
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
        function(err, result) {
            if (err) {
                res.status(500).json({ error: 'could not save order' });
                return;
            }

            db.query('DELETE FROM cart WHERE user_id = ?', [userId]);
            res.json({ message: 'Order placed successfully!', orderId: result.insertId });
        }
    );
});


app.post('/register', async function(req, res) {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        res.status(400).json({ error: 'please fill all fields' });
        return;
    }

    try {
        const hashPassword = await bcrypt.hash(password, 10);

        db.query('SELECT * FROM users WHERE username = ?', [username], function(err, results) {
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
                function(err) {
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

app.post('/login', function(req, res) {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        res.status(400).json({ error: 'please fill all fields' });
        return;
    }

    db.query('SELECT * FROM users WHERE username = ?', [username], async function(err, results) {
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

        // store user id in session
        req.session.userId = results[0].id;
        res.json({ message: 'logged in', username: results[0].username });
    });
});

app.post('/logout', function(req, res) {
    req.session.destroy(function(err) {
        if (err) {
            res.status(500).json({ error: 'logout failed' });
            return;
        }
        res.json({ message: 'logged out' });
    });
});

app.listen(4000, function() {
    console.log('server running on port 4000');
});