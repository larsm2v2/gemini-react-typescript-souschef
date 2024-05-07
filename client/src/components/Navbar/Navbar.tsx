import React from 'react'
import "./Navbar.css";



const Navbar = () => {
  return (
    <nav className={"nav"}>
        <ul>
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