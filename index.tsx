import React, {useState, useEffect} from "react"
import {createRoot} from "react-dom/client"
import Knob from "./components/Knob"
import LFOBar from "./components/LFOBar"
import PresetBar from "./components/PresetBar"
import parameters from "./processor/parameters.json"
import DarkIcon from "./assets/dark.svg"
import LightIcon from "./assets/light.svg"
import functions from "./structures/Functions"
import "./index.scss"

const darkColorList = {
    "--background": "#220E1A",
    "--textColor": "#FFFFFF"
}

const lightColorList = {
    "--background": "#FFBEE6",
    "--textColor": "#000000",
}

type ThemeContextType = {theme: string; setTheme: React.Dispatch<React.SetStateAction<string>>}
export const ThemeContext = React.createContext<ThemeContextType>({theme: "", setTheme: () => null})

const App: React.FunctionComponent = () => {
    const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark")

    useEffect(() => {
        const colorList = theme === "light" ? lightColorList : darkColorList
        for (const [key, color] of Object.entries(colorList)) {
            document.documentElement.style.setProperty(key, color)
        }
        localStorage.setItem("theme", theme)
    }, [theme])

    const toggleTheme = () => {
        setTheme((prev) => prev === "light" ? "dark" : "light")
    }

    const filter = functions.calculateFilter("#FF4EA7")

    return (
        <div className="app">
            <ThemeContext.Provider value={{theme, setTheme}}>
            <div className="title-container">
                <span className="title-text">Cute Gain</span>
                {theme === "light" ? 
                <DarkIcon className="theme-icon" style={{filter}} onClick={toggleTheme}/> :
                <LightIcon className="theme-icon" style={{filter}} onClick={toggleTheme}/>}
            </div>
            <div className="knobs-container">
                <Knob 
                    label={parameters.gain.id.toUpperCase()} 
                    parameterID={parameters.gain.id} 
                    mapOptionID={parameters.gainCurve.id}
                    color="#FF4EA7" 
                    display="percent" 
                    mappingOptions={["logarithmic", "linear", "exponential"]}/>
                <Knob 
                    label={parameters.boost.id.toUpperCase()} 
                    parameterID={parameters.boost.id} 
                    mapOptionID={parameters.boostCurve.id}
                    color="#FF4EA7" 
                    display="decibels" 
                    style={{marginLeft: "10px"}} 
                    mappingOptions={["logarithmic", "linear", "exponential"]}/>
                <Knob 
                    label={parameters.pan.id.toUpperCase()} 
                    parameterID={parameters.pan.id} 
                    mapOptionID={parameters.panningLaw.id}
                    color="#FF4EA7" 
                    display="pan" 
                    mappingOptions={["constant", "triangle", "linear"]}/>
            </div>
            <div className="lfo-container">
                <LFOBar 
                    label={parameters.gain.id.toUpperCase()}
                    lfoTypeID={parameters.gainLFOType.id} 
                    lfoRateID={parameters.gainLFORate.id} 
                    lfoAmountID={parameters.gainLFOAmount.id} 
                    lfoInvertID={parameters.gainLFOInvert.id}
                    color="#FF4EA7"
                    theme={theme}/>
                <LFOBar 
                    label={parameters.pan.id.toUpperCase()} 
                    lfoTypeID={parameters.panLFOType.id} 
                    lfoRateID={parameters.panLFORate.id} 
                    lfoAmountID={parameters.panLFOAmount.id}  
                    lfoInvertID={parameters.panLFOInvert.id}
                    color="#FF4EA7"
                    theme={theme}/>
            </div>
            <div className="preset-container">
                <PresetBar/>
            </div>
            </ThemeContext.Provider>
        </div>
    )

}

const root = createRoot(document.getElementById("root")!)
root.render(<App/>)