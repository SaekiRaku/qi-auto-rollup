export default function extractData(data, args) {
    if (typeof data == "function") {
        return data(args);
    } else {
        return data;
    }
}