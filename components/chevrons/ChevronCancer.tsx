import * as React from "react"
import Svg, { Path, SvgProps } from "react-native-svg"

const ChevronCancer = (props: SvgProps) => (
    <Svg viewBox="0 0 72 72" {...props}>
        <Path
            d="M68 4v64H4V4h64m4-4H0v72h72V0Z"
            fill={props.color || "#333"}
        />
        <Path
            d="m9.49 21.39-1.76 7.5c16.39.37 25.9 6.5 30.52 16.72l.24 5 7.56-.02-4.36-5.72c-8.73-15.56-18.9-18.03-29.1-20.18l-3.1-3.3Zm49.06 5.04-1.76 6.08 7.48-1.3-5.72-4.78Z"
            fill={props.color || "#333"}
        />
    </Svg>
)
export default ChevronCancer