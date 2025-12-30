import * as React from "react"
import Svg, { Path, SvgProps } from "react-native-svg"

const ChevronCrater = (props: SvgProps) => (
    <Svg viewBox="0 0 72 72" {...props}>
        <Path
            d="M68 4v64H4V4h64m4-4H0v72h72V0Z"
            fill={props.color || "#333"}
        />
        <Path
            d="m25.78 10.86-.58 21.28-7.8 11.9 3.42 11.98-5.42 5.1 11.48.02-1.06-7.88-2.34-7.8 5.4-10.24 12.04.02 7.9 13.88-.06 6.9-3 4.24 10.84.1-2.94-3.8.24-9.48-8.38-14.12 7.8-20.26-27.54-1.84Zm4.98 4.96 15.2.98-5.24 13.42-10.22-.14.26-14.26Z"
            fill={props.color || "#333"}
        />
    </Svg>
)
export default ChevronCrater