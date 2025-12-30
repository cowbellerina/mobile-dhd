import * as React from "react"
import Svg, { Path, SvgProps } from "react-native-svg"

const ChevronAndromeda = (props: SvgProps) => (
    <Svg viewBox="0 0 72 72" {...props}>
        <Path
            d="M68 4v64H4V4h64m4-4H0v72h72V0Z"
            fill={props.color || "#333"}
        />
        <Path
            d="m27.51 21.14 2.06 2.62 1.7 9.67-1.05 2.8 2.11 2.65 2.02 10.71L46.37 61.6l-2.61-23.39 3.21-4.27-6.53-1.62 1.02 14.27-3.62.07-1.89-8.34 1.28-2.62-4.76-12.75 1.17-3.55-1.7-1.83-1.01-7.16-5.91 1.61 3.15 5.24-.66 3.88Z"
            fill={props.color || "#333"}
        />
    </Svg>
)
export default ChevronAndromeda