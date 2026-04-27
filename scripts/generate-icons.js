import { Jimp } from 'jimp'
import fs from 'fs'
import path from 'path'

const publicDir = path.resolve('public')
if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir)

async function generateIcon(size) {
  const image = new Jimp({ width: size, height: size, color: 0x818cf8ff })

  // Draw a lighter circle in the center
  const cx = size / 2
  const cy = size / 2
  const radius = size * 0.35

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const dx = x - cx
      const dy = y - cy
      const dist = Math.sqrt(dx * dx + dy * dy)
      if (dist < radius) {
        image.setPixelColor(0xa78bfaff, x, y)
      }
    }
  }

  // Draw "S" letter in white
  const fontSize = Math.round(size * 0.5)
  // Jimp doesn't have built-in text rendering with custom fonts easily,
  // so we draw a simple white block "S" shape using pixels
  const sWidth = Math.round(size * 0.22)
  const sHeight = Math.round(size * 0.32)
  const sx = Math.round(cx - sWidth / 2)
  const sy = Math.round(cy - sHeight / 2)
  const barH = Math.round(sHeight / 5)

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const inS = (
        // Top bar
        (y >= sy && y < sy + barH && x >= sx && x < sx + sWidth) ||
        // Middle bar
        (y >= sy + sHeight / 2 - barH / 2 && y < sy + sHeight / 2 + barH / 2 && x >= sx && x < sx + sWidth) ||
        // Bottom bar
        (y >= sy + sHeight - barH && y < sy + sHeight && x >= sx && x < sx + sWidth) ||
        // Left vertical (top half)
        (y >= sy && y < sy + sHeight / 2 + barH / 2 && x >= sx && x < sx + barH) ||
        // Right vertical (bottom half)
        (y >= sy + sHeight / 2 - barH / 2 && y < sy + sHeight && x >= sx + sWidth - barH && x < sx + sWidth)
      )
      if (inS) {
        const dx = x - cx
        const dy = y - cy
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < radius) {
          image.setPixelColor(0xffffffff, x, y)
        }
      }
    }
  }

  return image
}

async function main() {
  const sizes = [72, 96, 128, 144, 152, 192, 384, 512]
  for (const size of sizes) {
    const img = await generateIcon(size)
    await img.write(path.join(publicDir, `icon-${size}x${size}.png`))
    console.log(`Generated icon-${size}x${size}.png`)
  }
  console.log('Done!')
}

main().catch(console.error)
