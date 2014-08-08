var DataService = require("./DataService");

module.exports = function(config) {
    var DS = new DataService(config);
    return DS.serve;
}