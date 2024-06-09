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

function App() {
	const [sidebarToggled, setSidebarToggled] = useState(false)
	const [activeContent, setActiveContent] = useState<"recipes" | "sousChef">(
		"recipes"
	)
	const [isLoading, setIsLoading] = useState(true)
	const [generatedRecipe, setGeneratedRecipe] = useState<RecipeModel | null>(
		null
	)
	// State for selected recipe IDs
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
			<div>
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
					{/* Corrected class name */}
					<Sidebar />
				</div>
				<div className="App" id="App-main">
					<RecipeDisplay
						generatedRecipe={generatedRecipe}
						onTryAgain={onTryAgain}
						isLoading={isLoading}
					>
						{activeContent === "recipes" && (
							<RecipesIndex
								selectedRecipeIds={selectedRecipeIds}
								setSelectedRecipeIds={setSelectedRecipeIds}
							/>
						)}
						{activeContent === "sousChef" && <SousChef />}
						{/* Toggle ShoppingListPanel visibility within RecipeDisplay */}
					</RecipeDisplay>
				</div>
			</div>
		</Fragment>
	)
}

export default App
