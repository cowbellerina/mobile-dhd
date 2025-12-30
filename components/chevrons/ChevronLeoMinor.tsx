import * as React from "react"
import Svg, { Path, SvgProps } from "react-native-svg"

const ChevronLeoMinor = (props: SvgProps) => (
    <Svg viewBox="0 0 72 72" {...props}>
        <Path
            d="M68 4v64H4V4h64m4-4H0v72h72V0Z"
            fill={props.color || "#333"}
        />
        <Path
            d="m36.77 45.24-8.55-18.02-8.15 1.18-7.83-8.79 4.8-6.56 5.52 11.1 4.54.17c.56-4.09 1.5-8.31 14.42-14.28L55.18 55.1l4.58 1.62c-1.3 2.5-4.67 5.13-6.1 5.25l-1.28-5.59-13.06-39.96-8.64 7.82 8.69 19.98 3.31 4.17-6.2 1.61.3-4.74Z"
            fill={props.color || "#333"}
        />
    </Svg>
)
export default ChevronLeoMinor