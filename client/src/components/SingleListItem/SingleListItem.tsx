import React from 'react'
import {ListItem} from "../Models/Models"
import {MdEdit, MdDeleteForever, MdDone } from "react-icons/md";
import "../InputField/InputField.css"
import EditableList from '../EditableList/EditableList';

type Props = {
    listItem:ListItem,
    listItems:ListItem[],
    setListItems:React.Dispatch<React.SetStateAction<ListItem[]>>;
}
const SingleListItem = ({listItem,listItems, setListItems}:Props) => {
    const handleDone = (id: number) => {
        setListItems(listItems.map((listItem)=>
            listItem.id===id?
        {...listItem,isDone:!listItem.isDone}:listItem))
    }

  return (
    <form className="listItems__single">
        {
            listItem.isDone ? (
                <s className="listItems__single--text">
                {listItem.listItem}
                </s>
            ):(
                <span className="listItems__single--text">
                {listItem.listItem}
                </span>
            )
        }
        <div>
            <span className="icon">
                <MdEdit/>
            </span>
            <span className="icon">
                <MdDeleteForever/>
            </span>
            <span className="icon" onClick={()=> handleDone(listItem.id)}>
                <MdDone/>
            </span>
        </div>
    </form>
  )
}

export default SingleListItem