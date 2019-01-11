module.exports = function(string) {
    try {
        JSON.parse(string);
    } catch (e) {
        return false;
    }
    return true;
};