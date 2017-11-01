

/**
 * 
 * @param String str The text to be converted to titleCase.
 * @return Convert first letter of word to upper case
 */

 function toProperCase (str) {
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
};

function sort_by (field, reverse, primer){
    
       var key = primer ? 
           function(x) {return primer(x[field])} : 
           function(x) {return x[field]};
    
       reverse = !reverse ? 1 : -1;
    
       return function (a, b) {
           return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
         } 
    };

module.exports = {
    toProperCase: toProperCase,
    sort_by: sort_by
};

