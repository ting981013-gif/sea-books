import { Jimp } from 'jimp'

async function prepareIcon() {
  const srcPath = './icon.png'
  const dstPath = './icon-processed.png'

  const img = await Jimp.read(srcPath)

  // Square canvas - use max dimension
  const size = Math.max(img.width, img.height)
  const canvas = new Jimp({ width: size, height: size, color: 0xffffffff })

  // Center the original image
  const x = Math.floor((size - img.width) / 2)
  const y = Math.floor((size - img.height) / 2)
  canvas.composite(img, x, y)

  // Resize to 1024x1024 for high quality
  canvas.resize({ w: 1024, h: 1024 })

  // macOS Big Sur style rounded corners (22% radius)
  const cornerRadius = Math.floor(1024 * 0.22)
  roundCorners(canvas, cornerRadius)

  await canvas.write(dstPath)
  console.log(`Processed icon saved to ${dstPath}`)
}

function roundCorners(image, radius) {
  const width = image.width
  const height = image.height

  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      // Check if pixel is in a corner region
      let inCorner = false
      let cx, cy

      if (x < radius && y < radius) { cx = radius; cy = radius; inCorner = true }
      else if (x >= width - radius && y < radius) { cx = width - radius - 1; cy = radius; inCorner = true }
      else if (x < radius && y >= height - radius) { cx = radius; cy = height - radius - 1; inCorner = true }
      else if (x >= width - radius && y >= height - radius) { cx = width - radius - 1; cy = height - radius - 1; inCorner = true }

      if (inCorner) {
        const dx = x - cx
        const dy = y - cy
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist > radius) {
          image.setPixelColor(0x00000000, x, y)
        }
      }
    }
  }
}

prepareIcon().catch(console.error)
