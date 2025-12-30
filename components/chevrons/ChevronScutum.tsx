import * as React from "react"
import Svg, { Path, SvgProps } from "react-native-svg"

const ChevronScutum = (props: SvgProps) => (
    <Svg viewBox="0 0 72 72" {...props}>
        <Path
            d="M68 4v64H4V4h64m4-4H0v72h72V0Z"
            fill={props.color || "#333"}
        />
        <Path
            d="m57.46 21.94-2.7 5.66L37.9 38.06l-26.44 3.96c-1.94.29-1.95 1.62-.04 2.08l29.18 7.1 2.86-11.86 13.86-8.46 6.04-.16-5.9-8.78Zm-18.08 6.42L25.7 31.82l.88 3.14 13.48-3.44-.68-3.16Zm-1.36 13.86-1.14 3.96-10.48-2.46 11.62-1.5Z"
            fill={props.color || "#333"}
        />
    </Svg>
)
export default ChevronScutum