import * as React from "react"
import Svg, { Path, SvgProps } from "react-native-svg"

const ChevronEarth = (props: SvgProps) => (
  <Svg viewBox="0 0 72 72" {...props}>
    <Path
      d="M68 4v64H4V4h64m4-4H0v72h72V0Z"
      fill={props.color || "#333"}
    />
    <Path
      d="M10.4 61.6 36 27.45 61.6 61.6H45.55l5.21-6.89L36 35.11l-14.7 19.6 5.15 6.89H10.4Z"
      fill={props.color || "#333"}
    />
    <Path
      d="M36 10.4c-4.72 0-8.55 3.83-8.55 8.55S31.28 27.5 36 27.5s8.55-3.83 8.55-8.55S40.72 10.4 36 10.4Zm0 12.83c-2.36 0-4.28-1.92-4.28-4.28s1.91-4.28 4.28-4.28 4.28 1.91 4.28 4.28-1.91 4.28-4.28 4.28Z"
      fill={props.color || "#333"}
    />
  </Svg>
)
export default ChevronEarth
