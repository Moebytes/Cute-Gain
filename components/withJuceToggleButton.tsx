import React, {useEffect, useState} from "react"
import * as JUCE from "juce-framework-frontend-mirror"

interface JUCEToggleProperties {
    name: string
}

export interface WithJUCEToggleButtonProps {
    value: boolean
    properties: JUCEToggleProperties
    onChange: (value: boolean) => void
    reset: () => void
}

interface WithParameter {
    parameterID: string
}

const getDefaultParameter = JUCE.getNativeFunction("getDefaultParameter")

const withJuceToggleButton = <Props extends object & WithParameter>(
    WrappedComponent: React.ComponentType<Props & WithJUCEToggleButtonProps>, 
): React.FunctionComponent<Props> => {

    const JuceToggleButton: React.FunctionComponent<Props> = (props) => {
        const {parameterID} = props
        const toggleState = JUCE.getToggleState(parameterID)!
        const [properties, setProperties] = useState(toggleState.properties)
        const [value, setValue] = useState(toggleState.getValue())

        useEffect(() => {
            setValue(toggleState.getValue())
            setProperties(toggleState.properties)
        }, [])
    
        useEffect(() => {
            const valueID = toggleState.valueChangedEvent.addListener(() => {
                setValue(toggleState.getValue())
            })
            const propsID = toggleState.propertiesChangedEvent.addListener(() => {
                setProperties(toggleState.properties)
            })
            return () => {
                toggleState.valueChangedEvent.removeListener(valueID)
                toggleState.propertiesChangedEvent.removeListener(propsID)
            }
        }, [])
    
        const handleChange = (value: boolean) => {
            toggleState.setValue(value)
            setValue(value)
        }
    
        const handleReset = async () => {
            const defaultValue = await getDefaultParameter(parameterID)
            handleChange(defaultValue)
        }
    
        return (
            <WrappedComponent
                {...props}
                value={value}
                properties={properties}
                onChange={handleChange}
                reset={handleReset}
            />
        )
    }

    return JuceToggleButton
}

export default withJuceToggleButton