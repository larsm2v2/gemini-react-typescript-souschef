import React from "react"
import "./Sidebar.css"
import { assets } from "../../assets/assets"
import ShoppingList from "../ShoppingList/ShoppingList"

interface SidebarProps {
	selectedRecipeIds: string[]
	setSelectedRecipeIds: (ids: string[]) => void
}

const Sidebar: React.FC<SidebarProps> = ({
	selectedRecipeIds,
	setSelectedRecipeIds,
}) => {
	return (
		<div className="sidebar-content">
			<ShoppingList
				selectedRecipeIds={selectedRecipeIds}
				setSelectedRecipeIds={setSelectedRecipeIds}
			/>
		</div>
	)
}

export default Sidebar
