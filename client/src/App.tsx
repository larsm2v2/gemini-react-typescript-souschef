import React, {Fragment} from 'react';
import './App.css';
import Navbar from "./components/Navbar/Navbar";
import SousChef from "./components/SousChef/SousChef";
import OCR from "./components/OCR/OCR";
import Recipes from "./components/Recipes/Recipes";
import ShoppingList from './components/ShoppingList/ShoppingList';
import Sidebar from "./components/Sidebar/Sidebar";

/* const navbarRef = null;
const souschefRef = useRef(null);
const shoppinglistRef = useRef(null);
const recipesRef = useRef(null);
const ocrRef = useRef(null); */

function App() {

  return (
    <Fragment>
      <div>
        <Sidebar/>
      </div>
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
    </Fragment>
  );
}

export default App;
