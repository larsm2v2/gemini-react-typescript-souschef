import React, {Fragment, useState} from 'react';
import './App.css';
import "./components/Sidebar/Sidebar.css"
import Navbar from "./components/Navbar/Navbar";
import Sidebar from "./components/Sidebar/Sidebar";
import SousChef from "./components/SousChef/SousChef";
import ShoppingList from './components/ShoppingList/ShoppingList';
import Recipes from "./components/Recipes/Recipes";
import OCR from "./components/OCR/OCR";

function App() {
  const [sidebarToggled, setSidebarToggled] = useState(false)
  return (
    <Fragment>
      <div className={`${sidebarToggled ? 'sidebar' :'sidebar-hidden'}`}>
        <Sidebar/>
      </div>
      <nav className="nav-items">
        <Navbar sidebarToggled={sidebarToggled} setSidebarToggled={setSidebarToggled}/>
      </nav>
      <div className="App-souchef" id= "souschef" >
        <SousChef/>
      </div>
      <div className="App-shoppinglist" id="shoppinglist">
        <ShoppingList/>
      </div>
      <div className="App-recipes" id="recipes">
        <Recipes/>
      </div>
      <div className="App-ocr" id="ocr">
        <OCR/>
      </div>
    </Fragment>
  );
}

export default App;
