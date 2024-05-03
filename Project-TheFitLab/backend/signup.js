const express = require("express");
const { MongoClient } = require("mongodb");
const cors = require("cors");

const uri =
  "mongodb+srv://hema333:333@cluster0.jijohzo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri);

const app = express();
const PORT = 3050;

// Middleware to handle CORS
app.use(cors());

// Middleware to handle MongoDB connection
app.use(async (req, res, next) => {
  try {
    await client.connect();
    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.use(express.json());

app.post("/signup", async (req, res) => {
  const { email, username, password } = req.body;
  console.log(email, username, password);
  

  try {
    console.log(email, username, password);

    const database = client.db("FITNESS");
    const collection = database.collection("USER");

    // Check if the user already exists
    const userExists = await collection.findOne({ email, username, password });

    if (userExists) {
      return res.status(409).json({ message: "User already exists" });
    }

    // If the user doesn't exist, insert the new user
    const newUser = { email, username, password };

    await collection.insertOne(newUser);

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  } finally {
    // Close the MongoDB connection
    await client.close();
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on signup http://localhost:${PORT}`);
});
