import * as React from "react"
import Svg, { Path, SvgProps } from "react-native-svg"

const ChevronPlaceholder = (props: SvgProps) => (
    <Svg viewBox="0 0 72 72" {...props}>
        <Path
            d="M68 4v64H4V4h64m4-4H0v72h72V0Z"
            fill={props.color || "#333"}
        />
    </Svg>
)
export default ChevronPlaceholder