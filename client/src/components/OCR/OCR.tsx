import React, { useState, useRef, useEffect } from "react"
import Tesseract from "tesseract.js"
import PreprocessImage from "./Preprocess"
import "../OCR/OCR.css"

const OCR = () => {
	const [images, setImages] = useState<string[]>([])
	const [extractedText, setExtractedText] = useState("")
	const [isLoading, setIsLoading] = useState(false)
	const canvasRefs = useRef<(HTMLCanvasElement | null)[]>([])
	const imageRefs = useRef<(HTMLImageElement | null)[]>([])

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
			</div>
			<div className="img-text">
				<h3>Extracted text</h3>
				<div className="rendered_text">
					<p className="wrapthistext">{extractedText}</p>
				</div>
			</div>
		</div>
	)
}

export default OCR
