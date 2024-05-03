const express = require("express");
const { MongoClient } = require("mongodb");
const cors = require("cors");

const uri = "mongodb+srv://hema333:333@cluster0.jijohzo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri);

const app = express();
const PORT = 3000;

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

app.post("/login", async (req, res) => {
    const { username, password } = req.body;
    console.log(username, password);

    try {
        const database = client.db("FITNESS");
        const collection = database.collection("USER");

        // Find the user with the provided email and password
        const user = await collection.findOne({ username, password });
		console.log(user); // Displays the details in computer

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "Login successful", user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    } finally {
        // Close the MongoDB connection
        await client.close();
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on login http://localhost:${PORT}`);
});
