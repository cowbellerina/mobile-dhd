import * as React from "react"
import Svg, { Path, SvgProps } from "react-native-svg"

const ChevronCetus = (props: SvgProps) => (
    <Svg viewBox="0 0 72 72" {...props}>
        <Path
            d="M68 4v64H4V4h64m4-4H0v72h72V0Z"
            fill={props.color || "#333"}
        />
        <Path
            d="m47.22 12.08 1.12 3.5c.33 9.4-2.76 14.8-6.94 18.94l-23.1-2.84 8.92 28.24c4.11-3.08 10.8-5 19.18-5.6l-3.16-14.84c7.01-7.23 9.45-15.34 9.04-23.94l1.42-3.46h-6.48Zm-23 24.78 13.92 1.86 2.44 11.78c-3.62.6-7.37 1.81-10.98 3.6l-5.38-17.24Z"
            fill={props.color || "#333"}
        />
    </Svg>
)
export default ChevronCetus