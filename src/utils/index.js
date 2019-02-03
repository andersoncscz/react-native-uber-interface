import { Platform, PixelRatio } from 'react-native';
export default getPixelSize = pixels => {
    return Platform.select({
        ios: pixels,
        android: PixelRatio.getPixelSizeForLayoutSize(pixels)
    })
}


export const API_KEY = 'AIzaSyAvQfKP2J91dbxni-CCpi8CQxrMJeidvrY';