import * as React from "react"
import Svg, { Path, SvgProps } from "react-native-svg"

const ChevronSculptor = (props: SvgProps) => (
    <Svg viewBox="0 0 72 72" {...props}>
        <Path
            d="M68 4v64H4V4h64m4-4H0v72h72V0Z"
            fill={props.color || "#333"}
        />
        <Path
            d="m49.98 11.23 1.18 4.66-11.61 31.87H13.1l8.25 13.02 25.15-9.29-.36-5.23 8.84-27.75 3.9-3.72-8.91-3.55Z"
            fill={props.color || "#333"}
        />
    </Svg>
)
export default ChevronSculptor