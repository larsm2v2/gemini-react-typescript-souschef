import React, { useState, useEffect } from "react"
//import json from "./Recipes.json" with {type: "json"};
import "./Recipes.json"
import "./Recipes.css"
import "../Models/Models"

const Recipes = () => {
	const [recipes, setRecipes] = useState([])
	const [selectedRecipe, setSelectedRecipe] = useState(null)

	useEffect(() => {
		// Import the Recipes data as an array
		/*  		import("./Recipes.json").then((data) => setRecipes(data.default))
	}, []) */
		fetch("./Recipes.json")
			.then((response) => response.json())
			.then((data) => {
				setRecipes(data.default)
			})
	}, [])
	const handleRecipeClick = (recipeName: string) => {
		const selectedRecipe = recipes.find(
			(recipe) => recipe?.name === recipeName
		)
		if (selectedRecipe === null) {
			return "Selected recipe not found"
		} else {
			setSelectedRecipe(selectedRecipe)
		}
	}

	return (
		<div className="recipes-container">
			<h1>myRecipes</h1>
			<div className="recipes-box">
				<div className="recipes-index">
					<h2>Index</h2>
					<div>
						{recipes.length > 0 ? (
							<ul>
								{recipes.map((recipe) => (
									<li key={recipe.id}>
										<a href={`/recipes/${recipe.id}`}>
											{recipe.name}
										</a>
									</li>
								))}
							</ul>
						) : (
							<p>No recipes found.</p>
						)}
					</div>
				</div>
				<div className="recipes-show">
					{selectedRecipe && (
						<div>
							<h2>{selectedRecipe?.name}</h2>
							<p>{selectedRecipe?.description}</p>
							{/* Display other recipe details here */}
						</div>
					)}
				</div>
			</div>
		</div>
	)
}

export default Recipes
