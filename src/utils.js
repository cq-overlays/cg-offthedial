/**
 * Order of maps strictly follows:
 * https://github.com/Sendouc/sendou.ink/blob/HEAD/public/locales/en/game-misc.json
 * When adding new maps, please refer to it.
 */
export const maps = [
  "Scorch Gorge",
  "Eeltail Alley",
  "Hagglefish Market",
  "Undertow Spillway",
  "Mincemeat Metalworks",
  "Hammerhead Bridge",
  "Museum d'Alfonsino",
  "Mahi-Mahi Resort",
  "Inkblot Art Academy",
  "Sturgeon Shipyard",
  "MakoMart",
  "Wahoo World",
  "Flounder Heights",
  "Brinewater Springs",
]

export const measureText = (text, element) => {
  return getTextWidth(text, getCanvasFontSize(element))
}

function getTextWidth(text, font) {
  // re-use canvas object for better performance
  const canvas =
    getTextWidth.canvas ||
    (getTextWidth.canvas = document.createElement("canvas"))
  const context = canvas.getContext("2d")
  context.font = font
  const metrics = context.measureText(text)
  return metrics.width
}

function getCssStyle(element, prop) {
  return window.getComputedStyle(element, null).getPropertyValue(prop)
}

function getCanvasFontSize(el = document.body) {
  const fontWeight = getCssStyle(el, "font-weight") || "normal"
  const fontSize = getCssStyle(el, "font-size") || "16px"
  const fontFamily = getCssStyle(el, "font-family") || "Times New Roman"

  return `${fontWeight} ${fontSize} ${fontFamily}`
}
