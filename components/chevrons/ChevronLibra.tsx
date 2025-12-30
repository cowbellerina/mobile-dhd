import * as React from "react"
import Svg, { Path, SvgProps } from "react-native-svg"

const ChevronLibra = (props: SvgProps) => (
    <Svg viewBox="0 0 72 72" {...props}>
        <Path
            d="M68 4v64H4V4h64m4-4H0v72h72V0Z"
            fill={props.color || "#333"}
        />
        <Path
            d="m46.19 13.37-2.21 4.33-19.8 1.1-8.9 18.62 10.15 21.22 17.5-13.31 13.79 2.96-2.12-4.35 1.82-4.18-16.26 1.04L27.6 51.97l-.03-29.23 20.94-2.17 4.96-5.42-7.28-1.78Z"
            fill={props.color || "#333"}
        />
    </Svg>
)
export default ChevronLibra