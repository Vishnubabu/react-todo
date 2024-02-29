export default (obj, ...args) => {
    const ret = {};
    for (const k of args) {
        ret[k] = obj[k];
    }
    return ret;
}