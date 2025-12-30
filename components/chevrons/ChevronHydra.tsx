import * as React from "react"
import Svg, { Path, SvgProps } from "react-native-svg"

const ChevronHydra = (props: SvgProps) => (
    <Svg viewBox="0 0 72 72" {...props}>
        <Path
            d="M68 4v64H4V4h64m4-4H0v72h72V0Z"
            fill={props.color || "#333"}
        />
        <Path
            d="m18.93 14.95-6.82 3.32-.68 4.46 4.74.36 2.66-2.84 1.58.06 10.5 8.5 1.72 3.04 3.28-3.76-3.34-1.1-13.64-12.04Zm11.14 20.88-4.92 4.12 5 5.04-.08-9.16Zm3.7 7.42-1.8 2.36 2.84 2.48 2.08-2.64-3.12-2.2Zm13.74 1.64-9.22 2.44.2 7.46 5.3-5.18 2-.88 3.76 4.32.16 3.92 10.86.08-.16-5.14-8.66.04-4.24-7.06Z"
            fill={props.color || "#333"}
        />
    </Svg>
)
export default ChevronHydra