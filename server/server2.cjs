const PORT = 8000
const express = require("express")
const cors = require("cors")
const fs = require("fs")
const app = express()
const { cleanRecipe, cleanedRecipeData } = require("./cleanRecipeData.js")

app.use(cors())
app.use(express.json())
require("dotenv").config()
const { GoogleGenerativeAI } = require("@google/generative-ai")
const genAI = new GoogleGenerativeAI(process.env.API_KEY)

app.post("/gemini", async (req, res) => {
	const model = genAI.getGenerativeModel({ model: "gemini-pro" })

	const chat = model.startChat({
		history: req.body.history,
		generationConfig: {
			/* maxOutputTokens: 100, */
		},
	})
	const msg = req.body.message
	const result = await chat.sendMessageStream(msg)
	const response = await result.response
	const text = response.text()
	res.send(text)
})

app.post("/api/clean-recipe", (req, res) => {
	try {
		const recipe = req.body // Get the recipe data from the request body
		const cleanedRecipe = cleanRecipe(recipe) // Clean the recipe
		res.status(200).json(cleanedRecipe) // Send the cleaned recipe back
	} catch (error) {
		console.error("Error cleaning recipe data:", error)
		res.status(500).json({ error: "Error cleaning recipe data." })
	}
})
app.post("/api/clean-recipes", (req, res) => {
	try {
		// Read existing recipe data
		const recipeData = JSON.parse(fs.readFileSync("Recipes.json", "utf-8"))

		// Fix the recipe data
		const cleanedRecipeData = cleanedRecipeData(recipeData)

		// Write the fixed data back to the JSON file
		fs.writeFileSync(
			"Recipes.json",
			JSON.stringify(cleanedRecipeData, null, 2)
		)

		res.status(200).json({ message: "Recipe data fixed successfully." })
	} catch (error) {
		console.error("Error fixing recipe data:", error)
		res.status(500).json({ error: "Error fixing recipe data." })
	}
})

app.listen(PORT, () => console.log(`Listening on port ${PORT}`))
