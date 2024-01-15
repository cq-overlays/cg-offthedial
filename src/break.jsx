import render from "./render"
import background from "./background.png"
import { animateText, logo, measureText, useAnimatedTextMap } from "./utils.js"
import {
  useCurrentBlock,
  useCurrentBreakScreen,
  useCurrentFlavorText,
  useCurrentMapWinners,
  useCurrentRound,
  useCurrentScores,
  useCurrentTeams,
  useLoadedData,
} from "./replicants"
import { useRef, useEffect, useState } from "preact/hooks"
import anime from "animejs"
import { forwardRef } from "preact/compat"

function App() {
  const [breakScreen] = useCurrentBreakScreen()
  const [lastScreen, setLastScreen] = useState("all")
  const [{ maps }] = useLoadedData()
  const refs = useRef(new Map())
  const getVisible = (screen) =>
    ({
      brb: [
        [refs.current.get("screen-brb")],
        [
          refs.current.get("img"),
          refs.current.get("flavor"),
          refs.current.get("comms"),
          refs.current.get("social"),
        ],
      ],
      maplist: [
        [refs.current.get("screen-rest"), refs.current.get("screen-rest-maps")],
        [refs.current.get("scoreboard"), ".maplist-game"],
      ],
      rosters: [
        [
          refs.current.get("screen-rest"),
          refs.current.get("screen-rest-roster"),
        ],
        [refs.current.get("scoreboard"), ".roster-panel"],
      ],
      all: [
        [
          refs.current.get("screen-brb"),
          refs.current.get("screen-rest"),
          refs.current.get("screen-rest-maps"),
          refs.current.get("screen-rest-roster"),
        ],
        [
          refs.current.get("img"),
          refs.current.get("flavor"),
          refs.current.get("comms"),
          refs.current.get("social"),
          refs.current.get("scoreboard"),
          ".maplist-game",
          ".roster-panel",
        ],
      ],
    }[screen])

  useEffect(() => {
    const lastVisible = getVisible(lastScreen)
    setLastScreen(breakScreen)
    const nowVisible = getVisible(breakScreen)

    const shide = lastVisible[0].filter((x) => !nowVisible[0].includes(x))
    const sshow = nowVisible[0].filter((x) => !lastVisible[0].includes(x))
    const ahide = lastVisible[1].filter((x) => !nowVisible[1].includes(x))
    const ashow = nowVisible[1].filter((x) => !lastVisible[1].includes(x))

    const a = anime({
      duration: 400,
      easing: "easeInOutExpo",
      delay: anime.stagger(60),
      targets: ahide,
      opacity: 0,
      scale: 0.9,
      complete: () => {
        shide.forEach((el) => (el.style.display = "none"))
        sshow.forEach((el) => (el.style.display = ""))
        anime({
          duration: 400,
          easing: "easeInOutExpo",
          delay: anime.stagger(60),
          targets: ashow,
          opacity: 1,
          scale: 1,
        })
      },
    })
    return () => {
      if (!a.completed) {
        a.pause()
        a.seek(a.duration - 1)
        shide.forEach((el) => (el.style.display = "none"))
        sshow.forEach((el) => (el.style.display = ""))
      }
    }
  }, [breakScreen])

  return (
    <div
      class="p-12 flex bg-otd-slate h-screen w-screen items-stretch text-4xl font-medium bg-center"
      style={{ backgroundImage: `url('${background}')` }}
    >
      <div
        class="flex flex-col items-center w-full gap-8 justify-center"
        ref={(el) => refs.current.set("screen-brb", el)}
      >
        <div
          class="relative max-w-md w-full mb-24"
          ref={(el) => refs.current.set("img", el)}
        >
          <img src={logo} style="absolute inset-0" />
        </div>
        <div ref={(el) => refs.current.set("flavor", el)}>
          <TextSquare>
            <FlavorText />
          </TextSquare>
        </div>
        <div ref={(el) => refs.current.set("comms", el)}>
          <TextSquare
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                class="w-10 h-10"
              >
                <path d="M8.25 4.5a3.75 3.75 0 117.5 0v8.25a3.75 3.75 0 11-7.5 0V4.5z" />
                <path d="M6 10.5a.75.75 0 01.75.75v1.5a5.25 5.25 0 1010.5 0v-1.5a.75.75 0 011.5 0v1.5a6.751 6.751 0 01-6 6.709v2.291h3a.75.75 0 010 1.5h-7.5a.75.75 0 010-1.5h3v-2.291a6.751 6.751 0 01-6-6.709v-1.5A.75.75 0 016 10.5z" />
              </svg>
            }
          >
            <Comm />
          </TextSquare>
        </div>
        <div ref={(el) => refs.current.set("social", el)}>
          <Social />
        </div>
      </div>
      <div
        class="flex flex-col items-center w-full gap-8 justify-between"
        ref={(el) => refs.current.set("screen-rest", el)}
      >
        <div ref={(el) => refs.current.set("scoreboard", el)}>
          <Scoreboard />
        </div>
        <div ref={(el) => refs.current.set("screen-rest-maps", el)}>
          <Maps maps={maps} />
        </div>
        <div
          class="w-full"
          ref={(el) => refs.current.set("screen-rest-roster", el)}
        >
          <Roster />
        </div>
        <div></div>
      </div>
    </div>
  )
}

