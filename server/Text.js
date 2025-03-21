import mongoose from "mongoose";

const textSchema = new mongoose.Schema({
  id: { type: String, unique: true, required: true }, // Primary key
  text: { type: String, required: false,default:"" }, // The text data
});

const Text = mongoose.model("Text", textSchema);
export default Text; // Use ES module export
