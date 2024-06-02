import React, { useState, useRef, useEffect } from "react"
import Tesseract from "tesseract.js"
import PreprocessImage from "./Preprocess"
import "../OCR/OCR.css"
import { preprompt } from "../Models/Prompts"
import TemporaryRecipeDisplay from "../RecipeDisplay/RecipeDisplay"
import { RecipeModel } from "../Models/Models"
const OCR = () => {
	const [images, setImages] = useState<string[]>([])
	const [extractedText, setExtractedText] = useState("")
	const [error, setError] = useState("")
	const [generatedRecipe, setGeneratedRecipe] = useState<RecipeModel | null>(
		null
	)
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
	const [cuisine, setCuisine] = useState("")
	const [knownIngredients, setKnownIngredients] = useState("")
	const [avoidIngredients, setAvoidIngredients] = useState("")
	const [dietaryRestrictions, setDietaryRestrictions] = useState("")
	const [otherInfo, setOtherInfo] = useState("")
	const [ocrAddon, setOcrAddon] = useState("")

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
					message:
						preprompt(
							cuisine,
							dietaryRestrictions,
							knownIngredients,
							avoidIngredients,
							otherInfo,
							ocrAddon
						) + passedValue,
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
			const recipeRegex = /{.*}/s // capture the recipe as a json object

			// find the json object in the response. the regex looks for the characters between and including the curly braces. the s flag allows the dot to match newline characters
			const cleanedJsonMatch = data.match(recipeRegex)
			const cleanedJsonString = cleanedJsonMatch
				? cleanedJsonMatch[0]
				: "" // Use the match or an empty string if no match is found

			// Check if the string can be parsed
			let parsedRecipe: RecipeModel | null = null
			try {
				parsedRecipe = JSON.parse(cleanedJsonString)
				console.log("Parsed recipe:", parsedRecipe)
			} catch (e) {
				console.error("Error parsing JSON:", e)
				setError("Invalid recipe format received.")
				return // Exit the function if parsing fails
			}

			// Set the generated recipe in state to trigger the display
			setGeneratedRecipe(parsedRecipe)
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
				{/* TemporaryRecipeDisplay for showing generated recipe */}
				{generatedRecipe && (
					<TemporaryRecipeDisplay
						generatedRecipe={generatedRecipe}
						onTryAgain={handleGemini} // Pass the getResponse function to retry
					/>
				)}
			</div>
		</div>
	)
}

export default OCR
