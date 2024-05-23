export interface RecipeModel {
	name: string
	"unique id": string
	id: string
	cuisine: string
	"meal type": string
	"dietary restrictions and designations": string[] // Changed to string[]
	"serving info": {
		"prep time": string
		"cook time": string
		"total time": string
		"number of people served": number
	}
	ingredients: {
		dish: {
			id: string
			name: string
			amount: string
			unit: string | null
		}[] // Allows null for unit
	}
	instructions: { number: number; text: string }[]
	notes: string[] // Added type for elements of the notes array.
	nutrition: {
		serving: string
		calories: string
		carbohydrates: string
		protein: string
		fat: string
		"saturated fat": string
		fiber: string
		sugar: string
	}
}

export interface ListItem {
	id: number
	quantity: number
	unit: string
	listItem: string
	isDone: Boolean
	toTransfer: Boolean
}

export type id = string | never
