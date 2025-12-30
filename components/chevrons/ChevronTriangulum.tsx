import * as React from "react"
import Svg, { Path, SvgProps } from "react-native-svg"

const ChevronTriangulum = (props: SvgProps) => (
    <Svg viewBox="0 0 72 72" {...props}>
        <Path
            d="M68 4v64H4V4h64m4-4H0v72h72V0Z"
            fill={props.color || "#333"}
        />
        <Path
            d="m23.2 12.23-3 47.54 31.6-5.9-28.6-41.64Zm4.3 16.46 13.04 20.44-14.28 2.68 1.24-23.12Z"
            fill={props.color || "#333"}
        />
    </Svg>
)
export default ChevronTriangulum