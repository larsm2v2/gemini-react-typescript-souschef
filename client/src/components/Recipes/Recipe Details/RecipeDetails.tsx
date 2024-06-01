import React from "react"
import { RecipeModel } from "../../Models/Models"
import "../Recipes.css"

// Interface for ingredient groups
interface IngredientGroup {
	name: string
	ingredients: {
		[subcategory: string]: {
			id: number
			quantity: number
			name: string
			unit?: string
		}[]
	} // Assuming consistent ingredient structure
}

interface RecipeDetailsProps {
	recipe: RecipeModel
	onSelectedRecipesChange: (recipe: RecipeModel) => void
	isSelected: boolean
}

const RecipeDetails: React.FC<RecipeDetailsProps> = ({
	recipe,
	onSelectedRecipesChange,
	isSelected,
}) => {
	// Helper function to capitalize headings
	const capitalizeHeading = (str: string) => {
		return str
			.split(" ")
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
			.join(" ")
	}

	// Function to toggle selection and update parent component
	const handleCheckboxChange = () => {
		onSelectedRecipesChange(recipe)
	}

	// 1. Organize Ingredients by Subheading (including "Selected Recipes" if checked)
	const ingredientGroups: IngredientGroup[] = [
		...(isSelected
			? [
					{
						name: "Selected Recipes",
						// Wrap the dish ingredients in an object with the key "dish"
						ingredients: { dish: recipe.ingredients.dish },
					},
			  ]
			: []),

		// For all other subcategories, you need to ensure you're creating IngredientGroup objects
		...Object.entries(recipe.ingredients).flatMap(([name, ingredients]) => {
			if (name !== "dish" && Array.isArray(ingredients)) {
				// Explicitly set unit to undefined if it's null
				const fixedIngredients = ingredients.map((ing) => ({
					...ing,
					unit: ing.unit || undefined,
				}))

				return [
					{
						name,
						ingredients: { [name]: fixedIngredients },
					},
				]
			} else {
				return []
			}
		}),
	]

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
						{/* Access the ingredients array for the specific group */}
						{Object.values(group.ingredients).flatMap(
							(ingredientsArray) =>
								ingredientsArray
									.filter(
										(ingredient) =>
											ingredient.name &&
											ingredient.quantity
									)
									.map((ingredient) => (
										<li key={ingredient.id}>
											{`${ingredient.quantity} ${
												ingredient.unit
													? ingredient.unit
													: ""
											} ${ingredient.name}`}
										</li>
									))
						)}
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