const Scoreboard = () => {
  const teamA = useRef()
  const teamB = useRef()
  const scoreA = useRef()
  const scoreB = useRef()
  const [teams] = useCurrentTeams()
  const [scores] = useCurrentScores()

  return (
    <div class="flex items-center">
      <div class="rounded-md bg-otd-blue flex">
        <div class="flex-1 w-full rounded-md flex items-center bg-otd-blue">
          <FadeText animateWidth={false} text={teams[0].name} ref={teamA}>
            <p
              ref={teamA}
              class="truncate rounded-md w-[17ch] text-right bg-white mb-2 px-3 py-2"
            ></p>
          </FadeText>
        </div>
        <div class="flex items-center text-white p-2 mb-1 gap-20">
          <FadeText animateWidth={false} text={scores[0]} ref={scoreA}>
            <p class="w-12 text-center" ref={scoreA}></p>
          </FadeText>
        </div>
      </div>
      <img src={logo} class="h-32 mx-9" />

      <div class="rounded-md bg-otd-blue flex">
        <div class="flex items-center text-white p-2 mb-1 gap-20">
          <FadeText animateWidth={false} text={scores[1]} ref={scoreB}>
            <p class="w-12 text-center" ref={scoreB}></p>
          </FadeText>
        </div>
        <div class="flex-1 w-full rounded-md flex items-center bg-otd-blue">
          <FadeText animateWidth={false} text={teams[1].name} ref={teamB}>
            <p
              ref={teamB}
              class="truncate rounded-md w-[17ch] bg-white mb-2 px-3 py-2"
            ></p>
          </FadeText>
        </div>
      </div>
    </div>
  )
}

const getImg = (maps, map) => {
  return maps.indexOf(map) - 1 >= 0
    ? `https://sendou.ink/static-assets/img/stages/${maps.indexOf(map) - 1}.png`
    : ""
}

const fadeRoster = (targets, complete) => {
  anime
    .timeline({
      targets,
      duration: 500,
      easing: "easeInOutExpo",
    })
    .add({
      opacity: 0,
      complete,
    })
    .add({ opacity: 1 })
}

