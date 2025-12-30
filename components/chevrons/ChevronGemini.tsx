import * as React from "react"
import Svg, { Path, SvgProps } from "react-native-svg"

const ChevronGemini = (props: SvgProps) => (
    <Svg viewBox="0 0 72 72" {...props}>
        <Path
            d="M68 4v64H4V4h64m4-4H0v72h72V0Z"
            fill={props.color || "#333"}
        />
        <Path
            d="m30.85 16.81-6.42.18.68 4.46-9.7 14-5.06 2.06 6.56 4.64 3.2-7 29.6 20.04 3.66-3.24 3.78-1.36 1.42-7.92 3.02-1.08.06-5-4.5 2.5-27.28-18.04.98-4.24Zm-3.32 7.44 28.1 17.8-5.92 8.48-27.84-18.68 5.66-7.6Z"
            fill={props.color || "#333"}
        />
    </Svg>
)
export default ChevronGemini