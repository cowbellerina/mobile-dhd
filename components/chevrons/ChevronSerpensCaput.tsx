import * as React from "react"
import Svg, { Path, SvgProps } from "react-native-svg"

const ChevronSerpensCaput = (props: SvgProps) => (
    <Svg viewBox="0 0 72 72" {...props}>
        <Path
            d="M68 4v64H4V4h64m4-4H0v72h72V0Z"
            fill={props.color || "#333"}
        />
        <Path
            d="m65.34 28.1-5.91-4.26-.77 3.91-7.3 8.66-9.37-.86 1.52-3.84-17.45-.57-15.05 10.1-4.37.56 4.78 6.34 1.41-4.25 14.35-9.64 10.96 7.33 1.88-2.47 12.68.6 8.98-10.16 3.65-1.46Z"
            fill={props.color || "#333"}
        />
    </Svg>
)
export default ChevronSerpensCaput