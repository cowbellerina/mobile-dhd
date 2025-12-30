import * as React from "react"
import Svg, { Path, SvgProps } from "react-native-svg"

const ChevronNorma = (props: SvgProps) => (
    <Svg viewBox="0 0 72 72" {...props}>
        <Path
            d="M68 4v64H4V4h64m4-4H0v72h72V0Z"
            fill={props.color || "#333"}
        />
        <Path
            d="m48.25 18.95-8.3 10.04 13.38 2.18-5.08-12.22ZM27.29 39.39l-8.62 12.52 13.46 1.14-4.84-13.66Z"
            fill={props.color || "#333"}
        />
    </Svg>
)
export default ChevronNorma