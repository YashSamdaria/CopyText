import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { customAlphabet } from "nanoid";
import connectDB from "./mongo.js";  // Import MongoDB connection
import Text from "./Text.js"; // Import the Mongoose model

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

connectDB(); // Connect to MongoDB
const PORT = process.env.PORT || 5000;
const nanoid = customAlphabet(
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
  7
);

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
      return res.json({ message: "ID already exists", id: existingText.id });
    }

    // If not found, create a new entry
    const result = await Text.create({ id, text: "" });

    res.json({ message: "Data saved", id: result.id });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/update/:id", async (req, res) => {
  try {
    const { text } = req.body;
    const updatedText = await Text.findOneAndUpdate(
      { id: req.params.id },
      { text },
      { new: true, upsert: true } // Create if not exists
    );

    res.json({ message: "Text updated", updatedText });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/:id", async (req, res) => {
  try {
    const { id } = req.params; // Get ID from URL
    const textData = await Text.findOne({ id }); // Find document using custom `id` field
    if (!textData) {
      return res.status(404).json({ message: "Text not found" });
    }

    res.json(textData); // Send found document as JSON response
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
