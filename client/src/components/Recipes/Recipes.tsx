import React, { useState, useEffect } from "react"
import recipeData from "./Recipes.json"
import "./Recipes.css"
import { RecipeModel } from "../Models/Models"
import RecipeDetails from "./Recipe Details/RecipeDetails"

const Recipes = () => {
	const [recipes, setRecipes] = useState<RecipeModel[]>(
		recipeData as RecipeModel[]
	)
	const [selectedRecipe, setSelectedRecipe] = useState<RecipeModel | null>(
		null
	)
	const [searchQuery, setSearchQuery] = useState("")
	const [showSelected, setShowSelected] = useState(false)
	const [selectedRecipes, setSelectedRecipes] = useState<{
		[key: string]: boolean
	}>({})

	// Filtering based on search and showSelected
	const filteredRecipes = recipes.filter((recipe) => {
		const searchTerm = searchQuery.toLowerCase()
		const recipeValues = Object.values(recipe)

		if (showSelected) {
			return selectedRecipes[recipe.id]
		}

		for (const value of recipeValues) {
			if (
				typeof value === "string" &&
				value.toLowerCase().includes(searchTerm)
			) {
				return true
			} else if (Array.isArray(value)) {
				for (const item of value) {
					for (const propValue of Object.values(item)) {
						if (
							(typeof propValue === "string" ||
								typeof propValue === "number") &&
							propValue
								.toString()
								.toLowerCase()
								.includes(searchTerm)
						) {
							return true
						}
					}
				}
			}
		}
		return false
	})

	// Handling recipe selection
	const handleRecipeClick = (recipeId: string) => {
		const clickedRecipe = recipes.find((recipe) => recipe.id === recipeId)
		setSelectedRecipe(clickedRecipe || null)
	}

	// Handling checkbox changes for selected recipes
	const handleSelectedRecipesChange = (recipe: RecipeModel) => {
		setSelectedRecipes((prevSelected) => ({
			...prevSelected,
			[recipe.id]: !prevSelected[recipe.id], // Toggle selected state for this recipe
		}))
	}

	// Load selected recipes from local storage on component mount
	useEffect(() => {
		const storedSelectedRecipes = localStorage.getItem("selectedRecipes")
		if (storedSelectedRecipes) {
			setSelectedRecipes(JSON.parse(storedSelectedRecipes))
		}
	}, [])

	// Save selected recipes to local storage whenever it changes
	useEffect(() => {
		localStorage.setItem("selectedRecipes", JSON.stringify(selectedRecipes))
	}, [selectedRecipes])

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
						isSelected={selectedRecipes[selectedRecipe.id] || false} // Pass isSelected for the current recipe
					/>
				)}
			</div>
		</div>
	)
}

export default Recipes
