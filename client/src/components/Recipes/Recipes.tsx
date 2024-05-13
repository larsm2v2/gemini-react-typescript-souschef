import React, { useState, useEffect } from "react";
import json from "./Recipes.json" with {type: "json"};
import "./Recipes.css";
import "../Models/Models";

const Recipes = () => {
	const [recipes, setRecipes] = useState([])
	const [selectedRecipe, setSelectedRecipe] = useState(null)

	useEffect(() => {
		// Import the Recipes data as an array
 		import("./Recipes.json").then((data) => setRecipes(data.default))
	}, [])

	const handleRecipeClick = (recipeName) => {
		const selectedRecipe = recipes.find(
			(recipe) => recipe?.name === recipeName
		)
		setSelectedRecipe(selectedRecipe)
	}

	return (
		<div className="recipes-container">
			<h1>myRecipes</h1>
			<div className="recipes-box">
				<div className="recipes-index">
					<h2>Index</h2>
					<div>
							<ul>
								{recipes && recipes.map((recipe) => (
									<li key={recipe?.id}>
										<a href={`/recipes/${recipe?.id}`}>
											{recipe?.name}
										</a>
									</li>
								))}
							</ul>
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
