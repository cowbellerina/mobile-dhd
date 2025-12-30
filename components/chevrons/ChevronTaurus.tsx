import * as React from "react"
import Svg, { Path, SvgProps } from "react-native-svg"

const ChevronTaurus = (props: SvgProps) => (
    <Svg viewBox="0 0 72 72" {...props}>
        <Path
            d="M68 4v64H4V4h64m4-4H0v72h72V0Z"
            fill={props.color || "#333"}
        />
        <Path
            d="m61.92 25.44-3.94 3.18c-18.86 1.39-36.26 2.8-44.76 4.4l-4.79-1.47 1.05 7.84 3.68-2.79 17.64-1.82c2.93 2.97 17.03 9.3 27.36 9.42l5.27 2.35-.03-5.92c-10.85-.52-17.89-3.3-23.68-6.41l19.32-1.41 4.54.9-1.66-8.27Z"
            fill={props.color || "#333"}
        />
    </Svg>
)
export default ChevronTaurus