import * as React from "react"
import Svg, { Path, SvgProps } from "react-native-svg"

const ChevronCanisMinor = (props: SvgProps) => (
    <Svg viewBox="0 0 72 72" {...props}>
        <Path
            d="M68 4v64H4V4h64m4-4H0v72h72V0Z"
            fill={props.color || "#333"}
        />
        <Path
            d="M41.19 9.24 10.4 29.23l23.51 8.34-2.88 25.19L61.6 43.14l-23.33-8.28 2.92-25.61Zm-4.96 8.03-1.84 16.2-14.94-5.31 16.78-10.89Zm1.57 21.69 14.72 5.23-16.53 10.62 1.81-15.85Z"
            fill={props.color || "#333"}
        />
    </Svg>
)
export default ChevronCanisMinor