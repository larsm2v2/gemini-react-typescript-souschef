const recipeData = require("../server/Recipes.json")
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
		ingredients: {
			...recipe.ingredients,
			dish: recipe.ingredients.dish.map((ingredient: any) => ({
				...ingredient,
				id: ingredient.id.toString(),
				quantity: parseFloat(ingredient.amount) || 0,
				unit: ingredient.unit || undefined,
			})),
			// ... Fix other ingredient categories (sauce, marinade, etc.) similarly
		},
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
