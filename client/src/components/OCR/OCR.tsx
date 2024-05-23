import React, { useState, useRef, useEffect } from "react"
import Tesseract from "tesseract.js"
import PreprocessImage from "./Preprocess"
import "../OCR/OCR.css"

const OCR = () => {
	const [image, setImage] = useState("")
	const [text, setText] = useState("")
	const canvasRef = useRef<HTMLCanvasElement | null>(null)
	const imageRef = useRef<HTMLImageElement | null>(null)

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0]
		if (file) {
			setImage(URL.createObjectURL(file))
		} else {
			setImage("") // or any other fallback value you prefer
		}
	}

	/* 	const handleClick = () => {
		const canvas = canvasRef.current
		if (!canvas) {
			console.error("Canvas is not defined")
			return
		}
		const ctx = canvas.getContext("2d")
		if (!ctx) {
			console.error("Cannot get 2D rendering context")
			return
		}
		const image = imageRef.current
		if (!image) {
			console.error("Image is not defined")
			return
		}
		ctx.drawImage(image, 0, 0)
		const processedImage = PreprocessImage(canvas)
		if (!processedImage) {
			console.error("Processed image is not defined")
			return
		}
		ctx.putImageData(PreprocessImage(canvas), 0, 0)
		const dataUrl = canvas.toDataURL("image/jpeg")

		Tesseract.recognize(dataUrl, "eng", {
			logger: (m) => {
				console.log(m)
				console.log("I am logging m")
			},
		})
			.catch((err) => {
				console.error(err)
			})
			.then((result) => {
				console.log(
					`I am getting ready to process the text result: ${result}`
				)
				if (
					result &&
					"confidence" in result &&
					typeof result.confidence === "number"
				) {
					// Get Confidence score
					let confidence: number = result.confidence
					console.log(`Confidence: " ${confidence}`)
				}
				// Get full output
				if (
					result &&
					"text" in result &&
					typeof result.text === "string"
				) {
					let text: string = result.text

					setText(text)
					console.log(text)
				}
			})
	} */

	const handleClick = () => {
		const canvas = canvasRef.current
		const img = imageRef.current

		if (canvas && img && image) {
			const ctx = canvas.getContext("2d")

			if (ctx) {
				// Load the image onto the canvas first
				const imageObj = new Image()
				imageObj.onload = () => {
					canvas.width = imageObj.width
					canvas.height = imageObj.height
					ctx.drawImage(imageObj, 0, 0)

					const processedImageData = PreprocessImage(canvas)

					if (processedImageData) {
						ctx.putImageData(processedImageData, 0, 0) // Put the processed image back onto the canvas
						const dataUrl = canvas.toDataURL("image/jpeg")

						// Now you can start the Tesseract recognition process
						Tesseract.recognize(dataUrl, "eng", {
							logger: (m) => console.log(m),
						})
							.then((result) => {
								if (result && result.data) {
									setText(result.data.text)
									console.log(
										`Confidence: ${result.data.confidence}`
									)
									console.log(result.data.text)
								} else {
									console.error(
										"Unexpected Tesseract result format"
									)
								}
							})
							.catch((err) => {
								console.error(err)
							})
					} else {
						console.error("Image preprocessing failed")
					}
				}
				imageObj.src = image // Set the image source for the Image object
			}
		}
	}

	return (
		<div className="OCR-container">
			<h1>myImport</h1>
			<div className="img-container">
				<div className="img-upload">
					<h3>Actual Image Uploaded</h3>
					<img
						className="OCR-image"
						width={600}
						height={800}
						src={image}
						alt="logo"
						ref={imageRef}
					/>
				</div>
				<div className="img-canvas">
					<h3>Canvas</h3>
					<canvas
						className="OCR-image"
						ref={canvasRef}
						width={400}
						height={800}
					></canvas>
				</div>
				<div className="img-text">
					<h3>Extracted text</h3>
					<div className="rendered_text">
						<p className="wrapthistext">{text}</p>
					</div>
				</div>
			</div>
			<div>
				<input type="file" onChange={handleChange} />
				<button onClick={handleClick} style={{ height: 50 }}>
					Convert to text
				</button>
			</div>
		</div>
	)
}

export default OCR
