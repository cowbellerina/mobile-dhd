import * as React from "react"
import Svg, { Path, SvgProps } from "react-native-svg"

const ChevronMic = (props: SvgProps) => (
    <Svg viewBox="0 0 72 72" {...props}>
        <Path
            d="M68 4v64H4V4h64m4-4H0v72h72V0Z"
            fill={props.color || "#333"}
        />
        <Path
            d="m16.25 15.55.76 5.68-4.18 35.22 9.32-2.96 29.16-3.34 7.86 2.48-2.16-11-5.06 3.78-29.94 3.04-3.06.82 3.04-27.68 4.08-3.92-9.82-2.12Zm23.28 8.76-1.04 10.5 12.04-4.1-11-6.4Z"
            fill={props.color || "#333"}
        />
    </Svg>
)
export default ChevronMic