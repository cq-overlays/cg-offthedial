import anime from "animejs"
import { useEffect } from "preact/hooks"

/**
 * Order of maps strictly follows:
 * https://github.com/Sendouc/sendou.ink/blob/HEAD/public/locales/en/game-misc.json
 * When adding new maps, please refer to it.
 */

export const animateText = (targets, stageA, add) => {
  let tl = anime
    .timeline({
      targets,
      duration: 500,
      easing: "easeInOutExpo",
    })
    .add({
      opacity: 0,
      complete: () => stageA(),
    })
  if (add) add(tl)
  tl.add({ opacity: 1 })
}

export const useAnimatedTextMap = (value, getters, animateWidth = true) => {
  useEffect(() => {
    value.forEach((v, i) =>
      getters.forEach((getter) => {
        const [text, current] = getter(v, i)
        if (text !== current.innerText)
          animateText(
            current,
            () => {
              if (animateWidth) {
                current.innerText = "."
              } else {
                current.innerText = text
              }
            },
            animateWidth
              ? (tl) =>
                  tl.add({
                    minWidth: measureText(text, current),
                    complete: () => (current.innerText = text),
                  })
              : undefined
          )
      })
    )
  }, [value])
}

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
