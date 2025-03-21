import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

export default function Notepad() {
  const { id } = useParams(); // Get ID from URL
  const [text, setText] = useState("");
  const [debouncedText, setDebouncedText] = useState(text);
  const BASE_URL = "http://localhost:5000";

  // Fetch initial data
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(`${BASE_URL}/${id}`);
        if (!response.ok) throw new Error("Network response was not ok");

        const data = await response.json();
        setText(data.text);
      } catch (error) {
        console.error("Fetch error:", error);
      }
    }
    fetchData();
  }, [id]);

  // Debounce logic (Waits 1 sec before saving)
  useEffect(() => {
    const handler = setTimeout(() => {
      if (debouncedText !== text) {
        setDebouncedText(text);
      }
    }, 1000); // 1 sec delay

    return () => clearTimeout(handler);
  }, [text]);

  // Save to database when debouncedText updates
  useEffect(() => {
    if (debouncedText) {
      saveToDatabase(debouncedText);
    }
  }, [debouncedText]);

  const handleChange = (e) => setText(e.target.value);

  const saveToDatabase = async (newText) => {
    try {
      await fetch(`${BASE_URL}/update/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: newText }),
      });
    } catch (error) {
      console.error("Save error:", error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0a192f] p-4">
      <textarea
        value={text}
        onChange={handleChange}
        className="w-full h-[90vh] p-4 text-lg bg-[#112240] text-white placeholder-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        placeholder="Start typing..."
      />
    </div>
  );
}
