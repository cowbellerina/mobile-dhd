import * as React from "react"
import Svg, { Path, SvgProps } from "react-native-svg"

const ChevronVirgo = (props: SvgProps) => (
    <Svg viewBox="0 0 72 72" {...props}>
        <Path
            d="M68 4v64H4V4h64m4-4H0v72h72V0Z"
            fill={props.color || "#333"}
        />
        <Path
            d="m45.55 9.85-13.26-.18-13.34 9.86 4.2 8.63-2.64 11.82-6.83 15.89-4.25 2.79 8.67 3.66-.02-5.38 5.39-12.79c4.37 2.25 5.92 2.07 8.9 1.03l15.67 9.16 2.48 3.26L55 51.55l-4.97-.51-13.54-7.87 2.71-12.21 18.97-13.54 4.42-.69-5.22-6.14-1.48 4-19.48 13.97-9.25-2.26c.05-8.89 4.66-11.15 5.85-12.21l5.48 2.56 7.08-6.82ZM26.8 30.84l7.81 1.88-1.82 8.4c-2.55 1.19-5.86 1.2-8-.92l2-9.35Z"
            fill={props.color || "#333"}
        />
    </Svg>
)
export default ChevronVirgo