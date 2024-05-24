import React, { useState, useRef, useEffect } from "react"
import Tesseract from "tesseract.js"
import PreprocessImage from "./Preprocess"
import "../OCR/OCR.css"

const OCR = () => {
	const [images, setImages] = useState<string[]>([])
	const [extractedText, setExtractedText] = useState("")
	const [error, setError] = useState("")
	const [isLoading, setIsLoading] = useState(false)
	const [isLoadingGemini, setIsLoadingGemini] = useState(false)
	const canvasRefs = useRef<(HTMLCanvasElement | null)[]>([])
	const imageRefs = useRef<(HTMLImageElement | null)[]>([])
	const [recipeToConvert, setRecipeToConvert] = useState("")
	const [value, setValue] = useState("")
	const [passedValue, setPassedValue] = useState("")
	const [chatHistory, setChatHistory] = useState<
		Array<{ role: string; parts: string[] }>
	>([])

	let preprompt: string =
		"You are a very skilled sous-chef and cooking teacher." +
		"You will rewrite the recipe text to json" +
		"NO FALSE STATEMENTS." +
		"The cuisines must match" +
		"You will write recipes as json files." +
		"Use this recipe format for the json:" +
		"name: string" +
		"unique id: string" +
		"id: string" +
		"cuisine: string" +
		"meal type: string" +
		"dietary restrictions and designations: string[]" +
		"serving info: {" +
		"prep time: string" +
		"cook time: string" +
		"total time: string" +
		"number of people served: number}" +
		"ingredients: {" +
		"dish: [" +
		"id: string" +
		"name: string" +
		"amount: string" +
		"unit: string | null" +
		"][]" +
		"}" +
		"instructions: { number: number; text: string }[]" +
		"notes: string[]" +
		"nutrition: {" +
		"serving: string" +
		"calories: string" +
		"carbohydrates: string" +
		"protein: string" +
		"fat: string" +
		"saturated fat: string" +
		"fiber: string" +
		"sugar: string" +
		"}" +
		"You will help adjust and suggest the json details based on other available recipe formats." +
		"You will format the json for ease of viewing." +
		"Format the recipe as a json with these twelve main sections: name, unique id, id, cuisine, meal type, dietary restrictions and designations, serving info, ingredients, instructions, notes, nutrition, and grocery list." +
		"For the name section, use the recipe name. If there is no recipe name suggest one." +
		"For the unique id section, use date.now() as string" +
		"For the id section, use the recipe name with dashes instead of spaces." +
		`For the cuisine section, make a strong` +
		"or if empty between the last colon and the period use the culture assosicated e.g. Dominican, Latin, Haitian, Chinese, Indian etc." +
		"For the meal type, use breakfast, lunch, brunch, dinner, or dessert." +
		"For the dietary restrictions and designations, apply any designations that are true...simply find and use all TRUE and applicable designations like gluten-free, vegan, mayonnaise-free, mustard-free, etc." +
		"For the serving info section, make 4 subsections: the prep time, cook time, total time (which is the prep time plus cook time), and number of people served." +
		"For the ingredient section, make 4 subsections: dish, and 3 variable sections that can be named but have an id (1,2, or 3)." +
		"This variable section will allow for marinades, sauces, creams or toppings as needed." +
		"For the instruction section, each step will have a number value and text values holding instruction text." +
		"For the notes section, it will hold one subsection able to hold a paragraph of text to help guide the recipe." +
		"For the nutrition section, make eight sections: Serving will be set to 1 serving but can be changed to recalculate the other amounts, Calories, Carbohydrates, Protein, Fat, Saturated Fat, Fiber, and Sugar all except serving have units in grams." +
		"Convert the text to these sections as closely related as possible."

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const files = event.target.files
		if (files) {
			const urls = Array.from(files).map((file) =>
				URL.createObjectURL(file)
			)
			setImages(urls)
		} else {
			setImages([])
		}
	}

	useEffect(() => {
		canvasRefs.current = Array.from({ length: images.length })
		imageRefs.current = Array.from({ length: images.length })
	}, [images])

	const handleClick = async () => {
		if (images.length > 0) {
			setIsLoading(true)
			const promises: Promise<string>[] = []

			images.forEach((image, index) => {
				const promise = new Promise<string>((resolve, reject) => {
					const canvas = document.createElement("canvas")
					const ctx = canvas.getContext("2d")

					canvasRefs.current[index] = canvas

					if (ctx) {
						const imageObj = new Image()
						imageObj.onload = () => {
							canvas.width = imageObj.width
							canvas.height = imageObj.height
							ctx.drawImage(imageObj, 0, 0)

							const processedImageData = PreprocessImage(canvas)
							ctx.putImageData(processedImageData, 0, 0)

							const dataUrl = canvas.toDataURL("image/jpeg")

							Tesseract.recognize(dataUrl, "eng", {
								logger: (m) => console.log(m),
							})
								.then((result) => {
									if (result && result.data) {
										const text = result.data.text
										console.log(
											`Extracted text for image ${
												index + 1
											}:`,
											text
										)
										resolve(text)
									} else {
										console.error(
											"Unexpected Tesseract result format"
										)
										resolve("")
									}
								})
								.catch((err) => {
									console.error(err)
									resolve("")
								})
						}
						imageObj.src = image
					} else {
						reject("Canvas context is not available")
					}
				})

				promises.push(promise)
			})

			try {
				const extractedTexts = await Promise.all(promises)
				const allExtractedText = extractedTexts.join("\n")
				setExtractedText(allExtractedText)
				console.log("All Extracted Text:", allExtractedText)
			} catch (err) {
				console.error(err)
			} finally {
				setIsLoading(false)
			}
		}
	}

	const handleGemini = async () => {
		console.log("Tell Gemini to convert to json")
		setIsLoadingGemini(true)
		setRecipeToConvert(extractedText)
		if (!recipeToConvert) {
			setError("Let's try that again. Please ask a question.")
			return
		}
		if (recipeToConvert) {
			setPassedValue(recipeToConvert)
		}
		try {
			const options = {
				method: "POST",
				body: JSON.stringify({
					history: chatHistory,
					message: preprompt + passedValue,
				}),
				headers: {
					"Content-Type": "application/json",
				},
			}
			const response = await fetch(
				"http://localhost:8000/gemini",
				options
			)
			const data = await response.text()
			console.log(data)
			setChatHistory((oldChatHistory) => [
				...oldChatHistory,
				{
					role: "user",
					parts: [value],
				},
				{
					role: "model",
					parts: [data],
				},
			])
			setValue("")
		} catch (error) {
			console.error(error)
			setError("Something went wrong! Please try again later.")
		}
	}

	return (
		<div className="OCR-container">
			<h1>myImport</h1>
			<div className="img-text">
				<h3>Extracted Recipe Text</h3>
				<div className="rendered_text">
					<p className="wrapthistext">{extractedText}</p>
				</div>
			</div>
			<div className="img-container">
				<h3>{"Recipe Image(s) Uploaded"}</h3>
				{images.map((image, index) => (
					<div
						className="img-upload"
						key={index}
						id={`img-upload-${index}`}
					>
						<img
							className="OCR-image"
							width={600}
							height={800}
							src={image}
							alt="uploaded"
							ref={(el) => (imageRefs.current[index] = el)}
						/>
					</div>
				))}
			</div>
			<div>
				<input type="file" onChange={handleChange} multiple />
				<button onClick={handleClick} style={{ height: 50 }}>
					{isLoading ? "Processing..." : "Convert to text"}
				</button>
				<button onClick={handleGemini} style={{ height: 50 }}>
					{isLoadingGemini ? "Processing..." : "Convert to json"}
				</button>
			</div>
			<div className="search-result">
				{chatHistory.map((chatItem, _index) => (
					<div key={_index}>
						<p className="answer">
							{chatItem.role}: {chatItem.parts}
						</p>
					</div>
				))}
			</div>
		</div>
	)
}

export default OCR
