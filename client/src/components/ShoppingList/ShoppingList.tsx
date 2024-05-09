import React from 'react'
import './ShoppingList.css'

const ShoppingList = () => {
  return (
    <div className="shoppinglist-container">
      <h1>
        myShoppingList
      </h1>
      <div className='flex-container'>
        <div className='leftside'>
          <h2>Editable List</h2>
{/*           <div>
            List1
          </div> */}
        </div>
        <div className='rightside'>
          <h2>Transferable List</h2>
{/*           <div>
            List2
          </div> */}
        </div>
      </div>

    </div>
  )
}

export default ShoppingList
