import anime from "animejs"
import { useEffect, useRef } from "preact/hooks"
import render from "./render"
import {
  useCurrentColors,
  useCurrentRound,
  useCurrentScores,
  useCurrentTeams,
} from "./replicants"

function App() {
  const [scores] = useCurrentScores()
  const [teams] = useCurrentTeams()
  const [colors] = useCurrentColors()
  const [round] = useCurrentRound()
  return (
    <div class="flex">
      <div class="bg-otd-blue rounded-lg m-5 max-w-md text-3xl font-medium flex flex-col">
        <div className="flex">
          <div class="bg-white min-w-0 grow rounded-lg p-4 flex flex-col gap-4">
            <div class="flex items-center gap-4">
              <Color color={colors[0]} />
              <Name name={teams[0].name} />
            </div>
            <div class="flex items-center gap-4">
              <Color color={colors[1]} />
              <Name name={teams[1].name} />
            </div>
          </div>
          <div class="p-4 shrink-0 text-white flex flex-col gap-4">
            <Score score={scores[0]} />
            <Score score={scores[1]} />
          </div>
        </div>
        <Round round={round} />
      </div>
    </div>
  )
}

const Color = ({ color }) => {
  const ref = useRef()

  useEffect(() => {
    anime({
      targets: ref.current,
      duration: 500,
      backgroundColor: color,
      easing: "easeInOutExpo",
    })
  }, [color])

  return <div ref={ref} className="shrink-0 h-6 w-6 rounded-md" />
}

const Name = ({ name }) => {
  const ref = useRef()

  useEffect(() => {
    anime
      .timeline({
        targets: ref.current,
        duration: 500,
        easing: "easeInOutExpo",
      })
      .add({
        opacity: 0,
      })
      .add({
        width: measureText(name, ref.current),
        complete: () => {
          ref.current.innerText = name
        },
      })
      .add({
        opacity: 1,
      })
  }, [name])

  return <p ref={ref} className="leading-none truncate"></p>
}

const Score = ({ score }) => {
  const ref = useRef()

  useEffect(() => {
    anime
      .timeline({
        targets: ref.current,
        duration: 500,
        easing: "easeInOutExpo",
      })
      .add({
        opacity: 0,
        complete: () => {
          ref.current.innerText = score
        },
      })
      .add({
        opacity: 1,
      })
  }, [score])

  return <p ref={ref} className="leading-none font-mono"></p>
}

const Round = ({ round }) => {
  const ref = useRef()

  useEffect(() => {
    anime
      .timeline({
        targets: ref.current,
        duration: 500,
        easing: "easeInOutExpo",
      })
      .add({
        opacity: 0,
        complete: () => {
          ref.current.innerText = round.name
        },
      })
      .add({
        opacity: 1,
      })
  }, [round])

  return (
    <div
      ref={ref}
      class="rounded-lg p-2 text-center col-span-2 row-start-2 text-2xl text-white"
    ></div>
  )
}

const measureText = (text, element) => {
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

render(App)
