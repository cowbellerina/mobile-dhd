import * as React from "react"
import Svg, { Path, SvgProps } from "react-native-svg"

const ChevronPisces = (props: SvgProps) => (
    <Svg viewBox="0 0 72 72" {...props}>
        <Path
            d="M68 4v64H4V4h64m4-4H0v72h72V0Z"
            fill={props.color || "#333"}
        />
        <Path
            d="m36.17 16.12 2.68 3.29c.87 20.4.54 23.3 11.14 36.77l-25.03-.96 2.35-2.64-15.39 3.93 7.34 5.3 2.7-2.96c12.28.58 26.04.75 38.11 2.18C42.69 46.58 43.6 34.66 43.02 19.61l2.84-.34.03-5.15-4.7-3.94-5.02 5.94Z"
            fill={props.color || "#333"}
        />
    </Svg>
)
export default ChevronPisces