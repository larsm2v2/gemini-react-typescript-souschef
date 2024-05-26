import React, { useState, useRef } from "react"
import "./InputField.css"
import { ListItem } from "../../Models/Models"

interface Props {
	listItem: {
		id: number
		quantity: number
		unit: string
		listItem: string
		isDone: Boolean
		toTransfer: Boolean
	}
	setListItem: React.Dispatch<React.SetStateAction<ListItem>>
	handleAdd: (e: React.FormEvent) => void
}
const InputField: React.FC<Props> = ({
	listItem,
	setListItem,
	handleAdd,
}: Props) => {
	const inputRef = useRef<HTMLInputElement>(null)

	return (
		<form
			className="input"
			onSubmit={(e) => {
				handleAdd(e)
				inputRef.current?.blur()
			}}
		>
			<input
				ref={inputRef}
				type="input"
				defaultValue="0"
				onChange={(e) => e.target.value}
				placeholder="How many of this grocery item..."
				className="input__box"
			/>
			<input
				ref={inputRef}
				type="input"
				defaultValue=""
				onChange={(e) => e.target.value}
				placeholder="What size for this item..."
				className="input__box"
			/>
			<input
				ref={inputRef}
				type="input"
				defaultValue="apples"
				onChange={(e) => e.target.value}
				placeholder="Add a name for this grocery item..."
				className="input__box"
			/>
			<button className="input__submit" type="submit">
				Go
			</button>
		</form>
	)
}

export default InputField
