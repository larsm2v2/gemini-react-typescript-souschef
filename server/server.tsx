import * as express from "express"
import { Request, Response } from "express"
//import cors from "cors"
const cors = require("cors")
import * as fs from "fs"
import * as fsPromises from "fs/promises"
import * as path from "path"
import * as dotenv from "dotenv"
import { cleanRecipe, cleanedRecipeData } from "./cleanRecipeData"
import { GoogleGenerativeAI } from "@google/generative-ai"
import { RecipeModel } from "./Models"

dotenv.config()

const PORT = 8000
const app = express()
app.use(cors())
app.use(express.json())
express.response

//API key for Google Generative AI
const apiKey = process.env.API_KEY
if (!apiKey) {
	throw new Error("API_KEY environment variable not found!")
}
const genAI = new GoogleGenerativeAI(apiKey)

const recipeFilePath = path.resolve(__dirname, "Recipes.json")
let activeSSEConnections: Response[] = []

// Serve Recipes.json
app.get("/api/recipes-stream", (req, res) => {
	//SSE Headers
	res.writeHead(200, {
		"Content-Type": "text/event-stream",
		"Cache-Control": "no-cache",
		Connection: "keep-alive",
	})
	// Send initial "ping" message to keep the connection alive
	res.write("event: ping\ndata: \n\n")
	activeSSEConnections.push(res) // Add new connection to the list

	req.on("close", () => {
		activeSSEConnections = activeSSEConnections.filter(
			(conn) => conn !== res
		) // Remove closed connection
	})
})

fs.watchFile(recipeFilePath, async (curr, prev) => {
	if (curr.mtime !== prev.mtime) {
		// Check if the file has changed
		try {
			const rawData = await fsPromises.readFile(recipeFilePath, "utf-8")
			const recipeData: any[] = JSON.parse(rawData)
			const cleanedRecipes: RecipeModel[] = cleanedRecipeData(recipeData)

			const eventData = {
				type: "recipe-update",
				data: cleanedRecipes,
			}

			// Send the updated recipe data as an SSE event
			activeSSEConnections.forEach((res) => {
				res.write(`event: recipe-update\n`) // Event type
				res.write(`data: ${JSON.stringify(eventData)}\n\n`) // Data payload
			})
		} catch (error) {
			console.error("Error sending SSE update:", error)
		}
	}
})

app.post("/gemini", async (req: Request, res: Response) => {
	const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro-001" })

	const chat = model.startChat({
		history: req.body.history,
		generationConfig: {
			/* maxOutputTokens: 100, */
			temperature: 0.7,
			topP: 0.4,
		},
	})
	const msg = req.body.message
	const result = await chat.sendMessageStream(msg)
	const response = await result.response
	const text = response.text()
	res.send(text)
})

app.post("/api/clean-recipe", (req: Request, res: Response) => {
	try {
		const recipe: RecipeModel = req.body // Type assertion to RecipeModel
		const cleanedRecipe = cleanRecipe(recipe)
		res.status(200).json(cleanedRecipe)
	} catch (error) {
		console.error("Error cleaning recipe data:", error)
		res.status(500).json({ error: "Error cleaning recipe data." })
	}
})

app.post("/api/clean-recipes", async (req: Request, res: Response) => {
	try {
		// 1. Read recipe data
		let rawData
		try {
			rawData = await fsPromises.readFile(recipeFilePath, "utf-8")
		} catch (readError) {
			// If Recipes.json doesn't exist, create an empty array
			if (readError.code === "ENOENT") {
				console.warn("Recipes.json not found, creating an empty file.")
				await fsPromises.writeFile(recipeFilePath, "[]")
				rawData = "[]"
			} else {
				throw readError // Re-throw other errors
			}
		}
		const recipeData: any[] = JSON.parse(rawData)

		// 2. Fix the recipe data
		const cleanedRecipes: RecipeModel[] = cleanedRecipeData(recipeData)
		console.log("Recipes.json path:", recipeFilePath)

		// 3. Write cleaned data back to file
		await fsPromises.writeFile(
			recipeFilePath,
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

app.post("/api/clean-and-add-recipes", async (req: Request, res: Response) => {
	try {
		// 1. Read recipe data
		let rawData
		try {
			rawData = await fsPromises.readFile(recipeFilePath, "utf-8")
		} catch (readError) {
			// If Recipes.json doesn't exist, create an empty array
			if (readError.code === "ENOENT") {
				console.warn("Recipes.json not found, creating an empty file.")
				await fsPromises.writeFile(recipeFilePath, "[]")
				rawData = "[]"
			} else {
				throw readError // Re-throw other errors
			}
		}
		const recipeData: any[] = JSON.parse(rawData)

		// 2. Fix the recipe data
		const recipe: RecipeModel = req.body
		const cleanedRecipe: RecipeModel = cleanRecipe(recipe)
		const withAddedRecipe = Array.isArray(cleanedRecipe)
			? [...recipeData, ...cleanedRecipe]
			: [...recipeData, cleanedRecipe]
		console.log("All Recipes with Addition: ", withAddedRecipe)
		console.log("Recipes.json path: ", recipeFilePath)

		// 3. Write cleaned data back to file
		await fsPromises.writeFile(
			recipeFilePath,
			JSON.stringify(withAddedRecipe, null, 2)
		)

		// 4. Send success response
		res.status(200).json({
			message: "Recipe data fixed successfully.",
			data: withAddedRecipe,
		})
	} catch (error) {
		console.error("Error fixing recipe data:", error)
		res.status(500).json({ error: "Error fixing recipe data." })
	}
})

app.listen(PORT, () => console.log(`Listening on port ${PORT}`))
