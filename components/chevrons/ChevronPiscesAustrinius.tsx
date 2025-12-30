import * as React from "react"
import Svg, { Path, SvgProps } from "react-native-svg"

const ChevronPiscesAustrinius = (props: SvgProps) => (
    <Svg viewBox="0 0 72 72" {...props}>
        <Path
            d="M68 4v64H4V4h64m4-4H0v72h72V0Z"
            fill={props.color || "#333"}
        />
        <Path
            d="M41.65 20.63 35.77 9.39l-7.98 6.15-4.46 24.96 1.94 12.85 13.58 9.25 9.79-6.51-.31-8.04-5.3-13.72-1.39-13.7Zm-8.3-4.13c1.39-1.19 1.74-1.15 2.45.35 1.02 2.16 2.61 5.69 2.69 19.68 1.74 4.75 5.25 12.02 5.21 14.25l-13.93-.12-2.13-9.28 3.69-23.14 2.02-1.73Z"
            fill={props.color || "#333"}
        />
    </Svg>
)
export default ChevronPiscesAustrinius