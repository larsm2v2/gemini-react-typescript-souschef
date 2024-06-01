import React, { useState, useEffect } from "react"
import "./ShoppingList.css"
import { RecipeModel } from "../Models/Models"
import EditableList from "./EditableList/EditableList"
import shoppingListData from "./ShoppingList.json"
import { ListItem } from "../Models/Models"
import recipeData from "../Recipes/Recipes.json"

// Fetch recipe by ID (from the imported Recipes.json)
const fetchRecipeById = (recipeId: string): RecipeModel | undefined => {
	const recipe = (recipeData as RecipeModel[]).find(
		(recipe) => recipe.id === recipeId
	)
	if (!recipe) return undefined

	const fixedRecipe = {
		...recipe,
		"serving info": {
			...recipe["serving info"],
			"prep time": recipe["serving info"]["prep time"] || "", // Replace null with empty string
			"total time": recipe["serving info"]["total time"] || "", // Replace null with empty string
			"number of people served":
				parseInt(
					recipe["serving info"]["number of people served"] as string,
					10
				) || 0, // Convert to number or default to 0
		},
	}

	return fixedRecipe as RecipeModel
}
const ShoppingList: React.FC<{ selectedRecipeIds: string[] }> = ({
	selectedRecipeIds,
}) => {
	const [listItems, setListItems] = useState<ListItem[]>(
		shoppingListData.map((item) => ({
			...item,
			listItem: item.item,
			isDone: false,
			toTransfer: false,
		}))
	)
	const [newItem, setNewItem] = useState<ListItem>({
		id: Date.now(),
		quantity: 0,
		unit: "",
		listItem: "",
		isDone: false,
		toTransfer: false,
	})

	// Helper function to consolidate ingredients
	const consolidateIngredients = (
		listItems: ListItem[],
		newItems: ListItem[],
		removingRecipe?: RecipeModel
	): ListItem[] => {
		return [...listItems, ...(newItems || [])]
			.reduce((acc: ListItem[], currentItem) => {
				const existingItem = acc.find(
					(item) =>
						item.listItem === currentItem.listItem &&
						item.unit.replace(/s$/, "") ===
							currentItem.unit.replace(/s$/, "")
				)

				if (existingItem) {
					if (removingRecipe) {
						// If removing a recipe, subtract ingredient quantity
						const recipeIngredient =
							removingRecipe.ingredients.dish.find(
								(ing) => ing.name === currentItem.listItem
							)
						existingItem.quantity = Math.max(
							0,
							existingItem.quantity -
								(recipeIngredient?.quantity || 0)
						)
					} else {
						// If adding a recipe, add ingredient quantity
						existingItem.quantity += currentItem.quantity
					}
				} else {
					acc.push(currentItem)
				}
				return acc
			}, [] as ListItem[])
			.filter((item) => item.quantity > 0) // Remove items with zero quantity
	}

	useEffect(() => {
		const fetchAndConsolidateIngredients = async () => {
			// Fetch ingredient promises for all selected recipes
			const ingredientPromises: Promise<ListItem[]>[] =
				selectedRecipeIds.map(async (recipeId) => {
					const recipe = await fetchRecipeById(recipeId)
					if (!recipe) return []

					return Object.values(recipe.ingredients).flatMap(
						(ingredientsArray) =>
							ingredientsArray.map((ingredient) => ({
								id: Date.now() + Math.random(), // Generate a unique ID
								quantity: ingredient.quantity || 0,
								unit: ingredient.unit || "",
								listItem: ingredient.name,
								isDone: false,
								toTransfer: false,
							}))
					)
				})

			// Wait for all ingredient promises to resolve
			const allNewIngredients = await Promise.all(ingredientPromises)

			// Flatten the array of arrays of ingredients into a single array
			const flattenedIngredients: ListItem[] = allNewIngredients.flat()

			// Consolidate the ingredients
			setListItems((prevListItems) =>
				consolidateIngredients(prevListItems, flattenedIngredients)
			)
		}

		// Call the async function within useEffect
		fetchAndConsolidateIngredients()
	}, [selectedRecipeIds])
	const handleAdd = (e: React.FormEvent) => {
		e.preventDefault()
		if (newItem.listItem.trim() !== "") {
			setListItems((prevItems) =>
				consolidateIngredients(prevItems, [newItem])
			)
			setNewItem({
				id: Date.now(),
				quantity: 0,
				unit: "",
				listItem: "",
				isDone: false,
				toTransfer: false,
			})
		}
	}

	return (
		<div className="shoppinglist-container">
			<h1>myShoppingList</h1>
			<div className="flex-container">
				<div className="edit-box">
					<h2>Editable List</h2>
					<EditableList
						listItems={listItems}
						setListItems={setListItems}
					/>
				</div>
				<div className="transfer-box">
					<h2>Transferable List</h2>
					<div className="transfer-list">
						{/* Implement your transferable list here */}
					</div>
					<button>Transfer to Transferable List</button>
				</div>
			</div>
		</div>
	)
}

export default ShoppingList
