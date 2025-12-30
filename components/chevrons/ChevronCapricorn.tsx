import * as React from "react"
import Svg, { Path, SvgProps } from "react-native-svg"

const ChevronCapricorn = (props: SvgProps) => (
    <Svg viewBox="0 0 72 72" {...props}>
        <Path
            d="M68 4v64H4V4h64m4-4H0v72h72V0Z"
            fill={props.color || "#333"}
        />
        <Path
            d="M52.58 10.76C40.98 16.22 27.14 21 13.22 25.62l1.82 3.58 5.5-1.46c5.79 6.74 15.92 14.49 29.64 27.38l1.7 6.12 6.9-3.46-3.04-4.02.56-28.82-3.72-14.18ZM49.5 17.3l1.92 9.38-.32 22.08C41.88 41.17 33.04 33.8 25.72 26.9l23.78-9.6Z"
            fill={props.color || "#333"}
        />
    </Svg>
)
export default ChevronCapricorn