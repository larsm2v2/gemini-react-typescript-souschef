import React, { Fragment, useState, useEffect } from "react"
import "./App.css"
import "./components/Sidebar/Sidebar.css"
import Navbar from "./components/Navbar/Navbar"
import Sidebar from "./components/Sidebar/Sidebar"
import SousChef from "./components/SousChef/SousChef"
import ShoppingList from "./components/ShoppingList/ShoppingList"
import Recipes from "./components/Recipes/Recipes"
import RecipesIndex from "./components/Recipes/RecipesIndex"
import RecipeDisplay from "./components/RecipeDisplay/RecipeDisplay"
import { RecipeModel } from "./components/Models/Models"

function App() {
	// State for toggling the sidebar
	const [sidebarToggled, setSidebarToggled] = useState(false)
	const [activeContent, setActiveContent] = useState<"recipes" | "sousChef">(
		"sousChef"
	)
	// State for Recipe Display
	const [willTryAgain, setWillTryAgain] = useState(false)
	const [isLoading, setIsLoading] = useState(false)
	const [savedRecipe, setSavedRecipe] = useState<boolean>(false)
	//State for recipes
	const [generatedRecipe, setGeneratedRecipe] = useState<RecipeModel | null>(
		null
	)
	const [selectedRecipe, setSelectedRecipe] = useState<RecipeModel | null>(
		null
	)

	//State for display
	const [recipeToDisplay, setRecipeToDisplay] = useState<RecipeModel | null>(
		null
	)
	// State for selected recipe IDs
	const handleRecipeGenerated = (recipe: RecipeModel | null) => {
		setGeneratedRecipe(recipe)
		setIsLoading(false)
	}
	// State for selected Recipe to Display
	const handleRecipeToDisplay = (recipe: RecipeModel | null) => {
		setRecipeToDisplay(recipe)
		setIsLoading(false)
	}
	const [selectedRecipeIds, setSelectedRecipeIds] = useState<string[]>([])

	// Load selected recipes from local storage on component mount
	useEffect(() => {
		const storedSelectedRecipeIds =
			localStorage.getItem("selectedRecipeIds")
		if (storedSelectedRecipeIds) {
			setSelectedRecipeIds(JSON.parse(storedSelectedRecipeIds))
		}
	}, []) // Empty dependency array ensures this runs only once on mount

	// Save selected recipes to local storage whenever it changes
	useEffect(() => {
		localStorage.setItem(
			"selectedRecipeIds",
			JSON.stringify(selectedRecipeIds)
		)
	}, [selectedRecipeIds]) // This runs whenever selectedRecipeIds changes

	// Function to fix the navbar at the top when scrolling
	const navbarFixedTop = () => {
		const navbar = document.getElementById("App-navbar")
		if (navbar) {
			const sticky = navbar.offsetTop // No need to cast to number
			if (window.scrollY >= sticky) {
				navbar.classList.add("sticky")
			} else {
				navbar.classList.remove("sticky")
			}
		}
	}

	useEffect(() => {
		// Attach the scroll event listener when the component mounts
		window.addEventListener("scroll", navbarFixedTop)
		// Clean up the event listener when the component unmounts
		return () => window.removeEventListener("scroll", navbarFixedTop)
	}, []) // Empty dependency array ensures this runs only once on mount

	return (
		<Fragment>
			<div className="AppNavBar">
				<nav className="nav-items" id="App-navbar">
					<Navbar
						sidebarToggled={sidebarToggled}
						setSidebarToggled={setSidebarToggled}
						activeContent={activeContent}
						setActiveContent={setActiveContent}
					/>
				</nav>
			</div>

			<div className="App_with_sidebar">
				<div className="sidebar-items" id="App-sidebar">
					{" "}
					<Sidebar />
				</div>
				<div className="App" id="App-main">
					<RecipeDisplay
						savedRecipe={savedRecipe}
						setSavedRecipe={setSavedRecipe}
						willTryAgain={willTryAgain}
						setWillTryAgain={setWillTryAgain}
						isLoading={isLoading}
						setIsLoading={setIsLoading}
						activeContent={activeContent}
						setActiveContent={setActiveContent}
						selectedRecipeIds={selectedRecipeIds}
						setSelectedRecipeIds={setSelectedRecipeIds}
						generatedRecipe={generatedRecipe}
						setGeneratedRecipe={setGeneratedRecipe}
						selectedRecipe={selectedRecipe}
						setSelectedRecipe={setSelectedRecipe}
						recipeToDisplay={recipeToDisplay}
						setRecipeToDisplay={setRecipeToDisplay}
					/>
					{activeContent === "recipes" && (
						<RecipesIndex
							selectedRecipe={selectedRecipe}
							setSelectedRecipe={setSelectedRecipe}
							selectedRecipeIds={selectedRecipeIds}
							setSelectedRecipeIds={setSelectedRecipeIds}
							isLoading={isLoading}
							setIsLoading={setIsLoading}
						/>
					)}
					{activeContent === "sousChef" && (
						<SousChef
							willTryAgain={willTryAgain}
							setWillTryAgain={setWillTryAgain}
							generatedRecipe={generatedRecipe}
							setGeneratedRecipe={setGeneratedRecipe}
							onRecipeGenerated={handleRecipeGenerated}
							isLoading={isLoading}
							setIsLoading={setIsLoading}
						/>
					)}
					{/* Toggle ShoppingListPanel visibility within RecipeDisplay */}
				</div>
			</div>
		</Fragment>
	)
}

export default App
