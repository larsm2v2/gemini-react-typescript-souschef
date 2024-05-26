import React from "react"
import "../InputField/InputField.css"
import { ListItem } from "../../Models/Models"
import SingleListItem from "../SingleListItem/SingleListItem"

interface Props {
	listItems: ListItem[]
	setListItems: React.Dispatch<React.SetStateAction<ListItem[]>>
}
const EditableList: React.FC<Props> = ({ listItems, setListItems }: Props) => {
	return (
		<div className="todos">
			{listItems.map((listItem) => (
				<SingleListItem
					listItem={listItem}
					key={listItem.id}
					listItems={listItems}
					setListItems={setListItems}
				/>
			))}
		</div>
	)
}

export default EditableList