const Roster = () => {
  const [rawTeams] = useCurrentTeams()
  const [teams, setTeams] = useState(rawTeams)

  const panelRefA = useRef()
  const panelRefB = useRef()

  useEffect(() => {
    fadeRoster(panelRefA.current, () => {
      setTeams(rawTeams)
    })
  }, [rawTeams[0]])

  useEffect(() => {
    fadeRoster(panelRefB.current, () => {
      setTeams(rawTeams)
    })
  }, [rawTeams[1]])

  return (
    <div class="flex justify-evenly items-stretch gap-12">
      <div class="roster-panel rounded-lg flex-1 bg-otd-blue pb-3 pr-3 mx-24">
        <div
          ref={panelRefA}
          class="rounded-lg w-full h-full justify-around bg-white p-6 flex flex-col gap-3"
        >
          <RosterList roster={teams[0].data || []} row="flex-row-reverse" />
        </div>
      </div>
      <div class="roster-panel self-center rounded-lg h-40 w-40 text-7xl flex items-center justify-center bg-otd-blue text-white font-bold">
        VS
      </div>
      <div class="roster-panel rounded-lg flex-1 bg-otd-blue pb-3 pr-3 mx-24">
        <div
          ref={panelRefB}
          class="rounded-lg w-full h-full justify-around bg-white p-6 flex flex-col gap-3"
        >
          <RosterList roster={teams[1].data || []} />
        </div>
      </div>
    </div>
  )
}

const RosterList = ({ roster, row = "flex-row" }) => (
  <>
    {roster.map((data) => (
      <div class={`flex items-center justify-between gap-6 ${row}`}>
        <p class="truncate">
          {data.splashtag.split("#")[0]}
        </p>
        <div class="flex items-center shrink-0">
          {data.weapons.map((w) => {
            console.log(w)
            return (
              <img
                class="h-14"
                src={`https://raw.githubusercontent.com/Sendouc/sendou.ink/rewrite/public/static-assets/img/main-weapons-outlined/${w.id}.png`}
              />
            )
          })}
        </div>
      </div>
    ))}
  </>
)

const Maps = ({ maps }) => {
  // round
  const [round] = useCurrentRound()
  const [mapWinners] = useCurrentMapWinners()
  const roundRef = useRef()
  const [roundValue, setRoundValue] = useState(round.value)

  // map
  const mapRefs = useRef(new Map())
  const modeRefs = useRef(new Map())
  useAnimatedTextMap(
    roundValue,
    [
      (v, i) => [v.map, mapRefs.current.get(i)],
      (v, i) => [v.mode, modeRefs.current.get(i)],
    ],
    false
  )

  const winnerRefs = useRef(new Map())
  const winnerTextRefs = useRef(new Map())
  useEffect(() => {
    roundValue.forEach((v, i) => {
      const text = mapWinners?.[i] ? mapWinners?.[i] : null
      const divCurrent = winnerRefs.current.get(i)
      const textCurrent = winnerTextRefs.current.get(i)
      if (text !== textCurrent.innerText) {
        anime
          .timeline({
            targets: divCurrent,
            duration: 500,
            easing: "easeInOutExpo",
          })
          .add({
            opacity: 0,
            complete: () => {
              textCurrent.innerText = text
            },
          })
          .add({
            backdropFilter:
              text === null
                ? "brightness(1) saturate(1)"
                : "brightness(0.33) saturate(0.33)",
            opacity: 1,
          })
      }
    })
  }, [mapWinners])

  useEffect(() => {
    if (round.value.length !== roundValue.length) {
      animateText(roundRef.current, () => {
        setRoundValue(round.value)
      })
    } else {
      setRoundValue(round.value)
    }
  }, [round])

  return (
    <div
      ref={roundRef}
      class="flex text-3xl w-full gap-16 justify-center items-stretch"
    >
      {roundValue.map((game, i) => (
        <div class="w-64 ring-2 ring-otd-slate flex flex-col flex-1 rounded-lg text-white bg-otd-blue pr-3 maplist-game">
          <div class="w-full flex flex-col items-stretch grow rounded-lg bg-white text-black">
            <div
              class="relative overflow-hidden w-full h-96 rounded-t-lg bg-cover bg-center flex items-center justify-center bg-slate-800"
              style={{
                backgroundImage: `url('${getImg(maps, game.map)}')`,
              }}
            >
              {getImg(maps, game.map).length === 0 && (
                <p class="font-bold text-9xl text-slate-400 text-center">?</p>
              )}
              <div
                class={`absolute px-3 py-2 inset-0 text-4xl leading-snug font-medium text-white`}
                ref={(el) =>
                  el
                    ? winnerRefs.current.set(i, el)
                    : winnerRefs.current.delete(i)
                }
              >
                <p
                  ref={(el) =>
                    el
                      ? winnerTextRefs.current.set(i, el)
                      : winnerTextRefs.current.delete(i)
                  }
                ></p>
              </div>
            </div>
            <div class="p-3 pl-6 grow flex w-full items-center justify-center text-center">
              <p
                ref={(el) =>
                  el ? mapRefs.current.set(i, el) : mapRefs.current.delete(i)
                }
                class={
                  getImg(maps, game.map).length === 0 && "text-slate-500 italic"
                }
              ></p>
            </div>
          </div>
          <p
            ref={(el) =>
              el ? modeRefs.current.set(i, el) : modeRefs.current.delete(i)
            }
            class="p-3 pl-6 text-center"
          ></p>
        </div>
      ))}
    </div>
  )
}

