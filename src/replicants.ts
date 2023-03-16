import { useEffect, useState } from "preact/compat"

export const useCurrentBlock = () =>
  useReplicant("cq-dashboard.currentBlock", {
    name: "Test Block",
    value: [
      { name: "Comm 1", twitter: "@Comm1", pronouns: "any" },
      { name: "Comm 2", twitter: "@Comm2", pronouns: "any" },
    ],
  })

export const useCurrentBreakScreen = () =>
  useReplicant("cq-dashboard.currentBreakScreen", "brb")

export const useCurrentColors = () =>
  useReplicant("cq-dashboard.currentColors", ["#d0be08", "#3a0ccd"])

export const useCurrentFlavorText = () =>
  useReplicant("cq-dashboard.currentFlavorText", "Hello World!")

export const useCurrentGameScreen = () =>
  useReplicant("cq-dashboard.currentGameScreen", {
    showScores: true,
    showCommentators: true,
  })

export const useCurrentMapWinners = () =>
  useReplicant("cq-dashboard.currentMapWinners", [])

export const useCurrentMusic = () =>
  useReplicant("cq-dashboard.currentMusic", {
    song: "Wave Prism",
    artist: "Chirpy Chips",
  })

export const useCurrentRound = () =>
  useReplicant("cq-dashboard.currentRound", {
    name: "Test Round",
    value: [
      {
        map: "Scorch Gorge",
        mode: "Splat Zones",
      },
      {
        map: "Scorch Gorge",
        mode: "Splat Zones",
      },
      {
        map: "Scorch Gorge",
        mode: "Splat Zones",
      },
    ],
  })

export const useCurrentScores = () =>
  useReplicant("cq-dashboard.currentScores", [0, 0])

export const useCurrentTeams = () =>
  useReplicant("cq-dashboard.currentTeams", [
    {
      name: "Team A",
      data: [],
    },
    {
      name: "Team B",
      data: [],
    },
  ])

export const useLoadedData = () =>
  useReplicant("cq-dashboard.loadedData", {
    rounds: {},
    teams: {},
    blocks: {},
    colors: [],
    maps: [],
    modes: [],
  })

export const useLastFmData = () =>
  useReplicant("cq-dashboard.lastFmData", {
    enabled: false,
    config: {
      username: null,
      token: null,
    },
  })

export const useReplicant = <T, U>(
  replicantName: string,
  initialValue: U
): [T | U, (newValue: T) => void] => {
  const [value, updateValue] = useState<T | U>(initialValue)
  const replicant = nodecg.Replicant(...replicantName.split(".").reverse())

  const changeHandler = (newValue: T): void => {
    updateValue((oldValue) => {
      if (newValue !== oldValue) {
        return newValue
      }
      return JSON.parse(JSON.stringify(newValue))
    })
  }

  useEffect(() => {
    replicant.on("change", changeHandler)
    return () => {
      replicant.removeListener("change", changeHandler)
    }
  }, [replicant])

  return [
    value,
    (newValue) => {
      replicant.value = newValue
    },
  ]
}
