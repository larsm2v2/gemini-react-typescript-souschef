import React from "react"
import { RecipeModel } from "../../Models/Models"
import "../Recipes.css"

// Interface for ingredient groups
interface IngredientGroup {
	name: string
	ingredients: RecipeModel["ingredients"]["dish"] // Assuming all ingredient lists have the same structure as "dish"
}

const RecipeDetails: React.FC<{ recipe: RecipeModel }> = ({ recipe }) => {
	// Helper function to capitalize headings
	const capitalizeHeading = (str: string) => {
		return str
			.split(" ")
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
			.join(" ")
	}

	// 1. Organize Ingredients by Subheading
	const ingredientGroups: IngredientGroup[] = Object.entries(
		recipe.ingredients
	).map(([name, ingredients]) => ({ name, ingredients }))

	return (
		<div className="recipes-container">
			<h2>{capitalizeHeading(recipe.name)}</h2>

			{/* 2. Display Other Details (with capitalized headings) */}
			<div className="recipe-info">
				<p>
					<strong>{capitalizeHeading("Cuisine")}:</strong>{" "}
					{recipe.cuisine}
				</p>
			</div>
			<div>
				<p>
					<strong>{capitalizeHeading("Meal Type")}:</strong>{" "}
					{recipe["meal type"]}
				</p>
			</div>

			{/* 3. Display Ingredients by Subheading (with capitalized headings) */}
			<h2>{capitalizeHeading("Ingredients")}</h2>
			{ingredientGroups.map((group) => (
				<div key={group.name}>
					<h3>{capitalizeHeading(group.name)}</h3>
					<ul>
						{group.ingredients
							.filter(
								(ingredient) =>
									ingredient.name && ingredient.amount
							)
							.map((ingredient) => (
								<li key={ingredient.id}>
									{`${ingredient.amount} ${
										ingredient.unit ? ingredient.unit : ""
									} ${ingredient.name}`}
								</li>
							))}
					</ul>
				</div>
			))}

			{/* 4. Display Instructions (with capitalized heading) */}
			<h2>{capitalizeHeading("Instructions")}</h2>
			<ol>
				{recipe.instructions.map((instruction) => (
					<li key={instruction.number}>{instruction.text}</li>
				))}
			</ol>
		</div>
	)
}

export default RecipeDetails
