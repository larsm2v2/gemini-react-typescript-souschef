import React, { useState, useEffect } from "react"
import { RecipeModel } from "../Models/Models"
import RecipeDetails from "../Recipes/Recipe Details/RecipeDetails" // Import your RecipeDetails component
import "../Recipes/Recipes.css" // Import your CSS for styling
import Chef from "../../assets/Chef" // Import your Chef SVG component

interface RecipeDisplayProps {
	generatedRecipe: RecipeModel
	onTryAgain: () => void
	children: React.ReactNode
	isLoading: boolean
}

const RecipeDisplay: React.FC<RecipeDisplayProps> = ({
	generatedRecipe,
	onTryAgain,
	children,
	isLoading,
}) => {
	const [selectedRecipe, setSelectedRecipe] =
		useState<RecipeModel>(generatedRecipe)
	const [showShoppingList, setShowShoppingList] = useState(false)

	const handleRecipeClick = () => {
		setSelectedRecipe(generatedRecipe)
		console.log(selectedRecipe)
		console.log("Received generatedRecipe:", generatedRecipe)
	}

	// Function to save the recipe
	const handleSaveRecipe = async () => {
		try {
			const response = await fetch(
				"http://localhost:8000/api/clean-and-add-recipes",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(generatedRecipe),
				}
			)
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
			<div className="chefContainer">
				<Chef isLoading={isLoading} size={300} />
			</div>
			<div className="recipes-box">
				{children}
				<span className=""></span>
				{!selectedRecipe && <div></div>}
				{selectedRecipe && (
					<div>
						<h2>Souschef Recipe</h2>
						<RecipeDetails
							recipe={selectedRecipe}
							onSelectedRecipesChange={
								handleSelectedRecipesChange
							}
							isSelected={false}
						/>
						<button className="surprise" onClick={onTryAgain}>
							Try Again
						</button>
						<button className="surprise" onClick={handleSaveRecipe}>
							Save Recipe
						</button>
					</div>
				)}
			</div>
		</div>
	)
}

export default RecipeDisplay
