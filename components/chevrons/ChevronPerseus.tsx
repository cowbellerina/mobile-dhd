import * as React from "react"
import Svg, { Path, SvgProps } from "react-native-svg"

const ChevronPerseus = (props: SvgProps) => (
    <Svg viewBox="0 0 72 72" {...props}>
        <Path
            d="M68 4v64H4V4h64m4-4H0v72h72V0Z"
            fill={props.color || "#333"}
        />
        <Path
            d="m21.26 36.62-2.41 18.91c2.13 5.11 10.87 3.56 9.07 2.21l-3.51-2.65-.7-3.21 1.74-14.47 7.68-12.46 7.6-2.79c1.62 4.29 2.4 21.27.78 25.48l11.62 2.31-7.25-23.3c-1.11-3.55-1.13-8.62.66-13.73l-19.59 8.97-.2 6.24-5.5 8.49Z"
            fill={props.color || "#333"}
        />
    </Svg>
)
export default ChevronPerseus