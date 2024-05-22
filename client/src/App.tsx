import React, { Fragment, useState } from "react"
import "./App.css"
import "./components/Sidebar/Sidebar.css"
import Navbar from "./components/Navbar/Navbar"
import Sidebar from "./components/Sidebar/Sidebar"
import SousChef from "./components/SousChef/SousChef"
import ShoppingList from "./components/ShoppingList/ShoppingList"
import Recipes from "./components/Recipes/Recipes"
import OCR from "./components/OCR/OCR"

function App() {
	const [sidebarToggled, setSidebarToggled] = useState(false)
	// When the user scrolls the page, execute myFunction
	window.onscroll = function () {
		navbarFixedTop()
	}

	function navbarFixedTop() {
		const navbar = document.getElementById("App-navbar")

		if (navbar) {
			// Check if navbar is not null
			const sticky = navbar.offsetTop as number // Cast offsetTop to number

			if (window.scrollY >= sticky) {
				navbar.classList.add("sticky")
			} else {
				navbar.classList.remove("sticky")
			}
		}
	}
	return (
		<Fragment>
			<div>
				<nav className="nav-items" id="App-navbar">
					<Navbar
						sidebarToggled={sidebarToggled}
						setSidebarToggled={setSidebarToggled}
					/>
				</nav>
			</div>
			<div className="App_with_sidebar">
				<div className-="sidebar-items" id="App-sidebar">
					<Sidebar />
				</div>
				<div className="App" id="App-main">
					<div className="App-souchef" id="souschef">
						<SousChef />
					</div>
					<div className="App-shoppinglist" id="shoppinglist">
						<ShoppingList />
					</div>
					<div className="App-recipes" id="recipes">
						<Recipes />
					</div>
					<div className="App-ocr" id="ocr">
						<OCR />
					</div>
				</div>
			</div>
		</Fragment>
	)
}

export default App
