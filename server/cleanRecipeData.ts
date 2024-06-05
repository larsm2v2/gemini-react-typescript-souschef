//import * as recipeData from "./Recipes.json"
import { RecipeModel } from "./Models" // Import your RecipeModel interface

function parseQuantity(quantityStr: string | number): number {
	if (typeof quantityStr === "number") return quantityStr

	const parts = quantityStr.split("/")
	if (parts.length === 2) {
		const numerator = parseInt(parts[0], 10)
		const denominator = parseInt(parts[1], 10)
		if (!isNaN(numerator) && !isNaN(denominator) && denominator !== 0) {
			return numerator / denominator
		}
	}
	return parseFloat(quantityStr) || 0 // Fallback to parseFloat or 0 if invalid
}

// Function to fix a single recipe
export function cleanRecipe(recipe: any): RecipeModel {
	const cleanedRecipe = {
		...recipe,
		"unique id": parseInt(recipe["unique id"], 10) || 0,
		"serving info": {
			...recipe["serving info"],
			"prep time": recipe["serving info"]["prep time"] || "",
			"cook time": recipe["serving info"]["cook time"] || "",
			"total time": recipe["serving info"]["total time"] || "",
			"number of people served":
				parseInt(
					recipe["serving info"]["number of people served"],
					10
				) || 0,
		},
		ingredients: Object.keys(recipe.ingredients).reduce((acc, category) => {
			if (Array.isArray(recipe.ingredients[category])) {
				acc[category] = recipe.ingredients[category].map(
					(
						ingredient: RecipeModel["ingredients"][typeof category][number]
					) => ({
						...ingredient,
						id: ingredient.id || 0,
						quantity: parseQuantity(ingredient.quantity),
						unit: ingredient.unit || undefined,
					})
				)
			}
			return acc
		}, {} as RecipeModel["ingredients"]),
		"dietary restrictions and designations":
			recipe["dietary restrictions and designations"] || [], // Set to empty array if not present
		notes: recipe.notes || [], // Set to empty array if not present
	}

	return cleanedRecipe as RecipeModel
}

// Fix all recipes in the data
export function cleanedRecipeData(recipeData: any[]): RecipeModel[] {
	const seenRecipes = new Set<string>() // Keep track of seen recipe combinations
	const cleanedRecipes = (recipeData as any[]).map(cleanRecipe) // Clean the recipes first

	const uniqueRecipes: RecipeModel[] = []

	for (const recipe of cleanedRecipes) {
		const recipeKey = `${recipe.name}-${recipe.cuisine}` // Create a unique key
		if (!seenRecipes.has(recipeKey)) {
			uniqueRecipes.push(recipe)
			seenRecipes.add(recipeKey)
		}
	}

	return uniqueRecipes
}
