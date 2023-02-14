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
  useReplicant("cq-dashboard.currentColors", ["#25B100", "#571DB1"])

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
        map: "Moray Towers",
        mode: "Clam Blitz",
      },
      {
        map: "Moray Towers",
        mode: "Clam Blitz",
      },
      {
        map: "Moray Towers",
        mode: "Clam Blitz",
      },
    ],
  })

export const useCurrentScores = () =>
  useReplicant("cq-dashboard.currentScores", [0, 0])

export const useCurrentTeams = () =>
  useReplicant("cq-dashboard.currentTeams", [
    {
      name: "Team A",
      roster: ["Player A1", "Player A2", "Player A3", "Player A4"],
    },
    {
      name: "Team B",
      roster: ["Player B1", "Player B2", "Player B3", "Player B4"],
    },
  ])

export const useLastFmData = () =>
  useReplicant("cq-dashboard.lastFmData", {
    enabled: false,
    config: {
      username: null,
      token: null,
    },
  })

export const useLoadedData = () =>
  useReplicant("cq-dashboard.loadedData", {
    rounds: {
      "Test Round": [
        { map: "Moray Towers", mode: "Clam Blitz" },
        { map: "Moray Towers", mode: "Clam Blitz" },
        { map: "Moray Towers", mode: "Clam Blitz" },
      ],
    },
    teams: {
      "Team A": ["Player A1", "Player A2", "Player A3", "Player A4"],
      "Team B": ["Player B1", "Player B2", "Player B3", "Player B4"],
    },
    blocks: {
      "Test Block": [
        { name: "Comm 1", twitter: "@Comm1", pronouns: "any" },
        { name: "Comm 2", twitter: "@Comm2", pronouns: "any" },
      ],
    },
    colors: [
      [
        { name: "Slimy Green", value: "#25B100" },
        { name: "Grape", value: "#571DB1" },
      ],
      [
        { name: "Winter Green", value: "#03B362" },
        { name: "Dark Magenta", value: "#B1008D" },
      ],
      [
        { name: "Turquoise", value: "#0CAE6E" },
        { name: "Pumpkin", value: "#F75900" },
      ],
      [
        { name: "Mustard", value: "#CE8003" },
        { name: "Purple", value: "#9208B2" },
      ],
      [
        { name: "Blue", value: "#2922B5" },
        { name: "Green", value: "#5EB604" },
      ],
      [
        { name: "Rich Purple", value: "#7B0393" },
        { name: "Green Apple", value: "#43BA05" },
      ],
      [
        { name: "Yellow", value: "#D9C100" },
        { name: "True Blue", value: "#007AC9" },
      ],
    ],
    maps: [
      "Ancho-V Games",
      "Arowana Mall",
      "Blackbelly Skatepark",
      "Camp Triggerfish",
      "Goby Arena",
      "Humpback Pump Track",
      "Inkblot Art Academy",
      "Kelp Dome",
      "MakoMart",
      "Manta Maria",
      "Moray Towers",
      "Musselforge Fitness",
      "New Albacore Hotel",
      "Piranha Pit",
      "Port Mackerel",
      "Shellendorf Institute",
      "Skipper Pavilion",
      "Snapper Canal",
      "Starfish Mainstage",
      "Sturgeon Shipyard",
      "The Reef",
      "Urchin Underpass",
      "Wahoo World",
      "Walleye Warehouse",
    ],
    modes: ["Splat Zones", "Tower Control", "Rainmaker", "Clam Blitz"],
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
