import React, { useState } from "react"
import { RecipeModel } from "../../Models/Models"
import "../Recipes.css"

// Interface for ingredient groups
interface IngredientGroup {
	name: string
	ingredients: RecipeModel["ingredients"]["dish"] // Assuming consistent ingredient structure
}

interface RecipeDetailsProps {
	recipe: RecipeModel
	onSelectedRecipesChange: (recipe: RecipeModel) => void
}

const RecipeDetails: React.FC<RecipeDetailsProps> = ({
	recipe,
	onSelectedRecipesChange,
}) => {
	// Helper function to capitalize headings
	const capitalizeHeading = (str: string) => {
		return str
			.split(" ")
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
			.join(" ")
	}

	// State to manage selected recipe
	const [isSelected, setIsSelected] = useState(false)

	// Function to toggle selection and update parent component
	const handleCheckboxChange = () => {
		setIsSelected(!isSelected)
		onSelectedRecipesChange(recipe)
	}

	// 1. Organize Ingredients by Subheading (including "Selected Recipes" if checked)
	const ingredientGroups: IngredientGroup[] = isSelected
		? [
				{
					name: "Selected Recipes",
					ingredients: recipe.ingredients.dish,
				},
				...Object.entries(recipe.ingredients).map(
					([name, ingredients]) => ({
						name,
						ingredients,
					})
				),
		  ]
		: Object.entries(recipe.ingredients).map(([name, ingredients]) => ({
				name,
				ingredients,
		  }))

	return (
		<div className="recipes-container">
			<h2>{capitalizeHeading(recipe.name)}</h2>

			{/* Checkbox for selecting recipe */}
			<div>
				<input
					type="checkbox"
					checked={isSelected}
					onChange={handleCheckboxChange}
				/>
				<label>Add to Selected Recipes</label>
			</div>

			{/* 2. Display Other Details (with capitalized headings) */}
			<div className="recipe-info">
				<p>
					<strong>{capitalizeHeading("Cuisine")}:</strong>{" "}
					{recipe.cuisine}
				</p>
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
							) // Filter out null values
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
