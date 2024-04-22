import { Dimensions } from "react-native";

/**
 * Height of displayed part of the app (excluding header and footer on Android)
 */
const window_height = Dimensions.get('window').height;
/**
 * Width of displayed part of the app
 */
const window_width = Dimensions.get('window').width;

/**
 * Parameters
 * ----------
 * s : percentage of window's height to calculate
 * 
 * Returns
 * -------
 * window_height * s / 100
 */
const heightScale = (s: number) => window_height * (s / 100);
/**
 * Parameters
 * ----------
 * s : percentage of window's width to calculate
 * 
 * Returns
 * -------
 * window_width * s / 100
 */
const widthScale = (s: number) => window_width * (s / 100);

/**
 * Parameters
 * ----------
 * s : percentage of the minimum of window's height and width to calculate
 * 
 * Returns
 * -------
 * min(widthScale(s), heightScale(s))
 */
const scale = (s: number) => Math.min(heightScale(s), widthScale(s));


export {window_height, window_width, heightScale, widthScale, scale}
