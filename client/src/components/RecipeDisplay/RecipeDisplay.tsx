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
	selectedRecipeId?: string | null
	setSelectedRecipeId: (id: string | null) => void
	selectedRecipeIds: string[]
	setSelectedRecipeIds: (ids: string[]) => void
	generatedRecipe?: RecipeModel | null
	setGeneratedRecipe: (recipe: RecipeModel | null) => void
	selectedRecipe: RecipeModel | null
	setSelectedRecipe: (recipe: RecipeModel | null) => void
	recipeToDisplay: RecipeModel | null
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
	const [fetchingRecipe, setFetchingRecipe] = useState<boolean>(false)

	const handleRecipeClick = () => {
		setSelectedRecipe(recipe)
		console.log(selectedRecipe)
		console.log("Received generatedRecipe:", generatedRecipe)
	}
	const fetchRecipes = async () => {
		try {
			const response = await fetch(
				"http://localhost:8000/api/clean-recipes",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
				}
			)
			if (response.ok) {
				const data = await response.json()
				setRecipes(data.data) // Assuming the server sends the cleaned recipes in `data.data`
			} else {
				throw new Error("Failed to fetch recipes.")
			}
		} catch (error) {
			console.error("Error fetching recipes:", error)
		} finally {
			setIsLoading(false)
		}
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
			setRecipeToDisplay(generatedRecipe) // Update selected recipe whenever generatedRecipe changes
		} else if (selectedRecipeId) {
			setFetchingRecipe(true)
			fetchRecipes().then(() => {
				const recipe = recipes.find(
					(r: RecipeModel) => r.id === selectedRecipeId
				)
				setRecipeToDisplay(recipe || null)
				setFetchingRecipe(false)
			})
		} else {
			setRecipeToDisplay(null)
		}
	}, [
		activeContent,
		selectedRecipeId,
		generatedRecipe,
		recipes,
		fetchRecipes,
		setRecipeToDisplay,
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
		setGeneratedRecipe(null) // Clear generated recipe when trying again
		setActiveContent("sousChef")
	}

	return (
		<div className="recipes-container">
			{selectedRecipe ? (
				<div className="recipes-container">
					<RecipeDetails
						showRecipe={recipeToDisplay}
						onSelectedRecipesChange={handleSelectedRecipesChange}
						isSelected={selectedRecipeIds.includes(
							selectedRecipeId || ""
						)}
					/>

					{activeContent === "sousChef" && (
						<div>
							<button
								className="surprise"
								onClick={tryAgainToTrue}
							>
								{isLoading ? `Processing...` : `Try Again`}
							</button>
							<button
								className="surprise"
								onClick={handleSaveRecipe}
							>
								{savedRecipe ? `Saved` : `Save Recipe`}
							</button>
						</div>
					)}
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
