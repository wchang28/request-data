/// <reference types="express" />
import * as express from "express";
export interface IRequestData<G> {
    req: express.Request;
    readonly Global: G;
    readonly Headers: any;
    readonly Query: any;
    readonly Body: any;
    readonly Url: string;
    readonly OriginalUrl: string;
    readonly BaseUrl: string;
    get<T>(key: string): T;
    set<T>(key: string, value: T): void;
}
export declare class RequestData<G> implements IRequestData<G> {
    req: express.Request;
    constructor(req: express.Request);
    private readonly RequestInfo;
    readonly Global: G;
    readonly Headers: any;
    readonly Query: any;
    readonly Body: any;
    readonly Url: string;
    readonly OriginalUrl: string;
    readonly BaseUrl: string;
    get<T>(key: string): T;
    set<T>(key: string, value: T): void;
}
export declare type Factory<RQD> = (req: express.Request) => RQD;
export declare function EndwareTemplete<G, RQD extends RequestData<G>, T>(factory: Factory<RQD>, handler: (rqd: RQD) => Promise<T>): express.RequestHandler;
export declare function ResourceMiddlewareTemplete<G, RQD extends RequestData<G>, T>(factory: Factory<RQD>, handler: (rqd: RQD) => Promise<T>, storageKey?: string): express.RequestHandler;
export declare function PermissionMiddlewareTemplete<G, RQD extends RequestData<G>>(factory: Factory<RQD>, handler: (rqd: RQD) => Promise<any>): express.RequestHandler;
