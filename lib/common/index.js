import { Dimensions, Platform, PixelRatio, NativeModules } from 'react-native';
const { width: screenWidth, height: screenHeight } = Dimensions.get('screen');
const { width: windowWidth, height: windowHeight } = Dimensions.get('window');
export { screenWidth, // 屏幕的宽度
screenHeight, // 屏幕的高度
windowWidth, // 窗口的宽度
windowHeight, // 窗口的高度
 };
export const platfom = Platform.OS; // 平台
export const version = Platform.Version; // 版本
export const isiOS = platfom === 'ios';
export const isAndroid = platfom === 'android';
export const designWidth = 375; // 设计稿参照宽度
export const Ratio = PixelRatio.get(); //像素密度[1/1.5/2/3/3.5]
export const p1x = 1 / Ratio;
const { StatusBarManager } = NativeModules;
export const andriodStatusBarHeight = isiOS ? 0 : StatusBarManager.HEIGHT;
