import React, { useState, useEffect, useRef } from "react"
import recipeData from "../../../../server/Recipes.json"
import "./Recipes.css"
import { RecipeModel } from "../Models/Models"
import RecipeDetails from "./Recipe Details/RecipeDetails"

interface RecipesProps {
	selectedRecipeIds: string[]
	setSelectedRecipeIds: React.Dispatch<React.SetStateAction<string[]>>
}

const Recipes: React.FC<RecipesProps> = ({
	selectedRecipeIds,
	setSelectedRecipeIds,
}) => {
	const [recipes, setRecipes] = useState<RecipeModel[]>(
		recipeData as unknown as RecipeModel[]
	)
	const [selectedRecipe, setSelectedRecipe] = useState<RecipeModel | null>(
		null
	)
	const [searchQuery, setSearchQuery] = useState("")
	const [showSelected, setShowSelected] = useState(false)
	const prevSelectedRecipeIds = useRef<string[]>(selectedRecipeIds)
	// Filtering based on search and showSelected
	const filteredRecipes = recipes.filter((recipe) => {
		const searchTerm = searchQuery.toLowerCase()
		const recipeValues = Object.values(recipe)

		if (showSelected) {
			return selectedRecipeIds.includes(recipe.id)
		}

		return recipeValues.some((value) => {
			if (typeof value === "string") {
				return value.toLowerCase().includes(searchTerm)
			} else if (Array.isArray(value)) {
				return value.some((item) =>
					Object.values(item).some(
						(propValue) =>
							typeof propValue === "string" &&
							propValue.toLowerCase().includes(searchTerm)
					)
				)
			}
			return false
		})
	})

	// Handling recipe selection
	const handleRecipeClick = (recipeId: string) => {
		const clickedRecipe = recipes.find((recipe) => recipe.id === recipeId)
		setSelectedRecipe(clickedRecipe || null)
	}

	// Handling checkbox changes for selected recipes
	const handleSelectedRecipesChange = (recipe: RecipeModel) => {
		setSelectedRecipeIds((prevSelected) => {
			if (prevSelected.includes(recipe.id)) {
				return prevSelected.filter((id) => id !== recipe.id)
			} else {
				return [...prevSelected, recipe.id]
			}
		})
	}

	// Load selected recipes from local storage on component mount
	useEffect(() => {
		const storedSelectedRecipeIds =
			localStorage.getItem("selectedRecipeIds")
		if (storedSelectedRecipeIds) {
			setSelectedRecipeIds(JSON.parse(storedSelectedRecipeIds))
		}
	}, [setSelectedRecipeIds])

	// Save selected recipes to local storage whenever it changes
	useEffect(() => {
		localStorage.setItem(
			"selectedRecipeIds",
			JSON.stringify(selectedRecipeIds)
		)
	}, [selectedRecipeIds])
	// Effect to trigger ingredient addition when selected recipes change
	useEffect(() => {
		// Check for newly added recipe
		const newRecipeId = selectedRecipeIds.find(
			(id) => !prevSelectedRecipeIds.current.includes(id)
		)

		if (newRecipeId) {
			const newRecipe = recipes.find((r) => r.id === newRecipeId)
			if (newRecipe) {
				// Pass the new recipe to the parent (App) for adding ingredients
				// Assuming App has a function like onAddRecipeIngredients
				// onAddRecipeIngredients(newRecipe);
			}
		}

		// Update the ref for the next comparison
		prevSelectedRecipeIds.current = selectedRecipeIds
	}, [selectedRecipeIds, recipes])

	useEffect(() => {
		const cleanServerRecipes = async () => {
			try {
				const response = await fetch(
					"http://localhost:8000/api/clean-recipes",
					{
						method: "POST",
					}
				)
				if (!response.ok) {
					throw new Error("Failed to fix recipe data on server")
				}
				const data = await response.json()
				console.log(data.message) // Log the success message
				// Optionally, refetch the recipe data from your server or local file
				// after the data has been fixed.
			} catch (error) {
				console.error(error)
			}
		}

		cleanServerRecipes() // Fix data initially on mount
	}, [])

	const cleanServerRecipes = async () => {
		try {
			const response = await fetch("/api/clean-recipes", {
				method: "POST",
			})
			if (!response.ok) {
				throw new Error("Failed to fix recipe data on server")
			}
			const data = await response.json()
			console.log(data.message) // Log the success message
			// Optionally, refetch the recipe data from your server or local file
			// after the data has been fixed.
		} catch (error) {
			console.error(error)
		}
	}

	const handleAdd = async (newRecipe: RecipeModel) => {
		try {
			const response = await fetch("/api/clean-recipe", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(newRecipe),
			})
			if (!response.ok) {
				throw new Error("Failed to clean recipe on server.")
			}
			const cleanedNewRecipe = await response.json()
			setRecipes((prevRecipes) => [...prevRecipes, cleanedNewRecipe])
		} catch (error) {
			console.error(error)
		}
	}

	return (
		<div className="recipes-container">
			<div>
				<input
					type="text"
					placeholder="Search recipes..."
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
				/>
				<label>
					<input
						type="checkbox"
						checked={showSelected}
						onChange={() => setShowSelected(!showSelected)}
					/>
					Show Selected Recipes
				</label>
			</div>
			<div className="recipes-box">
				<div className="recipes-index">
					<h2>Index</h2>
					<div>
						<ul>
							{filteredRecipes.map((recipe) => (
								<li
									key={recipe.id}
									onClick={() => handleRecipeClick(recipe.id)}
								>
									{recipe.name}
								</li>
							))}
						</ul>
					</div>
				</div>

				{selectedRecipe && (
					<RecipeDetails
						recipe={selectedRecipe}
						onSelectedRecipesChange={handleSelectedRecipesChange}
						isSelected={selectedRecipeIds.includes(
							selectedRecipe.id
						)}
					/>
				)}
			</div>
		</div>
	)
}

export default Recipes
