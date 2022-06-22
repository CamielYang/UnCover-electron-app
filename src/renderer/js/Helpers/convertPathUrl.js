// Reformat path to return usable path for css
export function convertPathUrl(filePath) {
    if (!filePath) {
        return null;
    }
    return filePath.replaceAll("\\", "/");
}