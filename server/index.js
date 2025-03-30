import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { customAlphabet } from "nanoid";
import connectDB from "./mongo.js"; // Import MongoDB connection
import Text from "./Text.js"; // Import the Mongoose model

dotenv.config();
const app = express();

// ✅ Proper CORS configuration
app.use(
  cors({
    origin: ["https://copy-text-tau.vercel.app","http://localhost:5173"], // Allow your frontend domain
    methods: "GET, POST, PUT",
    allowedHeaders: ["Content-Type"],
    credentials: true, // Allow cookies (if needed)
  })
);

// ✅ Allow CORS preflight requests
app.options("*", cors());

app.use(express.json());

connectDB(); // Connect to MongoDB
const PORT = process.env.PORT || 5000;
const nanoid = customAlphabet(
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
  7
);

// ✅ Route to submit or generate a unique ID
app.post("/submit", async (req, res) => {
  try {
    let { id } = req.body;

    if (!id) {
      id = nanoid(); // Generate a new ID if not provided
      console.log("Generated ID:", id);
    }

    // Check if the ID already exists
    let existingText = await Text.findOne({ id });

    if (existingText) {
      return res.status(200).json({ message: "ID already exists", id: existingText.id });
    }

    // If not found, create a new entry
    const result = await Text.create({ id, text: "" });

    res.status(201).json({ message: "Data saved", id: result.id });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ✅ Route to update text by ID
app.post("/update/:id", async (req, res) => {
  try {
    const { text } = req.body;

    const updatedText = await Text.findOneAndUpdate(
      { id: req.params.id },
      { text },
      { new: true, upsert: true } // Create if not exists
    );

    res.status(200).json({ message: "Text updated", updatedText });
  } catch (error) {
    console.error("Update Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ✅ Route to fetch text by ID
app.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const textData = await Text.findOne({ id });

    if (!textData) {
      return res.status(404).json({ message: "Text not found" });
    }

    res.status(200).json(textData);
  } catch (error) {
    console.error("Fetch Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ✅ Start server
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
