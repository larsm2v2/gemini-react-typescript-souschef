export interface RecipeModel {
	name: string
	"unique id": number
	id: string | never
	cuisine: string
	"meal type": string
	"dietary restrictions and designations": []
	"serving info": {
		"prep time (minutes)": number
		"cook time (minutes)": number
		"total time (minutes)": number
		"number of people served": number
	}
	ingredients: {
		dish: [{ id: number; name: string; amount: number; unit: string }]
	}
	instructions: [{ number: number; text: string }]
	notes: []
	nutrition: {
		serving: number
		calories: number
		"carbohydrates (g)": number
		"protein (g)": number
		"fat (g)": number
		"saturated fat (g)": number
		"fiber (g)": number
		"sugar (g)": number
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
