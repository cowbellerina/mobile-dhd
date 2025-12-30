import * as React from "react"
import Svg, { Path, SvgProps } from "react-native-svg"

const ChevronSextans = (props: SvgProps) => (
    <Svg viewBox="0 0 72 72" {...props}>
        <Path
            d="M68 4v64H4V4h64m4-4H0v72h72V0Z"
            fill={props.color || "#333"}
        />
        <Path
            d="m9.53 10.93-1.28 9.42 6.02-1.36 21.12 5.16 2.74 4.04 3.7-9.9-4.92 2.14-21.8-5-5.58-4.5Zm35.76 22.5-3.16 2.6 4.66 7.24 3.36-2.34-4.86-7.5Zm9.68 16.34-.14 11.3 8.92-7.16-8.78-4.14Z"
            fill={props.color || "#333"}
        />
    </Svg>
)
export default ChevronSextans