import React, { useState, useRef, useEffect } from "react"
import Tesseract from "tesseract.js"
import PreprocessImage from "./Preprocess"
import "../OCR/OCR.css"

const OCR = () => {
	const [images, setImages] = useState<string[]>([])
	const [text, setText] = useState("")
	const imageRefs = useRef<(HTMLImageElement | undefined)[]>([])
	const processedImageDataRef = useRef<(ImageData | null)[]>([])
	const extractedTextRef = useRef<string[]>([])

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const files = event.target.files
		if (files) {
			const urls = Array.from(files).map((file) =>
				URL.createObjectURL(file)
			)
			setImages(urls)
		} else {
			setImages([]) // or any other fallback value you prefer
		}
	}

	useEffect(() => {
		// Update the 'text' state whenever extractedTextRef changes
		setText(extractedTextRef.current.join("\n")) // Combine extracted text with newlines
	}, [extractedTextRef.current])

	const handleClick = () => {
		extractedTextRef.current = Array(images.length).fill("") // Initialize with empty strings
		if (images.length > 0) {
			images.forEach((image, index) => {
				const canvas = document.createElement("canvas")
				const ctx = canvas.getContext("2d")

				if (ctx) {
					const imageObj = new Image()
					imageObj.onload = () => {
						canvas.width = imageObj.width
						canvas.height = imageObj.height
						ctx.drawImage(imageObj, 0, 0)

						const processedImageData = PreprocessImage(canvas)

						if (processedImageData) {
							const dataUrl = canvas.toDataURL("image/jpeg")

							Tesseract.recognize(dataUrl, "eng", {
								logger: (m) => console.log(m),
							})
								.then((result) => {
									if (result && result.data) {
										// Update the extracted text for the specific image
										extractedTextRef.current[index] =
											result.data.text
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
					imageObj.src = image
				}
			})
		}
	}

	return (
		<div className="OCR-container">
			<h1>myImport</h1>
			<div className="img-container">
				{images.map((image, index) => (
					<div
						className="img-upload"
						key={index}
						id={`img-upload-${index}`}
					>
						<h3>Actual Image Uploaded</h3>
						<img
							className="OCR-image"
							width={600}
							height={800}
							src={image}
							alt="logo"
							ref={(el) => {
								if (el && index !== undefined) {
									// Type assertion is needed because TypeScript isn't
									// sure if 'el' is definitely an HTMLCanvasElement
									imageRefs.current[index] =
										el as HTMLImageElement
								}
							}}
						/>
						<div className="img-text">
							<h3>Extracted text</h3>
							<div className="rendered_text">
								{extractedTextRef.current[index]}
							</div>
						</div>
					</div>
				))}
			</div>
			<div>
				<input type="file" onChange={handleChange} multiple />
				<button onClick={handleClick} style={{ height: 50 }}>
					Convert to text
				</button>
			</div>
		</div>
	)
}

export default OCR
