import * as React from "react"
import Svg, { Path, SvgProps } from "react-native-svg"

const ChevronMonoceros = (props: SvgProps) => (
    <Svg viewBox="0 0 72 72" {...props}>
        <Path
            d="M68 4v64H4V4h64m4-4H0v72h72V0Z"
            fill={props.color || "#333"}
        />
        <Path
            d="m18.1 15.3 4-6.21 5.77 6.72 4.4 1.02 6.49 22.3 22.35-.04-2.14 13.77.02 5.9 1.55 4.13-7.91-.04 2.05-4.46 1.25-14.42-43.96-3.26-1.1-12.58 19.54 11.11 3.47-.07-6.57-18.61-4.52-4.68-4.69-.59Z"
            fill={props.color || "#333"}
        />
    </Svg>
)
export default ChevronMonoceros