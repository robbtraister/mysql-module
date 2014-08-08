var RSVP = require("RSVP");
var RestService = require("RestService");

function DataService(config) {
    RestService.prototype.init.call(this, config);
    this.connectionFactory = new ConnectionFactory(config);
    this.entities = entities || require('./entity');
    _.each(this.entities, function(entityClass){
        entityClass.table = new Table(this.connectionFactory, entityClass);
    }.bind(this));
    delete this.entities.user;
    this.errCbk = errCbk;
}

DataService.prototype = new RestService();

DataService.prototype.GET = function(tableName, params) {
    return new RSVP.Promise(function(resolve, reject) {
        var prepare = function(err, records){
            if (err) reject(err);
            if (params.id && records.length)
            {
                records = records[0];
            }
            resolve(records);
        }.bind(this);

        var entityClass = this.entities[tableName];
        if (entityClass)
        {
            entityClass.table.find(params, prepare);
        }
        else
        {
            reject("Data type " + tableName + " could not be found");
        }
    });
}

DataService.prototype.POST = function(tableName, object, cbk) {
    return new RSVP.Promise(function(resolve, reject) {

    });
}

DataService.prototype.PUT = function(tableName, id, object, cbk) {
    return new RSVP.Promise(function(resolve, reject) {

    });
}

DataService.prototype.PATCH = function(tableName, id, params, cbk) {
    return new RSVP.Promise(function(resolve, reject) {

    });
}

DataService.prototype.DELETE = function(tableName, id) {
    return new RSVP.Promise(function(resolve, reject) {
        var entityClass = this.entities[tableName];
        if (entityClass && id)
        {
            entityClass.table.delete(id, function(err, info){
                if (err) reject(err);
                resolve(id);
            });
        }
        else
        {
            reject('Could not delete record:' + id + ' from resource:' + tableName);
        }
    });
}

module.exports = DataService;