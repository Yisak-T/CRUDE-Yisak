const express = require("express");
const cors = require("cors");
const mysql = require("mysql");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const validator = require("validator");

const app = express();
app.use(express.json());
app.use(cors());

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "CRUD"
});

const users = [
    { email: "isak@example.com", password: "@0000", role: "admin" },
    { email: "member1@example.com", password: "1234", role: "viewer" },
];

const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1];
    if (!token) return res.sendStatus(401);
    jwt.verify(token, 'your_jwt_secret', (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

app.post('/login', (req, res) => {
    const { email, password } = req.body;
    const user = users.find(u => u.email === email);
    if (user) {
        if (password === user.password) {
            const token = jwt.sign({ email: user.email, role: user.role }, 'your_jwt_secret');
            return res.json({ success: true, token, role: user.role });
        } else {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }
    } else {
        const sql = "SELECT * FROM student WHERE Email = ?";
        db.query(sql, [email], (err, result) => {
            if (err) return res.status(500).json({ success: false, message: "Error checking credentials" });
            if (result.length > 0) {
                const student = result[0];
                if (!student.Password) {
                    return res.status(401).json({ success: false, message: "Student password is not set" });
                }
                bcrypt.compare(password, student.Password, (err, match) => {
                    if (err || !match) {
                        return res.status(401).json({ success: false, message: "Invalid credentials" });
                    }
                    const token = jwt.sign({ email: student.Email, role: "viewer" }, 'your_jwt_secret');
                    return res.json({ success: true, token, role: "viewer", studentId: student.ID });
                });
            } else {
                return res.status(401).json({ success: false, message: "Invalid credentials" });
            }
        });
    }
});

app.post('/register', (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({ success: false, message: "All fields (name, email, password) are required." });
    }
    bcrypt.hash(password, 10, (err, hash) => {
        const sql = "INSERT INTO student (Name, Email, Password, Role) VALUES (?, ?, ?, 'viewer')";
        const values = [name, email, hash];
        db.query(sql, values, (err, data) => {
            if (err) {
                console.log("Insert error:", err);
                return res.status(500).json({ success: false, message: "Database error", error: err });
            }
            return res.json(data);
        });
    });
});

app.post('/create', (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({ success: false, message: "All fields are required" });
    }

    bcrypt.hash(password, 10, (err, hash) => {
        if (err) return res.status(500).json({ success: false, message: "Password encryption failed" });

        const sql = "INSERT INTO student (Name, Email, Password, Role) VALUES (?, ?, ?, 'viewer')";
        const values = [name, email, hash];
        db.query(sql, values, (err, result) => {
            if (err) {
                console.log("Create error:", err);
                return res.status(500).json({ success: false, message: "Failed to add student", error: err });
            }
            return res.json({ success: true, message: "Student added successfully" });
        });
    });
});

app.get("/secure-students", authenticateToken, (req, res) => {
    const role = req.user.role;
    const sql = role === "admin" 
        ? "SELECT * FROM student" 
        : "SELECT ID, Name, Email FROM student";
    db.query(sql, (err, data) => {
        if (err) return res.json("Error");
        return res.json(data);
    });
});

app.post('/request-reset', (req, res) => {
    const { email } = req.body;
    if (!validator.isEmail(email)) {
        return res.status(400).json({ success: false, message: "Invalid email" });
    }
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 3600000); // 1 hour
    db.query("INSERT INTO password_resets (email, token, expires_at) VALUES (?, ?, ?)", [email, token, expiresAt], (err) => {
        if (err) return res.status(500).json({ success: false, message: "Error storing reset token" });
        // Here, you would send the token to the user's email
        return res.json({ success: true, token });
    });
});

app.post('/reset-password/:token', (req, res) => {
    const { password } = req.body;
    const { token } = req.params;
    if (!validator.isLength(password, { min: 6 })) {
        return res.status(400).json({ success: false, message: "Invalid password" });
    }
    db.query("SELECT email FROM password_resets WHERE token = ? AND expires_at > NOW()", [token], (err, result) => {
        if (err || result.length === 0) return res.status(400).json({ success: false, message: "Invalid or expired token" });

        const email = result[0].email;
        bcrypt.hash(password, 10, (err, hash) => {
            db.query("UPDATE student SET Password = ? WHERE Email = ?", [hash, email], (err, data) => {
                if (err) {
                    console.log("Update error:", err);
                    return res.json("Error");
                }
                return res.json(data);
            });
        });
    });
});

app.get('/getstudent/:id', (req, res) => {
    const sql = "SELECT * FROM student WHERE ID = ?";
    const id = req.params.id;
    db.query(sql, [id], (err, result) => {
        if (err) return res.status(500).json({ error: "Error fetching student" });
        res.json(result[0]);
    });
});

app.put('/update/:id', (req, res) => {
    const sql = "UPDATE student SET Name = ?, Email = ?, Password = ? WHERE ID = ?";
    const values = [
        req.body.name,
        req.body.email,
        req.body.password
    ];
    const id = req.params.id;
    db.query(sql, [...values, id], (err, data) => {
        if (err) return res.json("Error");
        return res.json(data);
    });
});
app.delete('/student/:id', (req, res) => {
    const sql = "DELETE FROM student WHERE ID = ?";
    const id = req.params.id;

    db.query(sql, [id], (err, data) => {
        if (err) return res.json("Error");
        return res.json(data);
    });
});

app.listen(8081, () => {
    console.log("Server is running on port 8081");
});
