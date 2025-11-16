import express from "express";
import mysql from "mysql2";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// MySQL Connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "admin",   // তোমার MySQL password
  database: "contactdb"
});

// Connect
db.connect((err) => {
  if (err) throw err;
  console.log("MySQL Connected");
});

// Auto-create table
const createTableQuery = `
CREATE TABLE IF NOT EXISTS contacts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100),
  phone VARCHAR(50)
)
`;

db.query(createTableQuery, (err) => {
  if (err) throw err;
  console.log("Contacts table ready!");
});

// POST API route
app.post("/contact", (req, res) => {
  const { name, email, phone } = req.body;

  const sql = "INSERT INTO contacts (name, email, phone) VALUES (?, ?, ?)";
  db.query(sql, [name, email, phone], (err, result) => {
    if (err) return res.send(err);
    res.send("Form submitted successfully!");
  });
});

// GET API route to fetch all 
app.get("/contacts", (req, res) => {
  const sql = "SELECT * FROM contacts";

  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Database Error", error: err });
    }
    res.json(results);
  });
});-

// create default route
app.get("/", (req, res) => {
  res.send("Welcome to the Contact API");
});


// Start server
app.listen(5000, () => {
  console.log("Server running on port 5000");
});
