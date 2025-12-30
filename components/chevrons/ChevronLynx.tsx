import * as React from "react"
import Svg, { Path, SvgProps } from "react-native-svg"

const ChevronLynx = (props: SvgProps) => (
    <Svg viewBox="0 0 72 72" {...props}>
        <Path
            d="M68 4v64H4V4h64m4-4H0v72h72V0Z"
            fill={props.color || "#333"}
        />
        <Path
            d="M37.27 30.86c-5.06-3.6-10.69-6.42-16.38-9.18L7.72 19.24l1.41 6.23c15.4.52 28.03 7.01 35.74 25.89l5.07-.83 7.36 2.07 6.97.15-.53-6.52-3.79 2.58-12.25-1.26-10.43-16.7Z"
            fill={props.color || "#333"}
        />
    </Svg>
)
export default ChevronLynx