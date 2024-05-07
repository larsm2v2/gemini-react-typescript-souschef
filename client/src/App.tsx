import React from 'react';
import './App.css';
import Navbar from "./components/Navbar/Navbar";
import SousChef from "./components/SousChef/SousChef";
import OCR from "./components/OCR/OCR";
import Recipes from "./components/Recipes/Recipes";
import ShoppingList from './components/ShoppingList/ShoppingList';


/* const navbarRef = null;
const souschefRef = useRef(null);
const shoppinglistRef = useRef(null);
const recipesRef = useRef(null);
const ocrRef = useRef(null); */

function App() {

  return (
    <div>
      <nav className="nav">
        <Navbar/>
      </nav>
      <div id= "souschef" >
        <SousChef/>
      </div>
      <div id="shoppinglist">
        <ShoppingList/>
      </div>
      <div id="recipes">
        <Recipes/>
      </div>
      <div id="ocr">
        <OCR/>
      </div>
    </div>
  );
}

export default App;
