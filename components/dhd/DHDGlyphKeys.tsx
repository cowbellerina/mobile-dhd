import React from 'react';
import { G, Path } from 'react-native-svg';
import { DHDKey } from './DHDKey';

/**
 * Props for the DHDGlyphKeys component
 */
interface DHDGlyphKeysProps {
  /** Array of glyph slugs that have been dialed */
  dialedSlugs: string[];
  /** Callback invoked when a glyph is pressed */
  onGlyphPress: (slug: string) => void;
}

/**
 * DHDGlyphKeys component - contains all 38 glyph keys arranged around the DHD
 */
export const DHDGlyphKeys: React.FC<DHDGlyphKeysProps> = React.memo(({ dialedSlugs, onGlyphPress}) => {
  return (
    <G>
                <DHDKey slug="andromeda" active={dialedSlugs.includes("andromeda")} onPress={onGlyphPress}>
                    <Path
                        d="m0 0 1.789.942c27.879 14.696 57.594 24.895 88.317 30.313l1.988.35 13.952-83.625-1.944-.349c-21.557-3.877-42.424-11.028-62.021-21.256l-1.747-.912z"
                        fill="url(#brushedMetal)" fillOpacity={1} fillRule="nonzero" stroke="none"
                        transform="translate(176.502 907.987)"
                    />
                    <Path
                        d="M0 0c26.39 13.687 54.415 23.307 83.368 28.617l12.638-75.748c-20.627-3.902-40.615-10.753-59.471-20.385Z"
                        fill="url(#metallicHighlight)" fillOpacity={1} fillRule="nonzero" stroke="none"
                        transform="translate(181.948 906.328)"
                    />
                    <Path
                        d="m0 0 3.958-.292 9.86-6.254 1.616-3.166 4.024-.271 11.033-6.81 20.18.932L28.022.596l-1.183 6.245-6.653-4.438 13.353-10.54-2.836-3.235-8.841 5.023-1.275 3.223L5.568 2.915l-2.18 3.877-2.971-.03-7.101 4.858-3.319-6.487 7.128-1.44z"
                        fill="#505050" fillOpacity={1} fillRule="nonzero" stroke="none"
                        transform="translate(214.073 888.104)"
                    />
                </DHDKey>

                <DHDKey slug="pegasus" active={dialedSlugs.includes("pegasus")} onPress={onGlyphPress}>
                    <Path
                        d="m0 0 1.378 1.473c21.32 22.766 46.091 42.078 73.627 57.398l1.768.984 40.335-74.537-1.715-.964C96.129-26.473 78.747-40.044 63.73-55.983l-1.355-1.439z"
                        fill="url(#brushedMetal)" fillOpacity={1} fillRule="nonzero" stroke="none"
                        transform="translate(97.159 846.739)"
                    />
                    <Path
                        d="M0 0c20.261 21.342 43.627 39.557 69.502 54.18l36.537-67.517c-18.36-10.531-35.01-23.53-49.54-38.676z"
                        fill="url(#metallicHighlight)" fillOpacity={1} fillRule="nonzero" stroke="none"
                        transform="translate(102.84 846.945)"
                    />
                    <Path
                        d="m0 0-5.511 3.286.497-5.182zm13.321-48.404-3.962.87-4.66 2.457-.546 22.614 2.916 6.404-3.948 4.248-1.107-4.61-9.273-4.412-9.134 10.374.365 3.737-6.005-3.394 3.017-1.896 9.745-11.64-2.811-14.312 2.169-2.239-.266-6.44 7.283-5.256 2.603 3.619-7.347 2.93 1.016 21.217 8.207 4.084-.653-5.245.94-21.785 7.085-3.383 1.764-2.881z"
                        fill="#505050" fillOpacity={1} fillRule="nonzero" stroke="none"
                        transform="translate(162.903 872.045)"
                    />
                </DHDKey>

                <DHDKey slug="earth" active={dialedSlugs.includes("earth")} onPress={onGlyphPress}>
                    <Path
                        d="m0 0 .817 1.837C13.578 30.518 30.604 56.874 51.423 80.17l1.353 1.514L115.14 24.27l-1.298-1.469C99.348 6.403 87.434-12.115 78.429-32.238l-.811-1.812z"
                        fill="url(#brushedMetal)" fillOpacity={1} fillRule="nonzero" stroke="none"
                        transform="translate(42.413 762.898)"
                    />
                    <Path
                        d="M0 0c12.216 26.971 28.274 51.832 47.763 73.941l56.495-52.01C90.509 6.092 79.097-11.643 70.301-30.841Z"
                        fill="url(#metallicHighlight)" fillOpacity={1} fillRule="nonzero" stroke="none"
                        transform="translate(47.708 764.943)"
                    />
                    <Path
                        d="M0 0a3.808 3.808 0 0 0-5.271-1.116 3.81 3.81 0 1 0 4.154 6.388A3.813 3.813 0 0 0 0 0m-9.583 6.232A7.618 7.618 0 0 1-7.351-4.309 7.624 7.624 0 0 1 3.195-2.077 7.62 7.62 0 0 1 .96 8.468 7.62 7.62 0 0 1-9.583 6.232"
                        fill="#505050" fillOpacity={1} fillRule="nonzero" stroke="none"
                        transform="translate(92.859 785.694)"
                    />
                    <Path
                        d="m0 0-13.079 35.718 37.954 2.534-7.799-11.989-2.613 7.239-21.817-1.507L.151 11.488l7.644.504Z"
                        fill="#505050" fillOpacity={1} fillRule="nonzero" stroke="none"
                        transform="translate(109.09 747.926)"
                    />
                </DHDKey>

                <DHDKey slug="monoceros" active={dialedSlugs.includes("monoceros")} onPress={onGlyphPress}>
                    <Path
                        d="m0 0 .176 2.002a303.05 303.05 0 0 0 22.282 90.361l.784 1.878 77.618-34.05-.741-1.806a218.153 218.153 0 0 1-15.47-63.407l-.177-1.98z"
                        fill="url(#brushedMetal)" fillOpacity={1} fillRule="nonzero" stroke="none"
                        transform="translate(18.014 665.974)"
                    />
                    <Path
                        d="M0 0a298.934 298.934 0 0 0 21.027 85.286l70.315-30.847a222.088 222.088 0 0 1-14.835-60.78Z"
                        fill="url(#metallicHighlight)" fillOpacity={1} fillRule="nonzero" stroke="none"
                        transform="translate(22.357 669.627)"
                    />
                    <Path
                        d="m0 0 3.989 5.329 4.764-6.408 3.896-1.195 4.434-20.459L37.18-24.1l-2.792-12.244-.348-5.307 1.134-3.814-7.107.536 2.124 3.881 2.028 12.884-39.322 5.69-.198 11.379 16.87-11.216 3.12-.159L7.95-5.319 4.177-.823z"
                        fill="#505050" fillOpacity={1} fillRule="nonzero" stroke="none"
                        transform="translate(54.024 722.092)"
                    />
                </DHDKey>

                <DHDKey slug="centaurus" active={dialedSlugs.includes("centaurus")} onPress={onGlyphPress}>
                    <Path
                        d="M0 0c-7.563 30.166-10.373 61.276-8.352 92.467l.131 2.033 84.482-7.003-.113-1.947c-1.262-21.849.769-43.635 6.036-64.752l.483-1.934L.487-1.944Z"
                        fill="url(#brushedMetal)" fillOpacity={1} fillRule="nonzero" stroke="none"
                        transform="translate(26.01 568.56)"
                    />
                    <Path
                        d="M0 0c-6.939 28.498-9.589 57.833-7.884 87.257l76.536-6.344c-1.026-20.932.916-41.791 5.779-62.066Z"
                        fill="url(#metallicHighlight)" fillOpacity={1} fillRule="nonzero" stroke="none"
                        transform="translate(29.41 571.48)"
                    />
                    <Path
                        d="m0 0-2.36-6.763a47.378 47.378 0 0 1 8.966 4.058C4.492-1.587 2.392-.423 0 0m-3.828 15.297L-1.55 3.563l3.673 1.335-2.3 11.235zm-22.275 18.426 5.456-1.355 13.501-9.467-7.053-10.658-5.107-.353 7.955-7.065-.294 5.939 7.779 10.968c3.4-.334 9.232-1.31 14.589-2.874l3.905-2.522 1.406 7.434-4.501-1.508C6.655 23.765.817 24.779-3.466 25.57l-15.18 9.144-2.9 5.345z"
                        fill="#505050" fillOpacity={1} fillRule="nonzero" stroke="none"
                        transform="translate(64.731 599.666)"
                    />
                </DHDKey>

                <DHDKey slug="scorpio" active={dialedSlugs.includes("scorpio")} onPress={onGlyphPress}>
                    <Path
                        d="M0 0a307.754 307.754 0 0 0-12.275 20.687C-23.243 40.953-31.881 62.396-37.95 84.42l-.543 1.969 82.205 20.813.531-1.87a218.443 218.443 0 0 1 18.026-44.308 221.189 221.189 0 0 1 8.7-14.684l1.08-1.671L1.091-1.686Z"
                        fill="url(#brushedMetal)" fillOpacity={1} fillRule="nonzero" stroke="none"
                        transform="translate(65.73 477.401)"
                    />
                    <Path
                        d="M0 0a302.815 302.815 0 0 0-11.029 18.728C-21.526 38.123-29.86 58.61-35.816 79.652l74.477 18.857a222.537 222.537 0 0 1 17.818-43.252 224.809 224.809 0 0 1 7.786-13.275z"
                        fill="url(#metallicHighlight)" fillOpacity={1} fillRule="nonzero" stroke="none"
                        transform="translate(68.002 481.265)"
                    />
                    <Path
                        d="M0 0c-23.095-10.854-32.877-3.229-36.25 4.54l6.996 3.441 5.471-2.264-4.025 9.884-2.296-3.97c-2.392-1.579-9.068-4.975-21.15-6.483l3.84-7.904 7.67 5.398c6.759-13.967 22.523-14.995 37.411-7.981l4.442-9.22-5.045-3.967-6.013 3.589-3.976-5.704c1.084-.513 3.427.075 4.894.803l5.669-3.001 9.21 6.874z"
                        fill="#505050" fillOpacity={1} fillRule="nonzero" stroke="none"
                        transform="translate(103.307 539.459)"
                    />
                </DHDKey>

                <DHDKey slug="sculptor" active={dialedSlugs.includes("sculptor")} onPress={onGlyphPress}>
                    <Path
                        d="M0 0a299.923 299.923 0 0 0-63.033 67.415L-64.18 69.1l70.981 46.371 1.108-1.603a215.674 215.674 0 0 1 44.176-46.979l1.565-1.23L1.579-1.237Z"
                        fill="url(#brushedMetal)" fillOpacity={1} fillRule="nonzero" stroke="none"
                        transform="translate(132.61 404.178)"
                    />
                    <Path
                        d="M0 0a295.891 295.891 0 0 0-59.465 63.593l64.308 42.011A219.612 219.612 0 0 1 47.162 60.59Z"
                        fill="url(#metallicHighlight)" fillOpacity={1} fillRule="nonzero" stroke="none"
                        transform="translate(133.502 408.57)"
                    />
                    <Path
                        d="m0 0-3.587-2.432-30.569.072-8.119 22.418-8.496-10.987 15.586-18.469 4.322 1.911 26.235 1.013 4.352-2.165z"
                        fill="#505050" fillOpacity={1} fillRule="nonzero" stroke="none"
                        transform="translate(156.327 466.244)"
                    />
                </DHDKey>

                <DHDKey slug="bootes" active={dialedSlugs.includes("bootes")} onPress={onGlyphPress}>
                    <Path
                        d="M0 0a302.028 302.028 0 0 0-81.265 43.199l-1.634 1.221 52.077 66.905 1.568-1.153a217.336 217.336 0 0 1 56.803-30.009l1.874-.658L1.898-.662Z"
                        fill="url(#brushedMetal)" fillOpacity={1} fillRule="nonzero" stroke="none"
                        transform="translate(219.41 356.741)"
                    />
                    <Path
                        d="M0 0a297.968 297.968 0 0 0-76.655 40.742l47.18 60.614A221.367 221.367 0 0 1 24.93 72.61Z"
                        fill="url(#metallicHighlight)" fillOpacity={1} fillRule="nonzero" stroke="none"
                        transform="translate(218.832 361.188)"
                    />
                    <Path
                        d="M0 0c8.678-5.014 18.156-15.066 29.105-26.563l.137-7.875 13.57 12.324L32.5-20.853C26.341-17.297 15.176-5.029 6.641 3.49Zm-11.94 2.495 3.109-2.822c9.76 5.866 24.005 13.298 29.154 17.733l-6.29 1.346z"
                        fill="#505050" fillOpacity={1} fillRule="nonzero" stroke="none"
                        transform="translate(182.634 423.366)"
                    />
                </DHDKey>

                <DHDKey slug="virgo" active={dialedSlugs.includes("virgo")} onPress={onGlyphPress}>
                    <Path
                        d="M0 0a302.74 302.74 0 0 0-90.643 14.71l-1.937.627 27.531 80.186 1.861-.588A217.812 217.812 0 0 1 .044 84.778l1.977-.023L2.018-.018Z"
                        fill="url(#brushedMetal)" fillOpacity={1} fillRule="nonzero" stroke="none"
                        transform="translate(316.656 339.807)"
                    />
                    <Path
                        d="M0 0a298.707 298.707 0 0 0-85.49 13.871l24.941 72.645a221.844 221.844 0 0 1 60.552-9.73z"
                        fill="url(#metallicHighlight)" fillOpacity={1} fillRule="nonzero" stroke="none"
                        transform="translate(314.674 343.831)"
                    />
                    <Path
                        d="m0 0-6.986 1.92 1.88 7.513c2.329 1 5.311.912 7.179-1.065zm-17.493-18.364 11.939-.546 12.3 8.499-3.534 7.895 2.724 10.57 6.611 14.117 3.915 2.393-7.705 3.55-.135-4.851-5.226-11.361c-3.867 2.156-5.274 2.04-7.985 1.186l-13.851 8.709-2.138 3.011-4.208-5.318 4.462-.6 11.972-7.485L-11.15.482l-17.484-11.644-4.001-.495 4.53-5.678 1.452 3.565L-8.697-1.754l8.263-2.303c-.3-8.006-4.517-9.905-5.629-10.833l-4.858 2.464z"
                        fill="#505050" fillOpacity={1} fillRule="nonzero" stroke="none"
                        transform="translate(284.48 385.163)"
                    />
                </DHDKey>

                <DHDKey slug="pisces" active={dialedSlugs.includes("pisces")} onPress={onGlyphPress}>
                    <Path
                        d="m0 0 1.96.04a215.604 215.604 0 0 1 63.027 10.729l1.875.615 27.522-80.176-1.915-.638A299.723 299.723 0 0 0 2.023-84.737l-2.028-.03z"
                        fill="url(#brushedMetal)" fillOpacity={1} fillRule="nonzero" stroke="none"
                        transform="translate(321.6 424.565)"
                    />
                    <Path
                        d="M0 0a219.652 219.652 0 0 1 60.357 10.272l24.93-72.626A295.701 295.701 0 0 0-.005-76.789Z"
                        fill="url(#metallicHighlight)" fillOpacity={1} fillRule="nonzero" stroke="none"
                        transform="translate(325.6 420.652)"
                    />
                    <Path
                        d="m0 0 4.358-.302c15.938-13.697 17.882-15.979 35.46-17.48L21.499-35.916l-.333 3.628-7.863-14.33 9.142 1.787-.327 4.11C31.195-31.9 40.99-21.68 50.558-13.615 27.475-16.521 19.164-7.455 7.447 2.692l1.74 2.366-3.855 3.643-6.265-.757Z"
                        fill="#505050" fillOpacity={1} fillRule="nonzero" stroke="none"
                        transform="translate(337.432 402.95)"
                    />
                </DHDKey>

                <DHDKey slug="scutum" active={dialedSlugs.includes("scutum")} onPress={onGlyphPress}>
                    <Path
                        d="m0 0 1.846.672a219.803 219.803 0 0 1 29.328 13.183A220.047 220.047 0 0 1 58.06 31.052l1.571 1.175 52.073-66.908-1.62-1.222a305.58 305.58 0 0 0-80.649-43.605l-1.91-.684z"
                        fill="url(#brushedMetal)" fillOpacity={1} fillRule="nonzero" stroke="none"
                        transform="translate(391.224 436.913)"
                    />
                    <Path
                        d="M0 0a223.58 223.58 0 0 1 28.022 12.745 223.973 223.973 0 0 1 25.8 16.343l47.172-60.609a301.734 301.734 0 0 0-76.059-41.123Z"
                        fill="url(#metallicHighlight)" fillOpacity={1} fillRule="nonzero" stroke="none"
                        transform="translate(396.28 434.506)"
                    />
                    <Path
                        d="m0 0-4.062-2.346-6.648 10.289Zm12.055 10.289L-1.89 18.252l-1.756-3.271 13.765-7.82Zm19.89-9.012L25.262-1.23 3.186 3.506-21.613 21.13c-1.82 1.295-2.875.218-1.674-1.673L-4.974-9.396 6.733-1.934l18.04-4.005 5.077-4.635z"
                        fill="#505050" fillOpacity={1} fillRule="nonzero" stroke="none"
                        transform="translate(440.712 407.484)"
                    />
                </DHDKey>

                <DHDKey slug="sextans" active={dialedSlugs.includes("sextans")} onPress={onGlyphPress}>
                    <Path
                        d="m0 0 1.545 1.232A215.552 215.552 0 0 1 45.066 48.1l1.106 1.616 70.964-46.364-1.137-1.683a299.719 299.719 0 0 0-62.358-67.307l-1.582-1.253z"
                        fill="url(#brushedMetal)" fillOpacity={1} fillRule="nonzero" stroke="none"
                        transform="translate(453.175 470.917)"
                    />
                    <Path
                        d="M0 0a219.51 219.51 0 0 1 41.678 44.885l64.286-42.001a295.672 295.672 0 0 0-58.809-63.473Z"
                        fill="url(#metallicHighlight)" fillOpacity={1} fillRule="nonzero" stroke="none"
                        transform="translate(458.753 470.262)"
                    />
                    <Path
                        d="m0 0-6.357 8.661-2.68-10.539Zm16.696-6.876.913 3.781L9.93-.263 8.717-3.96Zm40.028 3.36-4.413 7.887-3.795-4.477-18.994-8.16-4.39 1.502 2.851-9.633 2.511 4.438L49.912-3.29z"
                        fill="#505050" fillOpacity={1} fillRule="nonzero" stroke="none"
                        transform="translate(489.242 468.967)"
                    />
                </DHDKey>

                <DHDKey slug="sagittarius" active={dialedSlugs.includes("sagittarius")} onPress={onGlyphPress}>
                    <Path
                        d="m0 0 1.065 1.668a217.764 217.764 0 0 1 26.158 58.513l.525 1.879 82.187-20.815-.537-1.965a302.623 302.623 0 0 0-37.34-83.955l-1.089-1.696z"
                        fill="url(#brushedMetal)" fillOpacity={1} fillRule="nonzero" stroke="none"
                        transform="translate(500.95 523.078)"
                    />
                    <Path
                        d="M0 0a221.71 221.71 0 0 1 25.046 56.037l74.456-18.856a298.579 298.579 0 0 0-35.221-79.183Z"
                        fill="url(#metallicHighlight)" fillOpacity={1} fillRule="nonzero" stroke="none"
                        transform="translate(506.443 524.267)"
                    />
                    <Path
                        d="m0 0-14.402 1.774-1.928 1.957 13.24-.311Zm9.912-5.204L.389 6.681.354 16.806l8.332 2.748.037-3.776c.008-.906.067-1.468.181-1.7.005-.011.013-.031.019-.038a.352.352 0 0 1 .056-.054.119.119 0 0 1 .019-.02c0-.002.013.002.018 0 .003 0 .012-.016.016-.019h.058c.006.003.025.017.036.019.056.02.129.063.2.128.207.201.496.599.862 1.155l8.442 12.854c.296.448.481.759.531.953.002.007-.001.029 0 .038v.092c-.004.007-.014.028-.02.035l-.018.021a.325.325 0 0 0-.019.017c-.006.005-.027.013-.036.017-.004 0-.015-.002-.017 0-.01 0-.03.019-.039.019-.017.003-.052 0-.073 0-.251.006-.739-.111-1.482-.331l-8.862-2.598-.039-3.608-8.844-2.729-.476 2.27 7.104 11.39-5.072 12.433-28.658-2.781-5.366-17.563 8.386 1.263.715 12.691 21.829 1.885 3.003-8.11-4.413-6.356-5.146-2.088 4.652-10.107.092-7.398-23.038.073L-16.42-2.02z"
                        fill="#505050" fillOpacity={1} fillRule="nonzero" stroke="none"
                        transform="translate(561.33 514.035)"
                    />
                </DHDKey>

                <DHDKey slug="hydra" active={dialedSlugs.includes("hydra")} onPress={onGlyphPress}>
                    <Path
                        d="m0 0 .475 1.93a217.337 217.337 0 0 1 5.993 64.027L6.36 67.9l84.497 6.997.127-2.037a302.006 302.006 0 0 0-8.337-91.717l-.484-1.95z"
                        fill="url(#brushedMetal)" fillOpacity={1} fillRule="nonzero" stroke="none"
                        transform="translate(529.455 587.959)"
                    />
                    <Path
                        d="M0 0a221.339 221.339 0 0 1 5.734 61.33l76.552 6.339a298.003 298.003 0 0 0-7.869-86.515Z"
                        fill="url(#metallicHighlight)" fillOpacity={1} fillRule="nonzero" stroke="none"
                        transform="translate(534.281 590.863)"
                    />
                    <Path
                        d="m0 0 9.157 2.968-.613 7.508-5.057-5.515-1.966-.995-4.027 4.145-.379 3.94-10.949-.519.444-5.172 8.726.517zm13.94-.893 1.682 2.479-3 2.342-1.948-2.777zm4.137-7.275 4.732 4.426-5.319 4.801zm12.384-20.426 6.689 3.724.439 4.531-4.797.102-2.522-3.01-1.596-.027-11.054 7.985-1.903 2.97-3.096-3.97 3.428-.924z"
                        fill="#505050" fillOpacity={1} fillRule="nonzero" stroke="none"
                        transform="translate(564.665 623.537)"
                    />
                </DHDKey>

                <DHDKey slug="aries" active={dialedSlugs.includes("aries")} onPress={onGlyphPress}>
                    <Path
                        d="M0 0a215.755 215.755 0 0 1-15.164 62.758l-.734 1.805 77.646 34.055.783-1.882A299.991 299.991 0 0 0 84.487 7.011l.172-1.998L.172-1.984Z"
                        fill="url(#brushedMetal)" fillOpacity={1} fillRule="nonzero" stroke="none"
                        transform="translate(535.437 660.758)"
                    />
                    <Path
                        d="M0 0a219.682 219.682 0 0 1-14.535 60.13l70.348 30.854A296.02 296.02 0 0 0 76.521 6.337Z"
                        fill="url(#metallicHighlight)" fillOpacity={1} fillRule="nonzero" stroke="none"
                        transform="translate(539.24 663.088)"
                    />
                    <Path
                        d="m0 0-14.628 18.46-24.128 13.174-2.618 4.235-5.843-7.776 6.04.046 24.621-14.404L-2.717-3.404l1.194-4.114L4.744-.315z"
                        fill="#505050" fillOpacity={1} fillRule="nonzero" stroke="none"
                        transform="translate(591.342 684.348)"
                    />
                </DHDKey>

                <DHDKey slug="eridanus" active={dialedSlugs.includes("eridanus")} onPress={onGlyphPress}>
                    <Path
                        d="M0 0a220.901 220.901 0 0 1-7.542 15.336 218.447 218.447 0 0 1-27.271 39.37l-1.277 1.467 62.392 57.431 1.351-1.53c15.134-17.139 28.372-36.115 39.35-56.399a307.651 307.651 0 0 0 10.611-21.613l.815-1.836L.809-1.818Z"
                        fill="url(#brushedMetal)" fillOpacity={1} fillRule="nonzero" stroke="none"
                        transform="translate(517.595 729.832)"
                    />
                    <Path
                        d="M0 0a222.574 222.574 0 0 1-33.363 52.418l56.526 52.032c14.373-16.507 26.978-34.704 37.484-54.119A302.95 302.95 0 0 0 70.3 30.833Z"
                        fill="url(#metallicHighlight)" fillOpacity={1} fillRule="nonzero" stroke="none"
                        transform="translate(520.433 733.272)"
                    />
                    <Path
                        d="m0 0 2.234 6.146 8.363 7.677-3.068 19.262-5.817-.671-2.486 3.335 6.105 8.887-.488 12.302L.13 61.346l.315 5.812-6.634-4.069 1.416-2.39-.334-5.283 4.266.255.848-7.482-3.215 1.942-2.596-5.682 3.543-2.095-4.449-7.494 7.517-6.432 5.965-13.655-10.644-8.986Z"
                        fill="#505050" fillOpacity={1} fillRule="nonzero" stroke="none"
                        transform="translate(535.148 750.298)"
                    />
                </DHDKey>

                <DHDKey slug="libra" active={dialedSlugs.includes("libra")} onPress={onGlyphPress}>
                    <Path
                        d="M0 0c-14.813 15.971-31.965 29.595-50.978 40.492l-1.693.97 40.351 74.554 1.772-1c27.244-15.37 51.776-34.746 72.913-57.592l1.363-1.472L1.355-1.461Z"
                        fill="url(#brushedMetal)" fillOpacity={1} fillRule="nonzero" stroke="none"
                        transform="translate(478.207 789.65)"
                    />
                    <Path
                        d="M0 0c-14.33 15.17-30.757 28.215-48.871 38.809l36.557 67.542C13.277 91.684 36.409 73.411 56.491 52Z"
                        fill="url(#metallicHighlight)" fillOpacity={1} fillRule="nonzero" stroke="none"
                        transform="translate(479.778 793.825)"
                    />
                    <Path
                        d="m0 0 3.722 3.37 19.493-6.199 15.41 14.699-2.012 24.183-21.757-6.424-12.213 7.909.454-4.975L-.185 29.2l16.06-4.949 16.206 6.169L21.396 2.216.404 7.793l-6.771-3.409Z"
                        fill="#505050" fillOpacity={1} fillRule="nonzero" stroke="none"
                        transform="translate(460.756 827.1)"
                    />
                </DHDKey>

                <DHDKey slug="leo" active={dialedSlugs.includes("leo")} onPress={onGlyphPress}>
                    <Path
                        d="M0 0a218.082 218.082 0 0 1-61.616 21.706l-1.92.366 13.956 83.604 2.001-.369c36.354-6.709 56.224-13.823 87.904-30.747l1.774-.948L1.753-.933Z"
                        fill="url(#brushedMetal)" fillOpacity={1} fillRule="nonzero" stroke="none"
                        transform="translate(421.227 833.458)"
                    />
                    <Path
                        d="M0 0a222.028 222.028 0 0 1-59.069 20.804l12.642 75.737a299.043 299.043 0 0 0 82.969-29.023Z"
                        fill="url(#metallicHighlight)" fillOpacity={1} fillRule="nonzero" stroke="none"
                        transform="translate(421.348 837.915)"
                    />
                    <Path
                        d="m0 0 1.445 6.759c-6.936 14.328-17.327 24.037-29.391 30.634l-5.796-1.017 4.119 8.412 2.95-4.653c11.637-6.038 22.72-14.087 31.007-32.31l4.888-4.338Z"
                        fill="#505050" fillOpacity={1} fillRule="nonzero" stroke="none"
                        transform="translate(413.798 862.216)"
                    />
                </DHDKey>

                <DHDKey slug="serpens-caput" active={dialedSlugs.includes("serpens-caput")} onPress={onGlyphPress}>
                    <Path
                        d="M0 0a218.461 218.461 0 0 1-34.881 2.816c-10.218 0-20.514-.733-30.599-2.179l-1.942-.279-13.641 83.665 2.006.298a301.142 301.142 0 0 0 44.156 3.262c16.389 0 32.922-1.354 49.137-4.024l1.985-.327L1.958-.318Z"
                        fill="url(#brushedMetal)" fillOpacity={1} fillRule="nonzero" stroke="none"
                        transform="translate(352.691 856.22)"
                    />
                    <Path
                        d="M0 0a222.556 222.556 0 0 1-33.562 2.559c-9.751 0-19.573-.656-29.223-1.95l-12.357 75.79a297.276 297.276 0 0 0 41.56 2.927c15.505 0 31.138-1.227 46.501-3.651z"
                        fill="url(#metallicHighlight)" fillOpacity={1} fillRule="nonzero" stroke="none"
                        transform="translate(351.372 860.477)"
                    />
                    <Path
                        d="m0 0-6.167-2.246 2.523-2.551 2.765-9.826-5.387-6.544-2.091 3.075-9.265-12.717-.09-16.339-1.794-3.541 7.152.351-2.451 3.208.078 15.578 11.015 4.458-.891 2.654 6.869 9.145L-.76-3.457z"
                        fill="#505050" fillOpacity={1} fillRule="nonzero" stroke="none"
                        transform="translate(328.096 925.585)"
                    />
                </DHDKey>

            {/* Inner ring glyphs */}
                <DHDKey slug="orion" active={dialedSlugs.includes("orion")} onPress={onGlyphPress}>
                <Path
                    d="m0 0 1.804.938c18.631 9.688 38.468 16.477 58.961 20.176l1.995.36 15.563-93.287-1.919-.367a113.252 113.252 0 0 1-29.671-10.105l-1.734-.873z"
                    fill="url(#brushedMetal)" fillOpacity={1} fillRule="nonzero" stroke="none"
                    transform="translate(221.355 825.359)"
                />
                <Path
                    d="M0 0c17.14 8.701 35.294 14.914 54.025 18.489l14.254-85.441a117.331 117.331 0 0 1-27.061-9.219z"
                    fill="url(#metallicHighlight)" fillOpacity={1} fillRule="nonzero" stroke="none"
                    transform="translate(226.813 823.677)"
                />
                <Path
                    d="M0 0c-1.046 2.243-4.354.908-3.304-1.364C-2.288-3.563 1.045-2.244 0 0m3.708 2.279C2.526 4.411.14 3.396 1.228.857 2.399-1.877 4.94-.57 3.869 1.922c-.052.12-.104.252-.161.357m4.107 3.536c-.889 1.496-2.938 1.137-3.466-.144-.173-.44-.182-.993.105-1.612 1.211-2.631 4.538-.969 3.5 1.453-.046.104-.085.215-.139.303M3.533 27.204l-3.48 2.604-1.402-3.95-12.019-5.712-3.902 1.769-.682-4.207 3.824-1.934 6.175-5.801L-4.574 2.5l2.734 1.191-3.316 7.288-6.477 6.613 10.372 5.161 1.049-9.231 2.389-6.141L4.81 8.893l-2.426 6.168-1.043 9.322zM22.427-9.267l-4.106 1.225-8.513 9.117L6.714-.562l8.031-8.668-15.333-6.626.25 9.696-3.09.971-.307-11.659-2.837-2.919 3.299-2.537 1.538 2.699 19.096 7.683 3.405-1.627z"
                    fill="#505050" fillOpacity={1} fillRule="nonzero" stroke="none"
                    transform="translate(266.851 789.193)"
                />
                </DHDKey>

                <DHDKey slug="lynx" active={dialedSlugs.includes("lynx")} onPress={onGlyphPress}>
                <Path
                    d="m0 0 1.393 1.473c14.302 15.128 30.834 28.021 49.138 38.32l1.772.998 45-83.159-1.679-.974a113.241 113.241 0 0 1-24.687-19.309l-1.356-1.406z"
                    fill="url(#brushedMetal)" fillOpacity={1} fillRule="nonzero" stroke="none"
                    transform="translate(166.481 783.178)"
                />
                <Path
                    d="M0 0c13.235 13.721 28.365 25.52 45.026 35.111l41.22-76.172a117.191 117.191 0 0 1-22.517-17.608z"
                    fill="url(#metallicHighlight)" fillOpacity={1} fillRule="nonzero" stroke="none"
                    transform="translate(172.18 783.369)"
                />
                <Path
                    d="M0 0c-3.304 5.305-7.443 10.115-11.658 14.883l-11.292 7.37-1.107-6.332C-9.944 9.467-.725-1.467-.895-22.003l5.035-1.193 6.037-4.776 6.417-2.841 2.036 6.259-4.521-.931-10.898 5.926z"
                    fill="#505050" fillOpacity={1} fillRule="nonzero" stroke="none"
                    transform="translate(225.632 772.602)"
                />
                </DHDKey>

                <DHDKey slug="capricorn" active={dialedSlugs.includes("capricorn")} onPress={onGlyphPress}>
                <Path
                    d="m0 0 .828 1.84c8.593 19.116 19.936 36.718 33.714 52.317l1.352 1.53 69.597-64.074-1.252-1.465a113.095 113.095 0 0 1-16.832-26.345l-.82-1.787z"
                    fill="url(#brushedMetal)" fillOpacity={1} fillRule="nonzero" stroke="none"
                    transform="translate(128.607 725.344)"
                />
                <Path
                    d="M0 0c8.036 17.419 18.413 33.526 30.883 47.935l63.762-58.702a117.044 117.044 0 0 1-15.351-24.018Z"
                    fill="url(#metallicHighlight)" fillOpacity={1} fillRule="nonzero" stroke="none"
                    transform="translate(133.92 727.38)"
                />
                <Path
                    d="m0 0 5.402-7.476 8.467-19.511c-11.101 3.013-21.786 5.978-30.944 9.136zm.113 6.962C-7.91-2.435-18.169-12.108-28.556-21.68l3.016-2.422 4.25 3.461c7.755-3.622 19.721-6.409 36.872-12.296l3.917-4.698 4.687 5.772-4.262 2.324L8.997-4.015z"
                    fill="#505050" fillOpacity={1} fillRule="nonzero" stroke="none"
                    transform="translate(179.729 750.78)"
                />
                </DHDKey>

                <DHDKey slug="canis-minor" active={dialedSlugs.includes("canis-minor")} onPress={onGlyphPress}>
                <Path
                    d="m0 0 .183 2.008a208.787 208.787 0 0 0 14.752 60.294l.777 1.897 86.611-37.997-.693-1.785a113.946 113.946 0 0 1-7.203-30.265l-.19-1.964z"
                    fill="url(#brushedMetal)" fillOpacity={1} fillRule="nonzero" stroke="none"
                    transform="translate(111.737 658.464)"
                />
                <Path
                    d="M0 0a204.773 204.773 0 0 0 13.508 55.233L92.863 20.42a117.903 117.903 0 0 1-6.571-27.572Z"
                    fill="url(#metallicHighlight)" fillOpacity={1} fillRule="nonzero" stroke="none"
                    transform="translate(116.097 662.115)"
                />
                <Path
                    d="m0 0 12.354 4.845-4.679-16.014Zm-13.091 13.028 7.845-11.41-12.535-4.923zm-1.291 7.91-8.6-29.972 19.718 7.757L8.924-19.032l8.663 29.617-19.568-7.691z"
                    fill="#505050" fillOpacity={1} fillRule="nonzero" stroke="none"
                    transform="translate(160.819 682.285)"
                />
                </DHDKey>

                <DHDKey slug="taurus" active={dialedSlugs.includes("taurus")} onPress={onGlyphPress}>
                <Path
                    d="M0 0c-4.983 20.103-6.906 40.829-5.715 61.605l.117 2.049 94.267-7.814-.07-1.908a112.666 112.666 0 0 1 3.108-30.741l.468-1.924L.484-1.951Z"
                    fill="url(#brushedMetal)" fillOpacity={1} fillRule="nonzero" stroke="none"
                    transform="translate(117.119 591.894)"
                />
                <Path
                    d="M0 0a202.643 202.643 0 0 0-5.237 56.412l86.376-7.16a116.693 116.693 0 0 1 2.82-27.992z"
                    fill="url(#metallicHighlight)" fillOpacity={1} fillRule="nonzero" stroke="none"
                    transform="translate(120.527 594.81)"
                />
                <Path
                    d="m0 0 4.167 2.513C22.302 1.361 39.05.428 47.349.836l4.366-2.031.029 7.604-3.869-2.175-17.029.578C28.442 8.026 15.858 15.896 6.042 17.361l-4.71 2.933-.748-5.636C10.84 12.745 17.18 9.172 22.278 5.456L3.703 6.644-.498 8.092Z"
                    fill="#505050" fillOpacity={1} fillRule="nonzero" stroke="none"
                    transform="translate(130.656 620.754)"
                />
                </DHDKey>

                <DHDKey slug="norma" active={dialedSlugs.includes("norma")} onPress={onGlyphPress}>
                <Path
                    d="M0 0a211.014 211.014 0 0 0-8.177 13.824A209.108 209.108 0 0 0-25.4 56.13l-.563 1.98 91.708 23.221.56-1.816a114.169 114.169 0 0 1 12.892-27.82l1.065-1.668L1.09-1.692Z"
                    fill="url(#brushedMetal)" fillOpacity={1} fillRule="nonzero" stroke="none"
                    transform="translate(144.326 529.012)"
                />
                <Path
                    d="M0 0a207.237 207.237 0 0 0-6.939 11.863 205.237 205.237 0 0 0-16.322 39.52l84.037 21.278a118.453 118.453 0 0 1 8.418-19.598c1.028-1.9 2.134-3.813 3.3-5.707z"
                    fill="url(#metallicHighlight)" fillOpacity={1} fillRule="nonzero" stroke="none"
                    transform="translate(146.606 532.875)"
                />
                <Path
                    d="m0 0 14.082 13.06-16.281 5.118zm-31.482-19.42 13.004 10.091-15.896 6.377z"
                    fill="#505050" fillOpacity={1} fillRule="nonzero" stroke="none"
                    transform="translate(182.804 571.558)"
                />
                </DHDKey>

                <DHDKey slug="cancer" active={dialedSlugs.includes("cancer")} onPress={onGlyphPress}>
                <Path
                    d="M0 0a206.603 206.603 0 0 0-42.028 44.721l-1.17 1.689 79.187 51.729 1.118-1.541a112.698 112.698 0 0 1 21.015-21.981l1.548-1.231L1.581-1.245Z"
                    fill="url(#brushedMetal)" fillOpacity={1} fillRule="nonzero" stroke="none"
                    transform="translate(190.247 478.487)"
                />
                <Path
                    d="M0 0a202.526 202.526 0 0 0-38.462 40.919L34.1 88.32a116.664 116.664 0 0 1 19.092-19.982Z"
                    fill="url(#metallicHighlight)" fillOpacity={1} fillRule="nonzero" stroke="none"
                    transform="translate(191.148 482.883)"
                />
                <Path
                    d="m0 0-4.933 4.825-2.607-7.861Zm30.117 44.527-6.298 5.552c-8.8-15.55-19.588-21.522-31.784-20.7l-4.925 2.346-3.877-7.268 7.742 1.237c19.44.368 27.057 8.869 34.378 17.556z"
                    fill="#505050" fillOpacity={1} fillRule="nonzero" stroke="none"
                    transform="translate(194.395 502.176)"
                />
                </DHDKey>

                <DHDKey slug="perseus" active={dialedSlugs.includes("perseus")} onPress={onGlyphPress}>
                <Path
                    d="M0 0a208.086 208.086 0 0 0-54.048 28.552l-1.658 1.218 58.11 74.653 1.558-1.093a113.508 113.508 0 0 1 26.793-13.893l1.855-.667L1.902-.67Z"
                    fill="url(#brushedMetal)" fillOpacity={1} fillRule="nonzero" stroke="none"
                    transform="translate(249.857 445.704)"
                />
                <Path
                    d="M0 0a204.082 204.082 0 0 0-49.448 26.114L3.801 94.522A117.504 117.504 0 0 1 28.12 81.903Z"
                    fill="url(#metallicHighlight)" fillOpacity={1} fillRule="nonzero" stroke="none"
                    transform="translate(249.29 450.156)"
                />
                <Path
                    d="m0 0-3.589-18.902c1.83-5.273 10.727-4.256 9.004-2.78l-3.37 2.881-.503 3.28L4.185-1.054l8.505 12.081 7.831 2.336c1.37-4.421 1.11-21.567-.782-25.713L31.3-15.394 25.427 8.523c-.896 3.647-.611 8.748 1.513 13.789L6.651 14.48l-.587-6.27Z"
                    fill="#505050" fillOpacity={1} fillRule="nonzero" stroke="none"
                    transform="translate(225.38 497.401)"
                />
                </DHDKey>

                <DHDKey slug="crater" active={dialedSlugs.includes("crater")} onPress={onGlyphPress}>
                <Path
                    d="M0 0a208.585 208.585 0 0 0-60.163 9.646l-1.956.617 30.71 89.447 1.835-.539A113.883 113.883 0 0 1 .07 94.581l1.957-.042L2.024-.024Z"
                    fill="url(#brushedMetal)" fillOpacity={1} fillRule="nonzero" stroke="none"
                    transform="translate(316.654 433.853)"
                />
                <Path
                    d="M0 0a204.517 204.517 0 0 0-55.025 8.819l28.139 81.954A117.979 117.979 0 0 1 .003 86.604Z"
                    fill="url(#metallicHighlight)" fillOpacity={1} fillRule="nonzero" stroke="none"
                    transform="translate(314.679 437.889)"
                />
                <Path
                    d="m0 0-12.229 1.773 5.104 10.513 8.255-.772zm3.707-4.332L5.549 12.84l7.074 9.118-1.993 9.907 4.712 3.776-9.281.756.349-6.439 1.39-6.459-5.028-7.932-9.736.794-5.491 11.734.494 5.574 2.698 3.235-8.76.781 2.131-3.265-.804-7.649 5.866-11.958-7.614-15.879z"
                    fill="#505050" fillOpacity={1} fillRule="nonzero" stroke="none"
                    transform="translate(296.354 458.002)"
                />
                </DHDKey>

                <DHDKey slug="equuleus" active={dialedSlugs.includes("equuleus")} onPress={onGlyphPress}>
                <Path
                    d="m0 0 1.923.074c9.991.389 19.895 2.11 29.439 5.114l1.86.586 30.705-89.452L62-84.31A206.449 206.449 0 0 0 2.04-94.552l-2.043-.043z"
                    fill="url(#brushedMetal)" fillOpacity={1} fillRule="nonzero" stroke="none"
                    transform="translate(321.604 528.424)"
                />
                <Path
                    d="M0 0a116.607 116.607 0 0 1 26.699 4.636l28.124-81.935A202.386 202.386 0 0 0-.003-86.666Z"
                    fill="url(#metallicHighlight)" fillOpacity={1} fillRule="nonzero" stroke="none"
                    transform="translate(325.604 524.592)"
                />
                <Path
                    d="m0 0 .595-11.661L5.821-8.38l22.227-5.349L12.77 33.182l-9.137-5.858-8.338.818 1.154-10.093 13.881 7.733L22.06-8.112 5.822-4.585Z"
                    fill="#505050" fillOpacity={1} fillRule="nonzero" stroke="none"
                    transform="translate(336.826 471.451)"
                />
                </DHDKey>

                <DHDKey slug="mic" active={dialedSlugs.includes("mic")} onPress={onGlyphPress}>
                <Path
                    d="m0 0 1.804.69a115.46 115.46 0 0 1 13.592 6.244 114.578 114.578 0 0 1 12.656 7.962l1.564 1.132L87.7-58.604l-1.634-1.22A210.063 210.063 0 0 0 60.4-76.235a210.452 210.452 0 0 0-27.779-12.512l-1.917-.701z"
                    fill="url(#brushedMetal)" fillOpacity={1} fillRule="nonzero" stroke="none"
                    transform="translate(357.587 535.156)"
                />
                <Path
                    d="M0 0a118.415 118.415 0 0 1 23.791 12.875l53.208-68.367a205.975 205.975 0 0 0-23.535-14.886A206.482 206.482 0 0 0 28.127-81.94Z"
                    fill="url(#metallicHighlight)" fillOpacity={1} fillRule="nonzero" stroke="none"
                    transform="translate(362.62 532.816)"
                />
                <Path
                    d="m0 0 8.174 6.397-11.097 5.775zm9.589-22.501 3.52 4.397L40.996 2.854l-8.437 4.617-22.188 18.464-3.576 7.272-6.354-9.009 6.125-1.028L29.067 3.946l2.665-1.619L9.985-14.318l-5.561.239Z"
                    fill="#505050" fillOpacity={1} fillRule="nonzero" stroke="none"
                    transform="translate(382.12 490.744)"
                />
                </DHDKey>

                <DHDKey slug="aquarius" active={dialedSlugs.includes("aquarius")} onPress={onGlyphPress}>
                <Path
                    d="m0 0 1.507 1.235a112.732 112.732 0 0 1 20.386 21.847l1.113 1.568 79.191-51.742-1.154-1.686A206.456 206.456 0 0 0 59.67-73.371l-1.583-1.267z"
                    fill="url(#brushedMetal)" fillOpacity={1} fillRule="nonzero" stroke="none"
                    transform="translate(389.517 552.972)"
                />
                <Path
                    d="M0 0a116.703 116.703 0 0 1 18.484 19.813l72.554-47.405a202.472 202.472 0 0 0-37.832-40.773Z"
                    fill="url(#metallicHighlight)" fillOpacity={1} fillRule="nonzero" stroke="none"
                    transform="translate(395.058 552.364)"
                />
                <Path
                    d="m0 0 16.673-.165-4.241 7.316 2.559 5.385 11.211 2.928 3.918-.893-1.259 7.06-3.005-2.313-13.229-4.08-4.356-8.226 1.879-3.416-8.545-.267c-2.719 1.294-.558 3.167-7.525 6.188l5.754 5.99 2.407 5.956 4.293 3.842-6.335 1.33-3.451-9.611-5.973-4.846-6.061 16.816 1.105 3.778-7.559-2.101 3.052-2.377 7.275-21.26C-5.147 7.255-3.16 1.729 0 0"
                    fill="#505050" fillOpacity={1} fillRule="nonzero" stroke="none"
                    transform="translate(437.281 513.731)"
                />
                </DHDKey>

                <DHDKey slug="triangulum" active={dialedSlugs.includes("triangulum")} onPress={onGlyphPress}>
                <Path
                    d="m0 0 1.036 1.662a113.75 113.75 0 0 1 12.373 27.329l.553 1.831 91.68-23.218-.554-1.976a208.631 208.631 0 0 0-24.834-55.645l-1.086-1.709z"
                    fill="url(#brushedMetal)" fillOpacity={1} fillRule="nonzero" stroke="none"
                    transform="translate(414.146 580.05)"
                />
                <Path
                    d="M0 0a117.81 117.81 0 0 1 11.219 24.794L95.22 3.52a204.7 204.7 0 0 0-22.716-50.892Z"
                    fill="url(#metallicHighlight)" fillOpacity={1} fillRule="nonzero" stroke="none"
                    transform="translate(419.599 581.267)"
                />
                <Path
                    d="m0 0 21.421-10.616-10.692-9.538Zm-12.018 11.711 21.68-41.672L33.343-8.886Z"
                    fill="#505050" fillOpacity={1} fillRule="nonzero" stroke="none"
                    transform="translate(459.212 583.251)"
                />
                </DHDKey>

                <DHDKey slug="cetus" active={dialedSlugs.includes("cetus")} onPress={onGlyphPress}>
                <Path
                    d="m0 0 .456 1.918a113.61 113.61 0 0 1 3.023 30.027l-.064 1.903 94.283 7.808.113-2.053a207.99 207.99 0 0 0-5.665-60.863l-.479-1.958z"
                    fill="url(#brushedMetal)" fillOpacity={1} fillRule="nonzero" stroke="none"
                    transform="translate(428.868 613.695)"
                />
                <Path
                    d="M0 0a117.536 117.536 0 0 1 2.737 27.261l86.395 7.154a203.968 203.968 0 0 0-5.188-55.677Z"
                    fill="url(#metallicHighlight)" fillOpacity={1} fillRule="nonzero" stroke="none"
                    transform="translate(433.655 616.61)"
                />
                <Path
                    d="m0 0 9.558-8.785-4.391-10.217c-3.063 1.465-6.542 2.535-10.227 3.089zm30.555 6.589-1.006-3.246C24.817-3.95 19.613-6.41 14.255-7.329L-1.741 7.061l-8.204-26.124c4.746.154 10.835-1.933 17.5-5.916l5.468 12.917C22.164-10.3 28.312-5.447 32.556 1.289l2.909 1.867z"
                    fill="#505050" fillOpacity={1} fillRule="nonzero" stroke="none"
                    transform="translate(472.423 634.564)"
                />
                </DHDKey>

                <DHDKey slug="leo-minor" active={dialedSlugs.includes("leo-minor")} onPress={onGlyphPress}>
                <Path
                    d="M0 0a112.684 112.684 0 0 1-6.904 29.616l-.678 1.78 86.619 37.991.775-1.904A206.659 206.659 0 0 0 94.257 7.84l.178-2.004L.185-1.97Z"
                    fill="url(#brushedMetal)" fillOpacity={1} fillRule="nonzero" stroke="none"
                    transform="translate(431.922 652.43)"
                />
                <Path
                    d="M0 0a116.695 116.695 0 0 1-6.284 26.914L73.09 61.727a202.62 202.62 0 0 0 13.214-54.58Z"
                    fill="url(#metallicHighlight)" fillOpacity={1} fillRule="nonzero" stroke="none"
                    transform="translate(435.703 654.771)"
                />
                <Path
                    d="m0 0 17.519 6.743-.524 7.733 8.807 6.725 5.821-4.971-10.815-4.391-.485-4.247c3.802-.815 7.693-1.995 12.385-14.546l-43.269-9.615-1.847-4.185c-2.258 1.399-4.483 4.751-4.492 6.099l5.339.806 38.447 9.417-6.726 8.668L.783-2.502l-4.146-2.815L-4.427.62Z"
                    fill="#505050" fillOpacity={1} fillRule="nonzero" stroke="none"
                    transform="translate(467.825 683.92)"
                />
                </DHDKey>

                <DHDKey slug="gemini" active={dialedSlugs.includes("gemini")} onPress={onGlyphPress}>
                <Path
                    d="M0 0a114.263 114.263 0 0 1-16.235 26.011l-1.214 1.462 69.602 64.068 1.35-1.554A209.25 209.25 0 0 0 79.497 52.43a213.317 213.317 0 0 0 7.102-14.41l.821-1.839L.814-1.804Z"
                    fill="url(#brushedMetal)" fillOpacity={1} fillRule="nonzero" stroke="none"
                    transform="translate(422.405 688.329)"
                />
                <Path
                    d="M0 0a118.384 118.384 0 0 1-14.772 23.651l63.78 58.709a205.316 205.316 0 0 0 30.291-47.58Z"
                    fill="url(#metallicHighlight)" fillOpacity={1} fillRule="nonzero" stroke="none"
                    transform="translate(425.223 691.771)"
                />
                <Path
                    d="m0 0-25.063-16.453-4.762 8.013L-4.136 7.473zm4.874-5.493L7.113-.154 3.197.947l-7.885 13.169.188 4.92-6.249-3.661 4.56-5.229-27.462-16.853 1.3-4.21-.29-3.608 5.975-4.111-.236-2.882 4.082-1.908-.377 4.624L1.758-3.111z"
                    fill="#505050" fillOpacity={1} fillRule="nonzero" stroke="none"
                    transform="translate(469.148 734.578)"
                />
                </DHDKey>

                <DHDKey slug="cra" active={dialedSlugs.includes("cra")} onPress={onGlyphPress}>
                <Path
                    d="M0 0a112.773 112.773 0 0 1-24.036 19.418l-1.636.985 45.023 83.187 1.778-1.022c18.046-10.369 34.346-23.316 48.446-38.483l1.368-1.472L1.355-1.444Z"
                    fill="url(#brushedMetal)" fillOpacity={1} fillRule="nonzero" stroke="none"
                    transform="translate(401.669 719.437)"
                />
                <Path
                    d="M0 0a116.743 116.743 0 0 1-21.893 17.674l41.254 76.224a202.575 202.575 0 0 0 44.36-35.242Z"
                    fill="url(#metallicHighlight)" fillOpacity={1} fillRule="nonzero" stroke="none"
                    transform="translate(403.218 723.607)"
                />
                <Path
                    d="m0 0-6.551-13.171 13.737.894zm22.093 25.924L13.861 13.79l.553-1.716c4.824.71 13.472-1.862 13.992-10.102.525-8.32-7.83-12.104-15.936-12.537l.322-4.347 8.484.531c8.942.564 13.117 10.549 12.756 17.122-.363 6.652-5.447 10.582-9.807 12.408z"
                    fill="#505050" fillOpacity={1} fillRule="nonzero" stroke="none"
                    transform="translate(403.85 770.273)"
                />
                </DHDKey>

                <DHDKey slug="auriga" active={dialedSlugs.includes("auriga")} onPress={onGlyphPress}>
                <Path
                    d="M0 0a113.918 113.918 0 0 1-29.276 10.524l-1.874.396 15.57 93.29 2.013-.386A208.738 208.738 0 0 0 44.975 83.19l1.781-.945L1.748-.915Z"
                    fill="url(#brushedMetal)" fillOpacity={1} fillRule="nonzero" stroke="none"
                    transform="translate(371.706 742.195)"
                />
                <Path
                    d="M0 0a117.901 117.901 0 0 1-26.677 9.581l14.267 85.474a204.727 204.727 0 0 0 53.624-18.906Z"
                    fill="url(#metallicHighlight)" fillOpacity={1} fillRule="nonzero" stroke="none"
                    transform="translate(371.806 746.64)"
                />
                <Path
                    d="m0 0 7.932-.872-3.436 6.61zm-16.848-3.628 2.621-4.978-.456-15.813-5.167-9.582 7.369-10.148 3.435 2.417 13.76-1.655 8.116 16.999 4.238 3.271-6.755 3.362-.999-6.649-6.397-13.132-11.608 1.48-2.337 10.179.408 18.304L-7.01-4.6z"
                    fill="#505050" fillOpacity={1} fillRule="nonzero" stroke="none"
                    transform="translate(374.28 816.223)"
                />
                </DHDKey>

                <DHDKey slug="pisces-austrinius" active={dialedSlugs.includes("pisces-austrinius")} onPress={onGlyphPress}>
                <Path
                    d="M0 0a113.578 113.578 0 0 1-16.787 1.251c-4.824 0-9.693-.313-14.475-.93l-1.911-.247-15.567 93.311 2.02.294a207.107 207.107 0 0 0 29.761 2.154c10.82 0 21.747-.857 32.476-2.549l1.993-.314L1.944-.292Z"
                    fill="url(#brushedMetal)" fillOpacity={1} fillRule="nonzero" stroke="none"
                    transform="translate(335.736 753.932)"
                />
                <Path
                    d="M0 0a117.624 117.624 0 0 1-15.432 1.021c-4.352 0-8.74-.247-13.072-.733l-14.262 85.486a203.267 203.267 0 0 0 27.162 1.828c9.943 0 19.977-.738 29.858-2.196z"
                    fill="url(#metallicHighlight)" fillOpacity={1} fillRule="nonzero" stroke="none"
                    transform="translate(334.38 758.163)"
                />
                <Path
                    d="M0 0c-1.55-1.328-1.937-1.279-2.723.388-1.131 2.405-2.898 6.329-2.988 21.879-1.933 5.279-5.843 13.363-5.8 15.838L3.98 37.97l2.366-10.314L2.244 1.924Zm-9.229 4.603 6.534-12.495 8.867 6.838 4.956 27.749-2.151 14.282-15.104 10.286-10.887-7.24.344-8.933 5.897-15.258z"
                    fill="#505050" fillOpacity={1} fillRule="nonzero" stroke="none"
                    transform="translate(322.129 781.58)"
                />
                </DHDKey>
            </G>
  );
}, (prev, next) => {
  return prev.dialedSlugs.length === next.dialedSlugs.length &&
    prev.dialedSlugs.every((slug, i) => slug === next.dialedSlugs[i]);
});

DHDGlyphKeys.displayName = 'DHDGlyphKeys';
