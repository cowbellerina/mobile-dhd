import * as React from "react"
import Svg, { Path, SvgProps } from "react-native-svg"

const ChevronCra = (props: SvgProps) => (
    <Svg viewBox="0 0 72 72" {...props}>
        <Path
            d="M68 4v64H4V4h64m4-4H0v72h72V0Z"
            fill={props.color || "#333"}
        />
        <Path
            d="m46.31 16.01-8.96 11.52.44 1.74c4.84-.39 13.26 2.72 13.24 10.94-.02 8.3-8.56 11.52-16.64 11.42l.04 4.34 8.46.02c8.92.02 13.71-9.63 13.78-16.18.07-6.63-4.73-10.86-8.94-12.96l-1.42-10.84ZM22.69 40.33l-7.36 12.66h13.7l-6.34-12.66Z"
            fill={props.color || "#333"}
        />
    </Svg>
)
export default ChevronCra