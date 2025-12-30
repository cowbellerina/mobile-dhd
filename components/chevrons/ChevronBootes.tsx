import * as React from "react"
import Svg, { Path, SvgProps } from "react-native-svg"

const ChevronBootes = (props: SvgProps) => (
    <Svg viewBox="0 0 72 72" {...props}>
        <Path
            d="M68 4v64H4V4h64m4-4H0v72h72V0Z"
            fill={props.color || "#333"}
        />
        <Path
            d="m38.32 9.46-1.86 3.3c7.11 7.4 16.5 18.44 21.44 22.08l-.08-5.8-19.5-19.58Zm.2 11C35.85 29.09 28.91 39.45 21 51.38l-6.9 1.7 13.56 9.46-.96-9.32c1.89-6.13 10.44-18.41 16.22-27.62l-4.4-5.14Z"
            fill={props.color || "#333"}
        />
    </Svg>
)
export default ChevronBootes