import * as React from "react"
import Svg, { Path, SvgProps } from "react-native-svg"

const ChevronAries = (props: SvgProps) => (
    <Svg viewBox="0 0 72 72" {...props}>
        <Path
            d="M68 4v64H4V4h64m4-4H0v72h72V0Z"
            fill={props.color || "#333"}
        />
        <Path
            d="M50.01 12.56 31.06 29.18l-12.79 26.5-4.39 3.02 8.62 5.83-.37-6.45 14.08-27.09 17.58-15.71 4.33-1.5-8.03-6.31-.08 5.09Z"
            fill={props.color || "#333"}
        />
    </Svg>
)
export default ChevronAries