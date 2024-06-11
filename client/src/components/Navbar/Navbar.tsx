import React, { useEffect } from "react"
import { assets } from "../../assets/assets"
import "./Navbar.css"
import "../Sidebar/Sidebar.css"

interface Props {
	sidebarToggled: boolean
	setSidebarToggled: React.Dispatch<React.SetStateAction<boolean>>
	activeContent: "recipes" | "sousChef"
	setActiveContent: React.Dispatch<
		React.SetStateAction<"recipes" | "sousChef">
	>
}

const Navbar: React.FC<Props> = ({
	sidebarToggled,
	setSidebarToggled,
	activeContent,
	setActiveContent,
}: Props) => {
	const togglesidebar = () => {
		setSidebarToggled((prevState) => !prevState)
		console.log(sidebarToggled)
		navOpenClose(openNav, closeNav)
	}
	function openNav() {
		const sidebarWidth: string = "50vw"
		const sidebar = document.getElementById("App-sidebar")
		if (sidebar) {
			sidebar.style.width = sidebarWidth
			sidebar.classList.add("open")
		}
	}

	function closeNav() {
		const sidebar = document.getElementById("App-sidebar")
		if (sidebar) {
			sidebar.classList.remove("open")
		}
	}
	function navOpenClose(openNav: Function, closeNav: Function) {
		if (sidebarToggled) {
			openNav()
		} else {
			closeNav()
		}
	}
	return (
		<nav className={"nav"}>
			<ul>
				<img
					className="sidebar-toggle"
					src={assets.menu_icon}
					alt="Menu"
				/>
				<li
					onClick={(event: React.MouseEvent<HTMLLIElement>) => {
						setActiveContent("recipes")
					}}
				>
					myRecipes
				</li>
				<li
					onClick={(event: React.MouseEvent<HTMLLIElement>) => {
						setActiveContent("sousChef")
					}}
				>
					mySousChef
				</li>
				<li onClick={togglesidebar}>myShoppingList</li>
			</ul>
		</nav>
	)
}

export default Navbar
