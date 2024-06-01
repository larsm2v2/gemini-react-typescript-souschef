import React, { useState, useEffect } from "react"
import { RecipeModel } from "../Models/Models"
import RecipeDetails from "../Recipes/Recipe Details/RecipeDetails" // Import your RecipeDetails component
import "../Recipes/Recipes.css" // Import your CSS for styling

interface TemporaryRecipeDisplayProps {
	generatedRecipe: RecipeModel
	onTryAgain: () => void
}

const TemporaryRecipeDisplay: React.FC<TemporaryRecipeDisplayProps> = ({
	generatedRecipe,
	onTryAgain,
}) => {
	const [selectedRecipe, setSelectedRecipe] =
		useState<RecipeModel>(generatedRecipe)

	const handleRecipeClick = () => {
		setSelectedRecipe(generatedRecipe)
		console.log(selectedRecipe)
		console.log("Received generatedRecipe:", generatedRecipe)
	}

	// Function to save the recipe (now calls the backend)
	const handleSaveRecipe = async () => {
		try {
			const response = await fetch("/api/clean-recipe", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(generatedRecipe),
			})
			if (response.ok) {
				// ... (add logic to update your state or show a success message)
				console.log("Recipe saved successfully!")
			} else {
				console.error("Error saving recipe:", response.statusText)
			}
		} catch (error) {
			console.error("Error saving recipe:", error)
		}
	}
	const handleSelectedRecipesChange = () => {}

	useEffect(() => {
		setSelectedRecipe(generatedRecipe) // Update selected recipe whenever generatedRecipe changes
	}, [generatedRecipe])
	return (
		<div className="recipes-container">
			<div className="recipes-box">
				<div className="recipes-index">
					<h2>Souschef Recipe</h2>
					<ul>
						<li
							key={generatedRecipe.id}
							onClick={handleRecipeClick}
						>
							{generatedRecipe.name}
						</li>
					</ul>
				</div>

				{selectedRecipe && (
					<RecipeDetails
						recipe={selectedRecipe}
						onSelectedRecipesChange={handleSelectedRecipesChange}
						isSelected={false}
					/>
				)}
			</div>
			<div className="recipe-actions">
				<button onClick={onTryAgain}>Try Again</button>
				<button onClick={handleSaveRecipe}>Save Recipe</button>
			</div>
		</div>
	)
}

export default TemporaryRecipeDisplay
