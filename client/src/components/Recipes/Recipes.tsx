import React, { useState } from "react"
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

	const handleRecipeClick = (recipeId: string) => {
		const selectedRecipe = recipes.find((recipe) => recipe.id === recipeId)
		setSelectedRecipe(selectedRecipe || null)
	}

	return (
		<div className="recipes-container">
			<div className="recipes-box">
				<div className="recipes-index">
					<h2>Index</h2>
					<div>
						<ul>
							{recipes.map((recipe) => (
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
				{selectedRecipe && <RecipeDetails recipe={selectedRecipe} />}
			</div>
		</div>
	)
}

export default Recipes
