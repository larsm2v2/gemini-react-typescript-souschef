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
	const [selectedRecipes, setSelectedRecipes] = useState<RecipeModel[]>([])

	// Filtering based on search and showSelected
	const filteredRecipes = recipes.filter((recipe) => {
		const matchesSearch = Object.values(recipe).some((value) => {
			if (typeof value === "string") {
				return value.toLowerCase().includes(searchQuery.toLowerCase())
			} else if (Array.isArray(value)) {
				return value.some((item) =>
					Object.values(item).some((v) => {
						if (typeof v === "string" || typeof v === "number") {
							// Check for string or number
							return v
								.toString()
								.toLowerCase()
								.includes(searchQuery.toLowerCase()) // Convert to string if number
						}
						return false
					})
				)
			}
			return false
		})
		return showSelected ? selectedRecipes.includes(recipe) : matchesSearch
	})

	// Handling recipe selection
	const handleRecipeClick = (recipeId: string) => {
		const clickedRecipe = recipes.find((recipe) => recipe.id === recipeId)
		setSelectedRecipe(clickedRecipe || null)
	}

	// Handling checkbox changes for selected recipes
	const handleSelectedRecipesChange = (recipe: RecipeModel) => {
		setSelectedRecipes((prevSelected) =>
			prevSelected.includes(recipe)
				? prevSelected.filter((r) => r !== recipe)
				: [...prevSelected, recipe]
		)
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
					/>
				)}
			</div>
		</div>
	)
}

export default Recipes
