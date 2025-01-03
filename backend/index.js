const express = require("express");
const { MongoClient, ServerApiVersion } = require("mongodb");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// MongoDB connection string
const uri = "mongodb+srv://shohinalimov:shohin2008@cluster.bot8t.mongodb.net/test?retryWrites=true&w=majority&appName=Cluster";
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// App setup
const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
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

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Save files in the "uploads/" folder
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
  if (!allowedTypes.includes(file.mimetype)) {
    cb(new Error("Invalid file type. Only JPG, PNG, and GIF are allowed."), false);
  } else {
    cb(null, true);
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter,
});

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Extract the token

  if (!token) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, "secret_key"); // Replace "secret_key" with your secret
    req.user = decoded; // Attach user data to the request
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token." }); // Handle invalid tokens
  }
};

// Serve uploaded files

// Save or update user data, including the logo
app.post("/api/account", authenticateToken, upload.single("logo"), async (req, res) => {
  try {
    const { name, surname, phone, email } = req.body;
    const db = client.db("appointments");

    // Fetch existing user data
    const existingData = await db.collection("userDetails").findOne({ userId: req.user.id });

    // Keep the old logo if a new one isn't uploaded
    const logo = req.file ? req.file.filename : existingData?.logo;

    // Save or update the user details in the database
    await db.collection("userDetails").updateOne(
      { userId: req.user.id },
      { $set: { name, surname, phone, email, logo } },
      { upsert: true }
    );

    // Send the updated user data back to the frontend
    res.status(200).json({
      message: "Account details saved successfully",
      name,
      logo: logo ? `${req.protocol}://${req.get("host")}/uploads/${logo}` : null,
    });
  } catch (error) {
    console.error("Error saving account details:", error);
    res.status(500).json({ error: "Failed to save account details" });
  }
});


// Get user data
app.get("/api/account", authenticateToken, async (req, res) => {
  try {
    const db = client.db("appointments");
    const userDetails = await db.collection("userDetails").findOne({ userId: req.user.id });

    if (!userDetails) {
      return res.status(200).json({}); // Return an empty object for new users
    }

    if (userDetails.logo) {
      userDetails.logo = `${req.protocol}://${req.get("host")}/uploads/${userDetails.logo}`;
    }

    res.status(200).json(userDetails); // Include name and logo
  } catch (error) {
    console.error("Error fetching account details:", error);
    res.status(500).json({ error: "Failed to fetch account details" });
  }
});

// Register endpoint
app.post("/api/register", async (req, res) => {
  try {
    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = { email, password: hashedPassword };
    const db = client.db("appointments");
    const result = await db.collection("users").insertOne(newUser);

    // Generate a token
    const token = jwt.sign({ id: result.insertedId }, "secret_key", {
      expiresIn: "1h",
    });

    res.status(201).json({ message: "User registered successfully", token });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ error: "Failed to register user" });
  }
});



// Login endpoint
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const db = client.db("appointments");
    const user = await db.collection("users").findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

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
