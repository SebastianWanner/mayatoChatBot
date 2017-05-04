

/**
 * 
 * @param String str The text to be converted to titleCase.
 * @return Convert first letter of word to upper case
 */

 function toProperCase (str) {
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
};

module.exports = {
    toProperCase: toProperCase
};

