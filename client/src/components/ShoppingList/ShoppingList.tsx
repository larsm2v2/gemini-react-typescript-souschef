import React, {useState} from 'react';
import './ShoppingList.css';
import EditableList from "../EditableList/EditableList";
import InputField from "../InputField/InputField";
import ShoppingListRecords from "./ShoppingList.json";
import {ListItem, RecipeModel} from "../Models/Models"

const ShoppingList: React.FC = () => {
  const [listItem,setListItem] = useState<ListItem>({
      id: Date.now(),
      quantity: 0,
      unit: "",
      listItem: "",
      isDone: false,
      toTransfer: false,
  });
  const [listItems,setListItems] = useState<ListItem[]>([]);

  const handleAdd=(e:React.FormEvent)=> {
    e.preventDefault();

    if(listItem) {
      setListItems((listItems) => [...listItems,{ ...listItem}]);
      setListItem({
      id: Date.now(),
      quantity: 0,
      unit: "",
      listItem: "",
      isDone: false,
      toTransfer: false,});
    }
  };
  console.log(listItem)
  console.log(listItems)
/*  fetch('./shopping-list.json')
  .then(response => response.json())
  .then(data => {
    // Your shopping list data is now available in the 'data' variable
  })
  .catch(error => {
    // Handle any errors that occur while reading the file
  });
//New Item
  const newItem = {
    name: 'Apples',
    quantity: 2,
  };
  
  data.push(newItem);
//Modify Entry
  const itemIndex = data.findIndex(item => item.id === Date.now);

  if (itemIndex !== -1) {
    data[itemIndex].name = 'Bananas';
    data[itemIndex].quantity = 5;
  }
//Delete Entry
  const itemIndex = data.findIndex(item => item.id === 123);

if (itemIndex !== -1) {
  data.splice(itemIndex, 1);
}

//Save To File 
fetch('shopping-list.json', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(data),
})
  .then(response => {
    // Handle successful save
  })
  .catch(error => {
    // Handle any errors that occur while saving
  }); */


  return (
    <div className="shoppinglist-container">
      <h1>
        myShoppingList
      </h1>
      <div className='flex-container'>
        <div className='edit-box'>
          <h2>Editable List</h2>
          <div className="edit-list">
          <InputField listItem={listItem} setListItem={setListItem} handleAdd={handleAdd}/>
          <EditableList listItems={listItems} setListItems={setListItems}/>
            {
            ShoppingListRecords && ShoppingListRecords.map(record => {
              return(
              <div className="box" key={record.id}>
                {record.quantity}
                {record.item}
                
              </div>
              )
              })
            }
          </div>
        </div>
        <div className='transfer-box'>
          <h2>Transferable List</h2>
          <div className="transfer-list">
            List2
          </div>
        </div>
      </div>

    </div>
  )
}

export default ShoppingList
