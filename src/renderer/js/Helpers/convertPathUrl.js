// Reformat path to return usable path for css
export function convertPathUrl(filePath) {
    return filePath.replaceAll("\\", "/");
}