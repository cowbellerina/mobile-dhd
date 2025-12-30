import * as React from "react"
import Svg, { Path, SvgProps } from "react-native-svg"

const ChevronPegasus = (props: SvgProps) => (
    <Svg viewBox="0 0 72 72" {...props}>
        <Path
            d="M68 4v64H4V4h64m4-4H0v72h72V0Z"
            fill={props.color || "#333"}
        />
        <Path
            d="m57.17 11.79.14 4.5-1.38 5.68-24.18 6.72-7.68-1.4-3.5 5.4 5.26-.06 7.26 8.78-8.68 12.64-4.12.62 5.28 5.54 1.22-3.76 9.88-13.64 16.16-.86 1.82-2.94 7-1.46 3.68-9.26-4.6-1.82-1.16 8.7-23.1 4.66-6.62-7.72 5.82-.72 23.18-6.92 1.72-8.54 2.62-2.68-6.02-1.46ZM8.71 39.25l-2.04 6.82 5.44-1.94-3.4-4.88Z"
            fill={props.color || "#333"}
        />
    </Svg>
)
export default ChevronPegasus