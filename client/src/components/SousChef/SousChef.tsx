import React, { useState} from "react";
import "./SousChef.css";

const SousChef = () => {
    const [value, setValue] = useState("");
    const [error, setError] = useState("");
    const [chatHistory, setChatHistory] = useState<Array<{role: string; parts: string[]}>>([]);
    const [cuisine, setCuisine] = useState("");
    const [knownIngredients, setKnownIngredients] = useState("");
    const [avoidIngredients, setAvoidIngredients] = useState("");
    const [dietaryRestrictions, setDietaryRestrictions] = useState("");
    const [otherInfo, setOtherInfo] = useState("");
  
    const surpriseOptions = [
      "Show me a Latin Caribbean recipe",
      "Show me an Italian recipe",
      "Show me a Haitian recipe",
      "Show me a Greek recipe",
      "Show me a Welsh recipe",
      "Show me a Latin Caribbean dinner recipe",
      "Show me an Italian dinner recipe",
      "Show me a Haitian dinner recipe",
      "Show me a Greek dinner recipe",
      "Show me a Welsh dinner recipe",
      "Show me a Latin Caribbean dinner recipe",
      "Show me an Italian dessert recipe",
      "Show me a Haitian dessert recipe",
      "Show me a Greek dessert recipe",
      "Show me a Welsh dessert recipe",
    ];
  
    const surprise = () => {
      const randomValue =
        surpriseOptions[Math.floor(Math.random() * surpriseOptions.length)];
      setValue(randomValue);
    };
  
    const getResponse = async () => {
      if (!value) {
        setError("Let's try that again. Please ask a question.");
        return;
      }
      try {
        const options = {
          method: "POST",
          body: JSON.stringify({
            history: chatHistory,
            message: value,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        };
        const response = await fetch("http://localhost:8000/gemini", options);
        const data = await response.text();
        console.log(data);
        setChatHistory((oldChatHistory) => [
          ...oldChatHistory,
          {
            role: "user",
            parts: [value],
          },
          {
            role: "model",
            parts: [data],
          },
        ]);
        setValue("");
      } catch (error) {
        console.error(error);
        setError("Something went wrong! Please try again later.");
      }
    };
  
    const clear = () => {
      setValue("");
      setError("");
    };
    return (
        <div className="souschef-prompt">
          <h1>mySousChef</h1>
          <div className="souschef-prompt-initial">
          <p className="typewriter">Hi, I'm here to sous-chef you...tell me about a recipe or a grocery list...</p>
            <button
              className="surprise"
              onClick={surprise}
              disabled={chatHistory.length > 0}
            >
              Random Examples...
            </button>
          </div>        
          <div className="input-container-last">
            <input
              value={value}
              placeholder="Show me a recipe for arroz con pollo...?"
              //Add "Continue your prompt"
              onChange={(e) => {
                setValue(e.target.value);
              }}
            />
            {!error && <button onClick={getResponse}>Bon Chance!</button>}
            {error && <button onClick={clear}>Clear</button>}
          </div>
          <div className="typewriter2">
                ...and if you want to be more specific. Try this:
          </div>
          <div className="input-container">
            <input
              value={cuisine}
              placeholder="Enter a cuisine..."
              onChange={(e) => {
                setCuisine(e.target.value);
              }}
            />
          </div>
          <div className="input-container">
            <input
              value={knownIngredients}
              placeholder="What ingredients do you have?"
              onChange={(e) => {
                setKnownIngredients(e.target.value);
              }}
            />
          </div>
          <div className="input-container">
            <input 
              className="input-container"
              value={avoidIngredients}
              placeholder="Which ingredients should we avoid?"
              onChange={(e) => {
                setAvoidIngredients(e.target.value);
              }}
            />
          </div>
          <div className="input-container">
            <input
              value={dietaryRestrictions}
              placeholder="Do you have any dietary restrictions?"
              onChange={(e) => {
                setDietaryRestrictions(e.target.value);
              }}
            />
          </div>
          <div className="input-container-last">
            <input
              value={otherInfo}
              placeholder="Do you have any other info to share?"
              onChange={(e) => {
                setOtherInfo(e.target.value);
              }}
            />
            {!error && <button onClick={getResponse}>Sous me</button>}
            {error && <button onClick={clear}>Clear</button>}
          </div>
          <div className="search-result">
            {chatHistory.map((chatItem, _index) => (
              <div key={_index}>
                <p className="answer">
                  {chatItem.role}: {chatItem.parts}
                </p>
              </div>
            ))}
          </div>
        </div>
      );
    };

export default SousChef