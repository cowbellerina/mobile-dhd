import * as React from "react"
import Svg, { Path, SvgProps } from "react-native-svg"

const ChevronLeo = (props: SvgProps) => (
    <Svg viewBox="0 0 72 72" {...props}>
        <Path
            d="M68 4v64H4V4h64m4-4H0v72h72V0Z"
            fill={props.color || "#333"}
        />
        <Path
            d="m61.6 26.28-6.82-2.54c-15.99 5.04-27.7 14.38-36.42 25.94l.17 6.19-8.13-5.58 5.3-2.36c8.07-11.2 18.16-21.52 38.41-27.36l5.27-4.43 2.22 10.14Z"
            fill={props.color || "#333"}
        />
    </Svg>
)
export default ChevronLeo