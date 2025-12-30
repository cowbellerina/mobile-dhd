import * as React from "react"
import Svg, { Path, SvgProps } from "react-native-svg"

const ChevronCentaurus = (props: SvgProps) => (
    <Svg viewBox="0 0 72 72" {...props}>
        <Path
            d="M68 4v64H4V4h64m4-4H0v72h72V0Z"
            fill={props.color || "#333"}
        />
        <Path
            d="m47.8 11.44.84 6.18-4.22 17.8-13.88-2.9-2.46-5.12-4.02 11.1 6-2.74 14.5 3.52c1.05 3.64 2.43 10.06 3.02 16.22l-1 5.06 8.24-1.6-3.4-4.02c-.45-5.65-1.8-12.08-2.74-16.82l3.2-19.4 4.32-5.18-8.4-2.1Zm-9.86 30.52-11.16 7.16 2.88 3.24 10.64-6.98-2.36-3.42Zm-14.2 10.22-7.94.34c2.15 2.58 4.84 5.22 7.86 7.58.29-2.64.62-5.28.08-7.92Z"
            fill={props.color || "#333"}
        />
    </Svg>
)
export default ChevronCentaurus