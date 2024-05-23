import React, { useState } from "react"
import "./SousChef.css"

const SousChef = () => {
	const [value, setValue] = useState("")
	const [passedValue, setPassedValue] = useState("")
	const [error, setError] = useState("")
	const [chatHistory, setChatHistory] = useState<
		Array<{ role: string; parts: string[] }>
	>([])
	const [cuisine, setCuisine] = useState("")
	const [knownIngredients, setKnownIngredients] = useState("")
	const [avoidIngredients, setAvoidIngredients] = useState("")
	const [dietaryRestrictions, setDietaryRestrictions] = useState("")
	const [otherInfo, setOtherInfo] = useState("")
	const [specificLarge, setSpecificLarge] = useState("")
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
	]
	let preprompt: string =
		"You are a very skilled sous-chef and cooking teacher." +
		"Still you will only make recipes with knowledge that is known." +
		"NO FALSE STATEMENTS." +
		"The cuisines must match" +
		"You will write recipes as json files." +
		"Use this recipe format for the json:" +
		"name: string" +
		"unique id: string" +
		"id: string" +
		"cuisine: string" +
		"meal type: string" +
		"dietary restrictions and designations: string[]" +
		"serving info: {" +
		"prep time: string" +
		"cook time: string" +
		"total time: string" +
		"number of people served: number}" +
		"ingredients: {" +
		"dish: {" +
		"id: string" +
		"name: string" +
		"amount: string" +
		"unit: string | null" +
		"}[]" +
		"}" +
		"instructions: { number: number; text: string }[]" +
		"notes: string[]" +
		"nutrition: {" +
		"serving: string" +
		"calories: string" +
		"carbohydrates: string" +
		"protein: string" +
		"fat: string" +
		"saturated fat: string" +
		"fiber: string" +
		"sugar: string" +
		"}" +
		"You will help adjust and suggest the json details based on other available recipe formats." +
		"You will format the json for ease of viewing." +
		"Format the recipe as a json with these twelve main sections: name, unique id, id, cuisine, meal type, dietary restrictions and designations, serving info, ingredients, instructions, notes, nutrition, and grocery list." +
		"For the name section, use the recipe name." +
		"For the unique id section, use date.now()." +
		"For the id section, use the recipe name with dashes instead of spaces." +
		`For the cuisine section, use the following:${cuisine}.` +
		"or if empty between the last colon and the period use the culture assosicated e.g. Dominican, Latin, Haitian, Chinese, Indian etc." +
		"For the meal type, use breakfast, lunch, brunch, dinner, or dessert." +
		`For the dietary restrictions and designations,  use the following:${dietaryRestrictions}.` +
		"or if empty between the colon and the period, simply find and use all applicable designations like gluten-free, vegan, mayonnaise-free, mustard-free, etc." +
		"For the serving info section, make 4 subsections: the prep time, cook time, total time (which is the prep time plus cook time), and number of people served." +
		"For the ingredient section, make 4 subsections: dish, and 3 variable sections that can be named but have an id (1,2, or 3)." +
		"This variable section will allow for marinades, sauces, creams or toppings as needed." +
		`The recipe must include the following:${knownIngredients}. but if empty between the last colon and the period, then continue creating a recipe with any ingredients.` +
		"For the instruction section, each step will have a number value and text values holding instruction text." +
		"For the notes section, it will hold one subsection able to hold a paragraph of text to help guide the recipe." +
		"For the nutrition section, make eight sections: Serving will be set to 1 serving but can be changed to recalculate the other amounts, Calories, Carbohydrates, Protein, Fat, Saturated Fat, Fiber, and Sugar all except serving have units in grams."
	/* + "For the grocery section, make a basic list of the ingredients and amounts to purchase." +
		"Separated into quantity, units, item name." +
		"Convert units to how one would purchase ingredients. Similar to a ceiling function." +
		"For instance, cilantro is purchased in bunches so use a calculation to find the ceiling amount for each ingredient."
 */
	const surprise = () => {
		const randomValue =
			surpriseOptions[Math.floor(Math.random() * surpriseOptions.length)]
		setValue(randomValue)
	}

	const getResponse = async () => {
		setSpecificLarge(`
      ${cuisine}${knownIngredients} ${avoidIngredients} ${dietaryRestrictions} ${otherInfo}`)
		if (!value && !specificLarge) {
			setError("Let's try that again. Please ask a question.")
			return
		}
		if (value) {
			setPassedValue(value)
		}
		if (specificLarge) {
			setPassedValue(specificLarge)
		}
		try {
			const options = {
				method: "POST",
				body: JSON.stringify({
					history: chatHistory,
					message: preprompt + passedValue,
				}),
				headers: {
					"Content-Type": "application/json",
				},
			}
			const response = await fetch(
				"http://localhost:8000/gemini",
				options
			)
			const data = await response.text()
			console.log(data)
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
			])
			setValue("")
		} catch (error) {
			console.error(error)
			setError("Something went wrong! Please try again later.")
		}
	}

	const clear = () => {
		setValue("")
		setError("")
	}
	return (
		<div className="souschef-prompt">
			<h1>mySousChef</h1>
			<div className="souschef-prompt-initial">
				<p className="typewriter">
					Hi, I'm here to sous-chef you...tell me about a recipe or a
					grocery list...
				</p>
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
						setValue(e.target.value)
					}}
				/>
				{!error && <button onClick={getResponse}>Yes, Chef!</button>}
				{error && <button onClick={clear}>Clear</button>}
			</div>
			<p className="typewriter2">
				...and if you want to be more specific. Try the prompt sets
				below:
			</p>
			<div className="input-container">
				<input
					value={cuisine}
					placeholder="Enter a cuisine..."
					onChange={(e) => {
						setCuisine(e.target.value)
					}}
				/>
			</div>
			<div className="input-container">
				<input
					value={knownIngredients}
					placeholder="What ingredients do you have?"
					onChange={(e) => {
						setKnownIngredients(e.target.value)
					}}
				/>
			</div>
			<div className="input-container">
				<input
					className="input-container"
					value={avoidIngredients}
					placeholder="Which ingredients should we avoid?"
					onChange={(e) => {
						setAvoidIngredients(e.target.value)
					}}
				/>
			</div>
			<div className="input-container">
				<input
					value={dietaryRestrictions}
					placeholder="Do you have any dietary restrictions?"
					onChange={(e) => {
						setDietaryRestrictions(e.target.value)
					}}
				/>
			</div>
			<div className="input-container-last">
				<input
					value={otherInfo}
					placeholder="Do you have any other info to share?"
					onChange={(e) => {
						setOtherInfo(e.target.value)
					}}
				/>
				{!error && <button onClick={getResponse}>Yes, Chef!</button>}
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
	)
}

export default SousChef
