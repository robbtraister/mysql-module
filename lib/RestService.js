function RestService(config) {
    this.init(config);
}
RestService.prototype.init = function(config) {
    this.endpoint = config.endpoint;
    this.endpointRE = new RegExp('^' + this.endpoint + '(/|/(\\w+)(/|/(\\w+))?)?$');
}
RestService.prototype.parse = function(req)
{
    var match = this.endpointRE.exec(req.path);
    if (match)
    {
        var resource = match[2];
        return {
            user : req.session.user,
            method : req.method.toUpperCase(),
            resource : resource,
            id : match[4],
            data : req.body[resource] || req.body || req.query,
            query : req.query,
            payload : req.body[resource] || req.body
        };
    }
};
RestService.prototype.serve = function(req, res, next)
{
    var request = this.parse(req);
    if (request)
    {
        if (request.user)
        {
            var method = this[request.method];
            if (method)
            {
                method(request.data).then(function(payload){
                    res.set('Content-Type', 'application/json');
                    res.send(200, payload);
                }, function(err){
                    next(err);
                });
            }
            else
            {
                next('Could not recognize method: ' + req.method);
                break;
            }
        }
        else
        if (this.errCbk)
        {
            return this.errCbk(req, res, next);
        }
        else
        {
            return next('Not Authorized');
        }
    }
    else
    {
        return next(null, req, res);
    }
};


module.exports = RestService;
