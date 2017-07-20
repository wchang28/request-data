import * as express from "express";
import {lookup} from "http-status-code-lookup";

export interface IRequestData<G> {
    req: express.Request;
    readonly Global:G;
    readonly Headers: any;
    readonly Query: any;
    readonly Body: any;
    readonly Url: string;
    readonly OriginalUrl: string;
    readonly BaseUrl: string;
    get<T>(key: string) : T;
    set<T>(key: string, value: T) : void;
}

export class RequestData<G> implements IRequestData<G> {
    constructor(public req: express.Request) {
        if (!this.req["__req_info__"]) this.req["__req_info__"] = {};
    }
    private get RequestInfo() : {[key: string]: any} {return this.req["__req_info__"];}
    get Global() : G {return <G>(this.req.app.get("gloabl"));}
    get Headers(): any {return this.req.headers;}
    get Query(): any {return this.req.query;}
    get Body(): any {return this.req.body;}
    get Url(): string {return this.req.url;}
    get OriginalUrl(): string {return this.req.originalUrl;}
    get BaseUrl(): string {return this.req.baseUrl;}
    get<T>(key: string) : T {return <T>(this.RequestInfo[key]);}
    set<T>(key: string, value: T) : void {this.RequestInfo[key] = value;}
}

export type Factory<RQD> = (req: express.Request) => RQD;

export function EndwareTemplete<G, RQD extends RequestData<G>, T>(factory: Factory<RQD>, handler: (rqd: RQD) => Promise<T>) : express.RequestHandler {
    return (req: express.Request, res: express.Response) => {
        handler(factory(req))
        .then((value: T) => {
            res.jsonp(value);
        }).catch((err: any) => {
            res.status(lookup(err.error)).json(err);
        });
    };
}

export function ResourceMiddlewareTemplete<G, RQD extends RequestData<G>, T>(factory: Factory<RQD>, handler: (rqd: RQD) => Promise<T>, storageKey?: string) : express.RequestHandler {
    return (req: express.Request, res: express.Response, next: express.NextFunction) => {
        let rqd = factory(req);
        handler(rqd)
        .then((value: T) => {
            if (storageKey) rqd.set<T>(storageKey, value);
            next();
        }).catch((err: any) => {
            res.status(lookup(err.error, 404)).json(err);
        });
    };
}

export function PermissionMiddlewareTemplete<G, RQD extends RequestData<G>>(factory: Factory<RQD>, handler: (rqd: RQD) => Promise<any>) : express.RequestHandler {
    return (req: express.Request, res: express.Response, next: express.NextFunction) => {
        handler(factory(req))
        .then((value: any) => {
            next();
        }).catch((err: any) => {
            res.status(lookup(err.error, 403)).json(err);
        });
    };
}


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