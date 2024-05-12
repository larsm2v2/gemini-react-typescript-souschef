import React, {useEffect}from 'react'
import {assets} from "../../assets/assets"
import "./Navbar.css";
/* import "../Sidebar/Sidebar.css" */

interface Props{
  sidebarToggled: boolean;
  setSidebarToggled:React.Dispatch<React.SetStateAction<boolean>>;
}

const Navbar: React.FC<Props> = ({sidebarToggled, setSidebarToggled}:Props) => {
  const togglesidebar = () => {
    setSidebarToggled((prevState) => !prevState);
    console.log(sidebarToggled);
    navOpenClose(openNav, closeNav)
  };
  function openNav() {
    const sidebarWidth:string ="15%";
    const sidebar = document.getElementById("App-sidebar");
    const main = document.getElementById("App-main");
    if (sidebar)  sidebar.style.width = sidebarWidth;
    if (sidebar) sidebar.style.display = "flex";
    if (main) main.style.width = "85%";
  }
  
  function closeNav() {
    const closeWidth:string = "0";
    const sidebar = document.getElementById("App-sidebar");
    const main = document.getElementById("App-main");
    if (sidebar) sidebar.style.width = closeWidth;
    if (sidebar) sidebar.style.padding = "0 0 0 0";
    if (sidebar) sidebar.style.display = "none";
    if (main) main.style.width = "100%";
  }
  function navOpenClose(openNav: Function, closeNav: Function) {
    if(sidebarToggled) {
      openNav()
    } else{
      closeNav()};
   }
  return (
    <nav className={"nav"}>
        
        <ul>
            <img className="sidebar-toggle" src={assets.menu_icon} alt="Menu" onClick={togglesidebar} />
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