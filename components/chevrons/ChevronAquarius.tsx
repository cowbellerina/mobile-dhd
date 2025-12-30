import * as React from "react"
import Svg, { Path, SvgProps } from "react-native-svg"

const ChevronAquarius = (props: SvgProps) => (
    <Svg viewBox="0 0 72 72" {...props}>
        <Path
            d="M68 4v64H4V4h64m4-4H0v72h72V0Z"
            fill={props.color || "#333"}
        />
        <Path
            d="m28.69 18.96-15.38 8.07 7.5 4.62.31 6.21-8.85 8.21-4.04 1.12 4.64 5.85 1.62-3.6 10.13-10.27-.06-9.7-3.41-2.21 7.71-4.46c3.14-.15 2.08 2.63 9.96 1.97l-2.33 8.33.73 6.65-2.04 5.65 6.47-1.9-1.57-10.52 3.09-7.39 13.86 12.44.85 4.01 5.9-5.66-3.98-.68-17.16-15.92c-5.64 3.29-10.19-.8-13.95-.83Z"
            fill={props.color || "#333"}
        />
    </Svg>
)
export default ChevronAquarius