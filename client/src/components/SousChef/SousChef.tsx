import React, { useState } from "react"
import "./SousChef.css"
import TemporaryRecipeDisplay from "../RecipeDisplay/RecipeDisplay" // Import your RecipeDisplay component
import { RecipeModel } from "../Models/Models"
import { surpriseOptions, preprompt } from "../Models/Prompts"

const SousChef = () => {
	const [value, setValue] = useState("")
	const [passedValue, setPassedValue] = useState("")
	const [error, setError] = useState("")
	const [isLoading, setIsLoading] = useState(false)
	const [generatedRecipe, setGeneratedRecipe] = useState<RecipeModel | null>(
		null
	)
	const [chatHistory, setChatHistory] = useState<
		Array<{ role: string; parts: string[] }>
	>([])
	const [cuisine, setCuisine] = useState("")
	const [knownIngredients, setKnownIngredients] = useState("")
	const [avoidIngredients, setAvoidIngredients] = useState("")
	const [dietaryRestrictions, setDietaryRestrictions] = useState("")
	const [otherInfo, setOtherInfo] = useState("")
	const [specificExpanded, setSpecificExpanded] = useState("")
	const [ocrAddon, setOcrAddon] = useState("")

	const surprise = () => {
		const randomValue =
			surpriseOptions[Math.floor(Math.random() * surpriseOptions.length)]
		setValue(randomValue)
	}
	console.log(specificExpanded)
	const getResponse = async () => {
		setIsLoading(true) // Set loading state to true
		const specificExpanded = [
			cuisine,
			ocrAddon,
			knownIngredients,
			avoidIngredients,
			dietaryRestrictions,
			otherInfo,
		]
			.filter(Boolean)
			.join(", ")
		if (!value && !specificExpanded) {
			setError("Let's try that again. Please ask a question.")
			return
		}
		if (value) {
			setPassedValue(value)
		} else {
			setPassedValue(specificExpanded)
		}
		try {
			const options = {
				method: "POST",
				body: JSON.stringify({
					history: chatHistory,
					message:
						preprompt(
							cuisine,
							dietaryRestrictions,
							knownIngredients,
							avoidIngredients,
							otherInfo,
							ocrAddon || ""
						) + passedValue,
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
			const recipeRegex = /{.*}/s // capture the recipe as a json object

			// find the json object in the response. the regex looks for the characters between and including the curly braces. the s flag allows the dot to match newline characters
			const cleanedJsonMatch = data.match(recipeRegex)
			const cleanedJsonString = cleanedJsonMatch
				? cleanedJsonMatch[0]
				: "" // Use the match or an empty string if no match is found

			// Check if the string can be parsed
			let parsedRecipe: RecipeModel | null = null
			try {
				parsedRecipe = JSON.parse(cleanedJsonString)
				console.log("Parsed recipe:", parsedRecipe)
			} catch (e) {
				console.error("Error parsing JSON:", e)
				setError("Invalid recipe format received.")
				return // Exit the function if parsing fails
			}

			// Set the generated recipe in state to trigger the display
			setGeneratedRecipe(parsedRecipe)
			setCuisine("")
			setKnownIngredients("")
			setAvoidIngredients("")
			setDietaryRestrictions("")
			setOtherInfo("")
			setSpecificExpanded("")
			setValue("")
			setOcrAddon("")
		} catch (error) {
			console.error(error)
			setError("Something went wrong! Please try again later.")
		}
		setIsLoading(false)
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
				{!error && (
					<button onClick={getResponse} disabled={isLoading}>
						{isLoading ? "Processing..." : "Yes, Chef!"}
					</button>
				)}
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
				{!error && (
					<button onClick={getResponse} disabled={isLoading}>
						{isLoading ? "Processing..." : "Yes, Chef!"}
					</button>
				)}
				{error && <button onClick={clear}>Clear</button>}
			</div>
			<div className="search-result">
				{/* TemporaryRecipeDisplay for showing generated recipe */}
				{generatedRecipe && (
					<TemporaryRecipeDisplay
						generatedRecipe={generatedRecipe}
						onTryAgain={getResponse} // Pass the getResponse function to retry
					/>
				)}
			</div>
		</div>
	)
}

export default SousChef
