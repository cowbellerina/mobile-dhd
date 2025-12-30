import * as React from "react"
import Svg, { Path, SvgProps } from "react-native-svg"

const ChevronAuriga = (props: SvgProps) => (
    <Svg viewBox="0 0 72 72" {...props}>
        <Path
            d="M68 4v64H4V4h64m4-4H0v72h72V0Z"
            fill={props.color || "#333"}
        />
        <Path
            d="m50.14 17.08-4.74 3.44-16.36 1.88-10.64-3.9-9.36 9.1 3 3.18.34 14.42 18.72 5.84 4 3.88 2.46-7.46-7-.04-14.48-4.64-.2-12.18 10.14-3.92 18.92-2.3 5.66 2.98-.46-10.28Zm6.24 16.82.28 8.3 6.3-4.52-6.58-3.78Z"
            fill={props.color || "#333"}
        />
    </Svg>
)
export default ChevronAuriga