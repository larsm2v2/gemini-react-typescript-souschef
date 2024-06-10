import React, { useState, useEffect } from "react"
import { RecipeModel } from "../Models/Models"
import RecipeDetails from "../Recipes/Recipe Details/RecipeDetails" // Import your RecipeDetails component
import "../Recipes/Recipes.css" // Import your CSS for styling
import Chef from "../../assets/Chef" // Import your Chef SVG component

interface RecipeDisplayProps {
	willTryAgain: boolean
	setWillTryAgain: (willTryAgain: boolean) => void
	savedRecipe: boolean
	setSavedRecipe: (savedRecipe: boolean) => void
	isLoading: boolean
	setIsLoading: (isLoading: boolean) => void
	activeContent: "recipes" | "sousChef"
	setActiveContent: (content: "recipes" | "sousChef") => void
	selectedRecipeId?: string
	selectedRecipeIds: string[]
	setSelectedRecipeIds: (ids: string[]) => void
	generatedRecipe?: RecipeModel | null
	setGeneratedRecipe: (recipe: RecipeModel | null) => void
	selectedRecipe: RecipeModel | null
	setSelectedRecipe: (recipe: RecipeModel | null) => void
	recipeToDisplay?: RecipeModel | null
	setRecipeToDisplay: (recipe: RecipeModel | null) => void
}

const RecipeDisplay: React.FC<RecipeDisplayProps> = ({
	willTryAgain,
	setWillTryAgain,
	savedRecipe,
	setSavedRecipe,
	isLoading,
	setIsLoading,
	activeContent,
	setActiveContent,
	selectedRecipeId,
	selectedRecipeIds,
	setSelectedRecipeIds,
	generatedRecipe,
	setGeneratedRecipe,
	selectedRecipe,
	setSelectedRecipe,
	recipeToDisplay,
	setRecipeToDisplay,
}) => {
	const [recipe, setRecipe] = useState<RecipeModel | null>(null)
	const [showRecipe, setShowRecipe] = useState<RecipeModel | null>(null)
	const [showShoppingList, setShowShoppingList] = useState<boolean>(false)
	const [recipes, setRecipes] = useState<RecipeModel[]>([])

	const handleRecipeClick = () => {
		setSelectedRecipe(recipe)
		console.log(selectedRecipe)
		console.log("Received generatedRecipe:", generatedRecipe)
	}

	// Function to save the recipe
	const handleSaveRecipe = async () => {
		setSavedRecipe(false)
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
				setSavedRecipe(true)
			} else {
				console.error("Error saving recipe:", response.statusText)
			}
		} catch (error) {
			console.error("Error saving recipe:", error)
		}
	}
	const handleSelectedRecipesChange = () => {}

	useEffect(() => {
		if (activeContent === "sousChef" && generatedRecipe) {
			setSelectedRecipe(generatedRecipe) // Update selected recipe whenever generatedRecipe changes
		} else {
			if (activeContent === "recipes" && selectedRecipe) {
				setSelectedRecipe(recipe)
			}
		}
	}, [
		activeContent,
		recipe,
		setSelectedRecipe,
		selectedRecipe,
		generatedRecipe,
	])

	useEffect(() => {
		if (selectedRecipeId) {
			const recipe = recipes.find(
				(r: RecipeModel) => r.id === selectedRecipeId
			)
			if (recipe) {
				setSelectedRecipe(recipe) // Use the recipeToDisplay state to store and display the selected recipe
			} else {
				// Handle the case where the recipe isn't found locally (e.g., fetch from server)
			}
		} else {
			setSelectedRecipe(null) // Clear the displayed recipe when no recipe is selected
		}
	}, [setSelectedRecipe, selectedRecipeId, recipes]) // Add recipes as a dependency

	const tryAgainToTrue = () => {
		setWillTryAgain(true)
		setIsLoading(true)
		setSavedRecipe(false)
	}

	return (
		<div className="recipes-container">
			{selectedRecipe ? (
				<div className="recipes-container">
					<RecipeDetails
						showRecipe={selectedRecipe}
						onSelectedRecipesChange={handleSelectedRecipesChange}
						isSelected={selectedRecipeIds.includes(
							selectedRecipeId || ""
						)}
					/>

					<div>
						<button className="surprise" onClick={tryAgainToTrue}>
							{isLoading ? `Processing...` : `Try Again`}
						</button>
						<button className="surprise" onClick={handleSaveRecipe}>
							{savedRecipe ? `Saved` : `Save Recipe`}
						</button>
					</div>
				</div>
			) : (
				<div className="chefContainer">
					<Chef isLoading={isLoading} size={300} />
				</div>
			)}
		</div>
	)
}

export default RecipeDisplay
