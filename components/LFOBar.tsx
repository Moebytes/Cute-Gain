import React, {useState, useRef, useEffect, useContext} from "react"
import {ThemeContext} from "../index"
import withJuceSlider, {WithJUCESliderProps} from "./withJuceSlider"
import withJuceComboBox, {WithJUCEComboBoxProps} from "./withJuceComboBox"
import withJuceToggleButton, {WithJUCEToggleButtonProps} from "./withJuceToggleButton"
import MiniKnob from "./MiniKnob"
import functions from "../structures/Functions"
import SquareWaveIcon from "../assets/square-wave.svg"
import SineWaveIcon from "../assets/sine-wave.svg"
import SawWaveIcon from "../assets/saw-wave.svg"
import TriangleWaveIcon from "../assets/triangle-wave.svg"
import MusicNoteIcon from "../assets/music-note.svg"
import FlipArrowIcon from "../assets/flip-arrow.svg"
import "./styles/lfobar.scss"

interface LFOTypeProps {
    parameterID: string
    label: string
    color: string
}

const LFOBarType: React.FunctionComponent<LFOTypeProps & WithJUCEComboBoxProps> = ({color, label, parameterID, value, onChange}) => {
    const {theme, setTheme} = useContext(ThemeContext)
    
    const getSelectFilter= () => {
        return theme === "light" ? "brightness(0) invert(0)" : "brightness(0) invert(1)"
    }

    const filter = functions.calculateFilter(color)

    const waves = {
        square: <SquareWaveIcon className="wave-icon" style={{filter}}/>,
        saw: <SawWaveIcon className="wave-icon" style={{filter}}/>,
        triangle: <TriangleWaveIcon className="wave-icon" style={{filter}}/>,
        sine: <SineWaveIcon className="wave-icon" style={{filter}}/>
    }

    const wavesJSX = () => {
        let jsx = [] as React.ReactElement[]

        for (let i = 0; i < Object.entries(waves).length; i++) {
            const [wave, img] = Object.entries(waves)[i]
            jsx.push(
                <div key={`${parameterID}-${i}`}
                    className={`wave-option ${value === i ? "selected" : ""}`}
                    onClick={() => onChange(i)}
                    style={{filter: value === i ? getSelectFilter() : ""}}>
                    {img}
                </div>
            )
        }

        return jsx
    }

    return (
        <>
        <span className="lfobar-label" style={{color}}>{`${label} LFO`}</span>
        <div className="lfobar-waves" style={{borderColor: color}}>{wavesJSX()}</div>
        </>
    )
}

interface LFORateProps {
    parameterID: string
    color: string
}

const LFOBarRate: React.FunctionComponent<LFORateProps & WithJUCESliderProps> = ({color, value, onChange}) => {
    const allowedNumerators = [1, 2, 3, 4]
    const allowedDenominators = [1, 2, 4, 8, 16, 32]
    const initialValue = functions.getFraction(value, allowedNumerators, allowedDenominators)

    const [numerator, setNumerator] = useState(initialValue.numerator)
    const [denominator, setDenominator] = useState(initialValue.denominator)
    const dragPart = useRef("")
    const dragAcc = useRef(0)

    const filter = functions.calculateFilter(color)

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!dragPart.current) return
        
            dragAcc.current += e.movementY
            const threshold = 10
        
            if (dragAcc.current <= -threshold) {
                if (dragPart.current === "numerator") {
                    setNumerator(prev => {
                        const i = allowedNumerators.indexOf(prev)
                        return allowedNumerators[Math.min(allowedNumerators.length - 1, i + 1)]
                    })
                } else if (dragPart.current === "denominator") {
                    setDenominator(prev => {
                        const i = allowedDenominators.indexOf(prev)
                        return allowedDenominators[Math.min(allowedDenominators.length - 1, i + 1)]
                    })
                }
                dragAcc.current = 0
            }
        
            if (dragAcc.current >= threshold) {
                if (dragPart.current === "numerator") {
                    setNumerator(prev => {
                        const i = allowedNumerators.indexOf(prev)
                        return allowedNumerators[Math.max(0, i - 1)]
                    })
                } else if (dragPart.current === "denominator") {
                    setDenominator(prev => {
                        const i = allowedDenominators.indexOf(prev)
                        return allowedDenominators[Math.max(0, i - 1)]
                    })
                }
                dragAcc.current = 0
            }
        }

        const handleMouseUp = () => {
            dragPart.current = ""
            dragAcc.current = 0
        }

        window.addEventListener("mousemove", handleMouseMove)
        window.addEventListener("mouseup", handleMouseUp)
        return () => {
            window.removeEventListener("mousemove", handleMouseMove)
            window.removeEventListener("mouseup", handleMouseUp)
        }
    }, [])

    useEffect(() => {
        onChange(numerator / denominator)
    }, [numerator, denominator])

    useEffect(() => {
        const fraction = functions.getFraction(value, allowedNumerators, allowedDenominators)
        setNumerator(fraction.numerator)
        setDenominator(fraction.denominator)
    }, [value])

    return (
        <div className="lfobar-rate">
            <span className="lfobar-rate-part" onMouseDown={() => (dragPart.current = "numerator")}>
                {numerator}
            </span>
            <span className="lfobar-rate-slash">/</span>
            <span className="lfobar-rate-part" onMouseDown={() => (dragPart.current = "denominator")}>
                {denominator}
            </span>
            <MusicNoteIcon className="lfobar-rate-icon" style={{filter}}/>
        </div>
    )
}

interface LFOInvertProps {
    parameterID: string
    color: string
    theme: string
}

const LFOBarInvert: React.FunctionComponent<LFOInvertProps & WithJUCEToggleButtonProps> = ({color, theme, value, onChange}) => {
    let onFilter = theme === "dark" ? "invert(1)" : "invert(0)"
    const filter = value ? onFilter : functions.calculateFilter(color)

    return (
        <FlipArrowIcon className="lfobar-arrow-icon" style={{filter}} onClick={() => onChange(!value)}/>
    )
}

interface Props {
    lfoTypeID: string
    lfoRateID: string
    lfoAmountID: string
    lfoInvertID: string
    label: string
    color: string
    theme: string
    style?: React.CSSProperties
}

const LFOBarTypeCombo = withJuceComboBox(LFOBarType)
const LFOBarRateSlider = withJuceSlider(LFOBarRate)
const LFOBarInvertButton = withJuceToggleButton(LFOBarInvert)

const LFOBar: React.FunctionComponent<Props> = ({lfoTypeID, lfoRateID, lfoAmountID, lfoInvertID, label, color, theme}) => {
    return (
        <div className="lfobar-container">
            <LFOBarTypeCombo parameterID={lfoTypeID} color={color} label={label}/>
            <LFOBarRateSlider parameterID={lfoRateID} color={color}/>
            <MiniKnob parameterID={lfoAmountID} color={color} label={label}/>
            <LFOBarInvertButton parameterID={lfoInvertID} color={color} theme={theme}/>
        </div>
    )    
}

export default LFOBar