export interface RecipeModel {
	name: string
	"unique id": number
	id: string
	cuisine: string
	"meal type": string
	"dietary restrictions and designations": string[] // Changed to string[]
	"serving info": {
		"prep time"?: string | null
		"cook time"?: string | null
		"total time"?: string | null
		"number of people served"?: number | string // Changed to number | string
	}
	ingredients: {
		[subcategory: string]: {
			id: number
			name: string
			quantity: number
			unit?: string
		}[]
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
	groceryList?: string[]
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
