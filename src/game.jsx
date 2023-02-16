import anime from "animejs"
import { useEffect, useRef, useMemo } from "preact/hooks"
import render from "./render"
import {
  useCurrentBlock,
  useCurrentColors,
  useCurrentGameScreen,
  useCurrentRound,
  useCurrentScores,
  useCurrentTeams,
} from "./replicants"
import { useAnimatedTextMap } from "./utils"

const cycle = [15, 45]

function App() {
  const scoreRef = useRef()
  const commRef = useRef()
  const cycleRef = useRef()

  const [screen] = useCurrentGameScreen()

  const tl = useMemo(() => {
    return anime
      .timeline({
        loop: true,
      })
      .add({
        duration: cycle[0] * 1000,
        changeComplete: () =>
          anime({
            targets: cycleRef.current,
            easing: "easeInOutExpo",
            duration: 300,
            scale: 0.9,
            opacity: 0,
            complete: () => {
              cycleRef.current.style.visibility = "hidden"
            },
          }),
      })
      .add({
        duration: cycle[1] * 1000,
        changeComplete: () =>
          anime({
            targets: cycleRef.current,
            easing: "easeInOutExpo",
            duration: 300,
            scale: 1,
            opacity: 1,
            begin: () => {
              cycleRef.current.style.visibility = "visible"
            },
          }),
      })
  }, [])

  useEffect(() => {
    if (screen.showCommentators) {
      tl.play()
    } else {
      tl.pause()
      tl.seek(tl.duration - 1)
    }
    anime({
      targets: [scoreRef.current, commRef.current],
      easing: "easeInOutExpo",
      duration: 300,
      delay: anime.stagger(50),
      scale: screen.showScores ? 1 : 0.9,
      opacity: screen.showScores ? 1 : 0,
    })
  }, [screen])

  return (
    <div class="flex flex-col m-5 gap-5 items-start">
      <div
        class="bg-otd-blue rounded-lg text-3xl font-medium flex flex-col"
        ref={scoreRef}
      >
        <Scoreboard />
      </div>
      <div ref={commRef}>
        <div class="bg-otd-blue rounded-md flex items-center" ref={cycleRef}>
          <div class="px-3 text-white mb-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              class="w-10 h-10"
            >
              <path d="M8.25 4.5a3.75 3.75 0 117.5 0v8.25a3.75 3.75 0 11-7.5 0V4.5z" />
              <path d="M6 10.5a.75.75 0 01.75.75v1.5a5.25 5.25 0 1010.5 0v-1.5a.75.75 0 011.5 0v1.5a6.751 6.751 0 01-6 6.709v2.291h3a.75.75 0 010 1.5h-7.5a.75.75 0 010-1.5h3v-2.291a6.751 6.751 0 01-6-6.709v-1.5A.75.75 0 016 10.5z" />
            </svg>
          </div>
          <div class="rounded-md bg-white mb-2 px-3 py-2">
            <Comm />
          </div>
        </div>
      </div>
    </div>
  )
}

const Scoreboard = () => {
  const [scores] = useCurrentScores()
  const [teams] = useCurrentTeams()
  const [colors] = useCurrentColors()
  const [round] = useCurrentRound()

  return (
    <>
      <div class="flex">
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
    </>
  )
}

const Comm = () => {
  const [comms] = useCurrentBlock()
  const commTwitterRefs = useRef(new Map())
  const commPronounRefs = useRef(new Map())

  useAnimatedTextMap(comms.value, [
    (v, i) => [v.twitter, commTwitterRefs.current.get(i)],
    (v, i) => [v.pronouns, commPronounRefs.current.get(i)],
  ])

  return (
    <div class="flex flex-col gap-3">
      {comms.value.map((c, i) => (
        <div class="flex items-center gap-3 text-3xl font-medium">
          <div key={i + "t"}>
            <p
              ref={(el) =>
                el
                  ? commTwitterRefs.current.set(i, el)
                  : commTwitterRefs.current.delete(i)
              }
            ></p>
          </div>
          <div
            key={i + "p"}
            class={`rounded-md bg-otd-blue text-white text-2xl py-1.5 px-3 ${
              c.pronouns.length > 0 ? "" : "hidden"
            }`}
          >
            <p
              ref={(el) => {
                el
                  ? commPronounRefs.current.set(i, el)
                  : commPronounRefs.current.delete(i)
              }}
            ></p>
          </div>
        </div>
      ))}
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

  return <div ref={ref} class="shrink-0 h-6 w-6 rounded-md" />
}

const Name = ({ name }) => {
  const ref = useRef()

  useEffect(() => {
    anime({
      targets: ref.current,
      duration: 500,
      easing: "easeInOutExpo",
      complete: () => {
        anime({
          targets: ref.current,
          duration: 500,
          easing: "easeInOutExpo",
          opacity: 0,
          complete: () => {
            ref.current.innerText = name
            anime({
              targets: ref.current,
              duration: 500,
              easing: "easeInOutExpo",
              opacity: 1,
            })
          },
        })
      },
    })
  }, [name])

  return <p ref={ref} class="truncate w-[15ch]"></p>
}

const Score = ({ score }) => {
  const ref = useRef()

  useEffect(() => {
    anime({
      targets: ref.current,
      duration: 500,
      easing: "easeInOutExpo",
      complete: () => {
        anime({
          targets: ref.current,
          duration: 500,
          easing: "easeInOutExpo",
          opacity: 0,
          complete: () => {
            ref.current.innerText = score
            anime({
              targets: ref.current,
              duration: 500,
              easing: "easeInOutExpo",
              opacity: 1,
            })
          },
        })
      },
    })
  }, [score])

  return <p ref={ref} class="font-mono"></p>
}

const Round = ({ round }) => {
  const ref = useRef()

  useEffect(() => {
    anime({
      targets: ref.current,
      easing: "easeInOutExpo",
      duration: 500,
      opacity: 0,
      complete: () => {
        ref.current.innerText = round.name
        anime({
          targets: ref.current,
          easing: "easeInOutExpo",
          duration: 500,
          opacity: 1,
        })
      },
    })
  }, [round])

  return (
    <div
      ref={ref}
      class="rounded-lg p-2 text-center col-span-2 row-start-2 text-2xl text-white"
    ></div>
  )
}

render(App)
