import React, { useState } from "react"
import recipeData from "./Recipes.json"
import "./Recipes.css"
import { RecipeModel } from "../Models/Models"

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
				{selectedRecipe && (
					<div className="recipes-show">
						<div>
							<h2>{selectedRecipe.name}</h2>
						</div>
						<div className="recipe-info">
							<p>Cuisine: {selectedRecipe.cuisine}</p>
						</div>
						<div className="recipe-info">
							<p>Meal Type: {selectedRecipe["meal type"]}</p>
						</div>
						<div>
							<h3>Ingredients:</h3>
						</div>
						<div>
							<ul>
								{selectedRecipe.ingredients.dish.map(
									(ingredient) => (
										<li key={ingredient.id}>
											<p>
												{`${ingredient.amount} ${ingredient.unit} ${ingredient.name}`}
											</p>
										</li>
									)
								)}
							</ul>
						</div>
						<div>
							<h3>Instructions:</h3>
						</div>
						<div>
							<ol>
								{" "}
								{selectedRecipe.instructions.map(
									(instruction) => (
										<li key={instruction.number}>
											<p>{instruction.text}</p>
										</li>
									)
								)}
							</ol>
						</div>
					</div>
				)}
			</div>
		</div>
	)
}

export default Recipes
