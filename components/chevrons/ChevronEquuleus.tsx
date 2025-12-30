import * as React from "react"
import Svg, { Path, SvgProps } from "react-native-svg"

const ChevronEquuleus = (props: SvgProps) => (
    <Svg viewBox="0 0 72 72" {...props}>
        <Path
            d="M68 4v64H4V4h64m4-4H0v72h72V0Z"
            fill={props.color || "#333"}
        />
        <Path
            d="m34.03 24.62-11.82-4.57.94 6.63L8.01 46.34l53.24 5.62-1.76-11.65 4.5-7.9-10.51-3.32L55 46.27l-38.77-3.38 10.68-14.53 7.12-3.74Z"
            fill={props.color || "#333"}
        />
    </Svg>
)
export default ChevronEquuleus