import React, { useState, useRef, useEffect } from "react"
import Tesseract from "tesseract.js"
import PreprocessImage from "./Preprocess"
import "../OCR/OCR.css"

const OCR = () => {
	const [images, setImages] = useState<string[]>([])
	const [text, setText] = useState("")
	const canvasRefs = useRef<(HTMLCanvasElement | undefined)[]>([])
	const imageRefs = useRef<(HTMLImageElement | undefined)[]>([])
	const [showCanvases, setShowCanvases] = useState(false)

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
		// Initialize canvasRefs with an array of the correct length
		canvasRefs.current = Array.from({ length: images.length })
		imageRefs.current = Array.from({ length: images.length })
	}, [images]) // Re-run effect when images change

	const handleClick = () => {
		const canvases = canvasRefs.current
		const imgs = imageRefs.current

		if (canvases && imgs && images.length) {
			images.forEach((img, index) => {
				const canvas = canvases[index]
				const ctx = canvas?.getContext("2d")

				if (ctx && img && canvas) {
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
										setText(
											(prevText) =>
												prevText + result.data.text
										)
										console.log(
											`Confidence: ${result.data.confidence}`
										)
										console.log(result.data.text)

										// After Tesseract finishes, draw the preprocessed image
										ctx.putImageData(
											processedImageData,
											0,
											0
										)
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
					imageObj.src = img
				}
			})
			setShowCanvases(true) // Show the canvases after processing
		}
	}

	return (
		<div className="OCR-container">
			<h1>myImport</h1>
			<div className="img-container">
				{images.map((image, index) => (
					<div className="img-upload" key={index}>
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
						{showCanvases && (
							<div className="img-canvas">
								<h3>Canvas</h3>
								<canvas
									className="OCR-image"
									ref={(el) => {
										if (el && index !== undefined) {
											// Type assertion is needed because TypeScript isn't
											// sure if 'el' is definitely an HTMLCanvasElement
											canvasRefs.current[index] =
												el as HTMLCanvasElement
										}
									}}
									width={400}
									height={800}
								/>
							</div>
						)}
						<div className="img-text">
							<h3>Extracted text</h3>
							<div className="rendered_text">
								{text.split("\n").map((line, lineIndex) => (
									<p className="wrapthistext" key={lineIndex}>
										{line}
									</p>
								))}
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
