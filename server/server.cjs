import express from "express"
import cors from "cors"
import fs from "fs/promises" // Use fs.promises for async/await operations
import dotenv from "dotenv"
import { cleanRecipe, cleanedRecipeData } from "./cleanRecipeData.js"
import { GoogleGenerativeAI } from "@google/generative-ai" // Assuming it's an ES module

dotenv.config()

const PORT = 8000
const app = express()

app.use(cors())
app.use(express.json())

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

const recipeFilePath = path.resolve(__dirname, "Recipes.json")
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
		// 1. Read recipe data
		let rawData
		try {
			rawData = fs.readFileSync(recipeFilePath, "utf-8")
		} catch (readError) {
			// If Recipes.json doesn't exist, create an empty array
			if (readError.code === "ENOENT") {
				console.warn("Recipes.json not found, creating an empty file.")
				fs.writeFileSync(recipeFilePath, "[]")
				rawData = "[]"
			} else {
				throw readError // Re-throw other errors
			}
		}
		const recipeData = JSON.parse(rawData)

		// 2. Fix the recipe data
		const cleanedRecipes = cleanedRecipeData(recipeData)
		console.log(
			"Recipes.json path:",
			path.resolve(__dirname, "Recipes.json")
		)

		// 3. Write cleaned data back to file
		fs.writeFileSync(
			"Recipes.json",
			JSON.stringify(cleanedRecipes, null, 2)
		)

		// 4. Send success response
		res.status(200).json({
			message: "Recipe data fixed successfully.",
			data: cleanedRecipes,
		})
	} catch (error) {
		console.error("Error fixing recipe data:", error)
		res.status(500).json({ error: "Error fixing recipe data." })
	}
})

app.listen(PORT, () => console.log(`Listening on port ${PORT}`))
