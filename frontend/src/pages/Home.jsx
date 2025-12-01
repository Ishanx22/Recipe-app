// Home.js
import { useState } from "react";
import "./Home.css";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Home() {
  const [ingredient, setIngredient] = useState("");
  const [items, setItems] = useState([]);
  const [recipe, setRecipe] = useState("");
  const [loading, setLoading] = useState(false);
  const [calories, setCalories] = useState("");
  const [protein, setProtein] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  function handleChange(event) {
    setIngredient(event.target.value);
  }

  function handleAddIngredient() {
    if (ingredient.trim() === "") return;
    setItems((prev) => [...prev, ingredient.trim()]);
    setIngredient("");
  }

  function handleRemoveLast() {
    setItems((prev) => prev.slice(0, -1));
  }

  function handleResetList() {
    setItems([]);
  }

  function handleCopyRecipe() {
    navigator.clipboard.writeText(recipe);
    alert("📋 Recipe copied to clipboard!");
  }

 async function handleGetRecipe() {
  setLoading(true);
  setRecipe("");

  // Build the prompt
  let prompt = `Suggest a recipe using these ingredients: ${items.join(
    ", "
  )}. Only output the recipe title, ingredients, and instructions. Do not include internal thoughts or explanations.`;

  if (calories.trim()) {
    prompt += ` Limit total calories to around ${calories} kcal.`;
  }
  if (protein.trim()) {
    prompt += ` Try to include at least ${protein}g of protein.`;
  }


  try {
  const API_BASE = import.meta.env.VITE_API_BASE || "/api";
  const response = await fetch(`${API_BASE}/chatgpt`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt }),
  });

  if (!response.ok) {
    const text = await response.text(); // get raw text if JSON is invalid
    throw new Error(`HTTP ${response.status}: ${text}`);
  }

  const data = await response.json(); // safe to parse now
  const cleanedReply = data.reply || "❌ No recipe returned";

  setRecipe(cleanedReply);
  setShowPopup(true);
} catch (err) {
  console.error("Error fetching recipe:", err);
  setRecipe("❌ Failed to fetch recipe");
} finally {
  setLoading(false);
}

}

  return (
    <>
      <Header />

      <div className="App">
        <h2 className="header">Recipe Genie</h2>

        <div className="input-area">
          <label
            style={{ fontSize: "20px", fontWeight: "600", textAlign: "left" }}
          >
            Add ingredients
          </label>
          <input
            value={ingredient}
            onChange={handleChange}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleAddIngredient();
            }}
            placeholder="Add an ingredient"
          />

          <div className="optional-inputs">
            <div>
              <label>Calories (kcal)</label>
              <input
                type="number"
                value={calories}
                onChange={(e) => setCalories(e.target.value)}
                placeholder="e.g. 500"
              />
            </div>
            <div>
              <label>Protein (g)</label>
              <input
                type="number"
                value={protein}
                onChange={(e) => setProtein(e.target.value)}
                placeholder="e.g. 20"
              />
            </div>
          </div>

          <div className="button-row">
            <button className="Add" onClick={handleAddIngredient}>
              Add
            </button>
            <button onClick={handleRemoveLast} disabled={items.length === 0}>
              ⛔ Remove Last
            </button>
            <button onClick={handleResetList} disabled={items.length === 0}>
              🔁 Reset
            </button>
          </div>
        </div>

        {items.length > 0 && (
          <div className="ingredient-list">
            <h4>Ingredients Added:</h4>
            <ul>
              {items.map((item, index) => (
                <li key={index}>✧ {item}</li>
              ))}
            </ul>
          </div>
        )}

        <button
          className="Submit"
          onClick={handleGetRecipe}
          disabled={items.length === 0}
        >
          Get AI Recipe
        </button>

        {loading && <p>⏳ Generating recipe...</p>}

        {showPopup && (
          <div className="modal-overlay">
            <div className="modal">
              <button className="close-btn" onClick={() => setShowPopup(false)}>
                Close
              </button>
              <button className="copy-btn" onClick={handleCopyRecipe}>
                Copy
              </button>
              <div className="modal-content">
                <h3>🍽️ Recipe</h3>
                <pre style={{ whiteSpace: "pre-wrap", textAlign: "left" }}>
                  {recipe}
                </pre>
              </div>
            </div>
          </div>
        )}

        {recipe && !showPopup && (
          <div className="recipe-box">
            <h3>🍽️ Recipe:</h3>
            <pre style={{ whiteSpace: "pre-wrap", textAlign: "left" }}>
              {recipe}
            </pre>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}
