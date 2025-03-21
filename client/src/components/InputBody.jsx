import { useState } from "react";
import { useNavigate } from "react-router-dom";

const BASE_URL = "http://localhost:5000";
console.log("BASE_URL:", BASE_URL);

export default function InputBody() {
  const [text, setText] = useState("");
  const navigate = useNavigate();

  const submit = async () => {
    try {
      const response = await fetch(`${BASE_URL}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: text }),
      });
    
      const data = await response.json(); // Extract JSON first
  
      if (response.ok) {
        navigate(`/${data.id}`); // Navigate using the received ID
      } else {
        console.error("Submission failed:", response.status);
      }
    } catch (error) {
      console.error("Error submitting:", error);
    }
  };
  
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#0a192f] text-white p-4">
      <h1 className="text-3xl font-bold mb-6">copytext.help</h1>
      <div className="w-full max-w-5xl bg-[#112240] p-4 rounded-lg shadow-lg">
        <div className="flex flex-col space-y-6">
          <textarea
            placeholder="Enter your secret key"
            className="w-full h-16 p-4 rounded-md bg-[#233554] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-lg"
            value={text}
            onChange={(e) => setText(e.target.value)}
          ></textarea>
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-8 rounded-md transition-all"
              onClick={submit}
            >
              Submit/Generate Random
            </button>
            
          </div>
      </div>
    </div>
  );
}
