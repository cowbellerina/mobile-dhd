import * as React from "react"
import Svg, { Path, SvgProps } from "react-native-svg"

const ChevronEridanus = (props: SvgProps) => (
    <Svg viewBox="0 0 72 72" {...props}>
        <Path
            d="M68 4v64H4V4h64m4-4H0v72h72V0Z"
            fill={props.color || "#333"}
        />
        <Path
            d="m61.57 52.29-3.61-4.67-1.83-10.09-16.18-6.95-2.29 4.76-3.74.29-3.84-8.95-9.63-5.56-5.64 1.47-4.28-3.04-.09 7.03 2.5.07 3.87 2.8 1.86-3.38 6.12 2.96-3.03 1.52 3.09 4.72 3.31-1.7 3.57 7.01 8.53-2.63 13.3 2.04 1.73 12.46 6.28-.16Z"
            fill={props.color || "#333"}
        />
    </Svg>
)
export default ChevronEridanus