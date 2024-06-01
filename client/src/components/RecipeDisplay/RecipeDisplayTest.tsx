import React, { useState } from "react"
import TemporaryRecipeDisplay from "../RecipeDisplay/RecipeDisplay"
import { RecipeModel } from "../Models/Models"

const RecipeDisplayTest: React.FC = () => {
	const [testRecipe, setTestRecipe] = useState<RecipeModel>({
		name: "Test Recipe",
		"unique id": 12345,
		id: "test-recipe",
		cuisine: "American",
		"meal type": "dinner",
		"dietary restrictions and designations": [],
		"serving info": {
			"prep time": "15 minutes",
			"cook time": "30 minutes",
			"total time": "45 minutes",
			"number of people served": 4,
		},
		ingredients: {
			dish: [
				{ id: 1, name: "Ingredient 1", quantity: 2, unit: "cups" },
				{
					id: 2,
					name: "Ingredient 2",
					quantity: 1,
					unit: "tablespoon",
				},
			],
			// Add other ingredient categories if needed
		},
		instructions: [
			{ number: 1, text: "Step 1" },
			{ number: 2, text: "Step 2" },
		],
		notes: ["This is a test note."],
		nutrition: {
			serving: "1 serving",
			calories: "250",
			carbohydrates: "20g",
			protein: "10g",
			fat: "5g",
			"saturated fat": "2g",
			fiber: "3g",
			sugar: "5g",
		},
	})

	const handleTryAgain = () => {
		// You can add any test logic for retrying here
		console.log("Try Again button clicked")
	}

	return (
		<div>
			<TemporaryRecipeDisplay
				generatedRecipe={testRecipe}
				onTryAgain={handleTryAgain}
			/>
		</div>
	)
}

export default RecipeDisplayTest
