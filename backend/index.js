const express = require("express");
const { MongoClient, ServerApiVersion } = require("mongodb");
const cors = require("cors");

// MongoDB connection string (Replace <db_username>, <db_password>, and <database_name>)
const uri = "mongodb+srv://shohinalimov:shohin2008@cluster.bot8t.mongodb.net/test?retryWrites=true&w=majority&appName=Cluster";

// MongoDB Client setup
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB and verify connection
async function connectToMongoDB() {
  try {
    await client.connect();
    console.log("Connected to MongoDB!");
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
}

connectToMongoDB();

// Simple API Endpoint
app.get("/", (req, res) => {
  res.send("Backend is working!");
});

const User = require("./models/User");
const bcrypt = require("bcrypt");

app.post("/api/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user object
    const newUser = new User(email, hashedPassword);

    // Save the user to the database
    const db = client.db("appointments");
    const result = await db.collection("users").insertOne(newUser);

    res.status(201).json({ message: "User registered successfully", userId: result.insertedId });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ error: "Failed to register user" });
  }
});

const jwt = require("jsonwebtoken");

app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user in the database
    const db = client.db("appointments");
    const user = await db.collection("users").findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generate a JWT token
    const token = jwt.sign({ id: user._id }, "secret_key", { expiresIn: "1h" });

    res.json({ message: "Login successful", token });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ error: "Failed to log in" });
  }
});



// Start the server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
