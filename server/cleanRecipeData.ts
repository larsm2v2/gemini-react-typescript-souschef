import recipeData from "./Recipes.json"
import { RecipeModel } from "../server/Models.js" // Import your RecipeModel interface

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
						quantity: ingredient.quantity || 0,
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
	return (recipeData as any[]).map(cleanRecipe)
}