const FlavorText = () => {
  const [flavorText] = useCurrentFlavorText()
  const flavorTextRef = useRef()

  return (
    <FadeText text={flavorText} ref={flavorTextRef}>
      <p ref={flavorTextRef}></p>
    </FadeText>
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
    <div class="flex items-center gap-3">
      {comms.value.map((c, i) => (
        <>
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
            class={`rounded-md bg-otd-blue text-white text-3xl py-1.5 px-3 ${
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
          {i < comms.value.length - 1 && <p key={i + "a"}>&</p>}
        </>
      ))}
    </div>
  )
}

const Social = () => {
  const socials = [
    [
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        class="w-10 h-10"
      >
        <path
          fillRule="evenodd"
          d="M7.5 6v.75H5.513c-.96 0-1.764.724-1.865 1.679l-1.263 12A1.875 1.875 0 004.25 22.5h15.5a1.875 1.875 0 001.865-2.071l-1.263-12a1.875 1.875 0 00-1.865-1.679H16.5V6a4.5 4.5 0 10-9 0zM12 3a3 3 0 00-3 3v.75h6V6a3 3 0 00-3-3zm-3 8.25a3 3 0 106 0v-.75a.75.75 0 011.5 0v.75a4.5 4.5 0 11-9 0v-.75a.75.75 0 011.5 0v.75z"
          clipRule="evenodd"
        />
      </svg>,
      "shop.otd.ink",
    ],
    [
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 512 512"
        fill="currentColor"
        class="w-10 h-10"
      >
        <path d="M459.37 151.716c.325 4.548.325 9.097.325 13.645 0 138.72-105.583 298.558-298.558 298.558-59.452 0-114.68-17.219-161.137-47.106 8.447.974 16.568 1.299 25.34 1.299 49.055 0 94.213-16.568 130.274-44.832-46.132-.975-84.792-31.188-98.112-72.772 6.498.974 12.995 1.624 19.818 1.624 9.421 0 18.843-1.3 27.614-3.573-48.081-9.747-84.143-51.98-84.143-102.985v-1.299c13.969 7.797 30.214 12.67 47.431 13.319-28.264-18.843-46.781-51.005-46.781-87.391 0-19.492 5.197-37.36 14.294-52.954 51.655 63.675 129.3 105.258 216.365 109.807-1.624-7.797-2.599-15.918-2.599-24.04 0-57.828 46.782-104.934 104.934-104.934 30.213 0 57.502 12.67 76.67 33.137 23.715-4.548 46.456-13.32 66.599-25.34-7.798 24.366-24.366 44.833-46.132 57.827 21.117-2.273 41.584-8.122 60.426-16.243-14.292 20.791-32.161 39.308-52.628 54.253z" />
      </svg>,
      "@Off_The_Dial",
    ],
    [
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 640 512"
        fill="currentColor"
        class="w-10 h-10"
      >
        <path d="M524.531,69.836a1.5,1.5,0,0,0-.764-.7A485.065,485.065,0,0,0,404.081,32.03a1.816,1.816,0,0,0-1.923.91,337.461,337.461,0,0,0-14.9,30.6,447.848,447.848,0,0,0-134.426,0,309.541,309.541,0,0,0-15.135-30.6,1.89,1.89,0,0,0-1.924-.91A483.689,483.689,0,0,0,116.085,69.137a1.712,1.712,0,0,0-.788.676C39.068,183.651,18.186,294.69,28.43,404.354a2.016,2.016,0,0,0,.765,1.375A487.666,487.666,0,0,0,176.02,479.918a1.9,1.9,0,0,0,2.063-.676A348.2,348.2,0,0,0,208.12,430.4a1.86,1.86,0,0,0-1.019-2.588,321.173,321.173,0,0,1-45.868-21.853,1.885,1.885,0,0,1-.185-3.126c3.082-2.309,6.166-4.711,9.109-7.137a1.819,1.819,0,0,1,1.9-.256c96.229,43.917,200.41,43.917,295.5,0a1.812,1.812,0,0,1,1.924.233c2.944,2.426,6.027,4.851,9.132,7.16a1.884,1.884,0,0,1-.162,3.126,301.407,301.407,0,0,1-45.89,21.83,1.875,1.875,0,0,0-1,2.611,391.055,391.055,0,0,0,30.014,48.815,1.864,1.864,0,0,0,2.063.7A486.048,486.048,0,0,0,610.7,405.729a1.882,1.882,0,0,0,.765-1.352C623.729,277.594,590.933,167.465,524.531,69.836ZM222.491,337.58c-28.972,0-52.844-26.587-52.844-59.239S193.056,219.1,222.491,219.1c29.665,0,53.306,26.82,52.843,59.239C275.334,310.993,251.924,337.58,222.491,337.58Zm195.38,0c-28.971,0-52.843-26.587-52.843-59.239S388.437,219.1,417.871,219.1c29.667,0,53.307,26.82,52.844,59.239C470.715,310.993,447.538,337.58,417.871,337.58Z" />
      </svg>,
      "otd.ink/discord",
    ],
  ]
  const ref = useRef()
  const iconRef = useRef()
  const [counter, setCounter] = useState(0)
  const [iconCounter, setIconCounter] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCounter((counter) => counter + 1)
      animateText(
        iconRef.current,
        () => setIconCounter((counter) => counter + 1),
        (tl) => tl.add({ duration: 400 })
      )
    }, 10000)

    return () => {
      clearInterval(interval)
    }
  }, [])

  return (
    <TextSquare
      icon={<div ref={iconRef}>{socials[iconCounter % socials.length][0]}</div>}
    >
      <FadeText text={socials[counter % socials.length][1]} ref={ref}>
        <p ref={ref}></p>
      </FadeText>
    </TextSquare>
  )
}

const FadeText = forwardRef(({ text, animateWidth = true, children }, ref) => {
  useEffect(() => {
    animateText(
      ref.current,
      () => {
        if (animateWidth) {
          ref.current.innerText = "."
        } else {
          ref.current.innerText = text
        }
      },
      animateWidth
        ? (tl) =>
            tl.add({
              minWidth: measureText(text, ref.current),
              complete: () => {
                ref.current.innerText = text
              },
            })
        : undefined
    )
  }, [text])

  return children
})

const TextSquare = ({ icon, children }) => {
  return (
    <div class="rounded-md flex items-center bg-otd-blue">
      {icon && <div class="px-3 text-white mb-1">{icon}</div>}
      <div class="rounded-md bg-white mb-2 px-3 py-2">{children}</div>
    </div>
  )
}

render(App)
