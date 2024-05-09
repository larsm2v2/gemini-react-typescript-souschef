import React from 'react'
import {assets} from "../../assets/assets"
import "./Navbar.css";
import "../Sidebar/Sidebar.css"

interface Props{
  sidebarToggled: boolean;
  setSidebarToggled:React.Dispatch<React.SetStateAction<boolean>>;
}

const Navbar: React.FC<Props> = ({sidebarToggled, setSidebarToggled}:Props) => {
  const togglesidebar = () => {
    setSidebarToggled((prevState) => !prevState);
    console.log(sidebarToggled);
  };
  
  return (
    <nav className={"nav"}>
        
        <ul>
            <img className="sidebar-toggle" src={assets.menu_icon} alt="Menu" onClick={togglesidebar}/>
            <li onClick={(event: React.MouseEvent<HTMLLIElement>) => {
            document.getElementById("souschef")?.scrollIntoView();
          }}>mySousChef</li>
            <li onClick={(event: React.MouseEvent<HTMLLIElement>) => {
            document.getElementById("recipes")?.scrollIntoView();
          }}>myRecipes</li>
            <li onClick={(event: React.MouseEvent<HTMLLIElement>) => {
            document.getElementById("shoppinglist")?.scrollIntoView();
          }}>myShoppingList</li>
            <li onClick={(event: React.MouseEvent<HTMLLIElement>) => {
            document.getElementById("ocr")?.scrollIntoView();
          }}>myImport</li>
        </ul>
    </nav>

  )
}

export default Navbar