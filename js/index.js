"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var http_status_code_lookup_1 = require("http-status-code-lookup");
var RequestData = (function () {
    function RequestData(req) {
        this.req = req;
        if (!this.req["__req_info__"])
            this.req["__req_info__"] = {};
    }
    Object.defineProperty(RequestData.prototype, "RequestInfo", {
        get: function () { return this.req["__req_info__"]; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RequestData.prototype, "Global", {
        get: function () { return (this.req.app.get("gloabl")); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RequestData.prototype, "Headers", {
        get: function () { return this.req.headers; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RequestData.prototype, "Query", {
        get: function () { return this.req.query; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RequestData.prototype, "Body", {
        get: function () { return this.req.body; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RequestData.prototype, "Url", {
        get: function () { return this.req.url; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RequestData.prototype, "OriginalUrl", {
        get: function () { return this.req.originalUrl; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RequestData.prototype, "BaseUrl", {
        get: function () { return this.req.baseUrl; },
        enumerable: true,
        configurable: true
    });
    RequestData.prototype.get = function (key) { return (this.RequestInfo[key]); };
    RequestData.prototype.set = function (key, value) { this.RequestInfo[key] = value; };
    return RequestData;
}());
exports.RequestData = RequestData;
function EndwareTemplete(factory, handler) {
    return function (req, res) {
        handler(factory(req))
            .then(function (value) {
            res.jsonp(value);
        }).catch(function (err) {
            res.status(http_status_code_lookup_1.lookup(err.error)).json(err);
        });
    };
}
exports.EndwareTemplete = EndwareTemplete;
function ResourceMiddlewareTemplete(factory, handler, storageKey) {
    return function (req, res, next) {
        var rqd = factory(req);
        handler(rqd)
            .then(function (value) {
            if (storageKey)
                rqd.set(storageKey, value);
            next();
        }).catch(function (err) {
            res.status(http_status_code_lookup_1.lookup(err.error, 404)).json(err);
        });
    };
}
exports.ResourceMiddlewareTemplete = ResourceMiddlewareTemplete;
function PermissionMiddlewareTemplete(factory, handler) {
    return function (req, res, next) {
        handler(factory(req))
            .then(function (value) {
            next();
        }).catch(function (err) {
            res.status(http_status_code_lookup_1.lookup(err.error, 403)).json(err);
        });
    };
}
exports.PermissionMiddlewareTemplete = PermissionMiddlewareTemplete;
// example
/*
export interface IGlobal {
    config: any;
}

export class MyRequestData extends RequestData<IGlobal> {
    constructor(req: express.Request) {super(req);}
    get Config(): any {return this.Global.config}
}

export function Endware<T>(handler: (rqd: MyRequestData) => Promise<T>) : express.RequestHandler {
    return EndwareTemplete<IGlobal, MyRequestData, T>((req: express.Request) => new MyRequestData(req), handler);
}

export function ResourceMiddleware<T>(handler: (rqd: MyRequestData) => Promise<T>, storageKey?: string) : express.RequestHandler {
    return ResourceMiddlewareTemplete<IGlobal, MyRequestData, T>((req: express.Request) => new MyRequestData(req), handler, storageKey);
}

export function PermissionMiddleware(handler: (rqd: MyRequestData) => Promise<any>) : express.RequestHandler {
    return PermissionMiddlewareTemplete<IGlobal, MyRequestData>((req: express.Request) => new MyRequestData(req), handler);
}

let endware = Endware((rqd: MyRequestData) => {
    return Promise.resolve<any>(rqd.Config);
});

let resourceMW = ResourceMiddleware((rqd: MyRequestData) => {
    return Promise.resolve<any>(rqd.Config);
}, "User");

let permissionMW = PermissionMiddleware((rqd: MyRequestData) => {
    return Promise.resolve<any>(null);
});
*/ 
