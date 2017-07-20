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
export declare function get<G>(req: express.Request): IRequestData<G>;
export declare type Factory<IRQD> = (req: express.Request) => IRQD;
export declare type EndwareHandler<IRQD, T> = (rqd: IRQD) => Promise<T>;
export declare type ResourceMiddlewareHandler<IRQD, T> = (rqd: IRQD) => Promise<T>;
export declare type PermissionMiddlewareHandler<IRQD> = (rqd: IRQD) => Promise<any>;
export declare function EndwareTemplete<G, IRQD extends IRequestData<G>, T>(factory: Factory<IRQD>, handler: EndwareHandler<IRQD, T>): express.RequestHandler;
export declare function ResourceMiddlewareTemplete<G, IRQD extends IRequestData<G>, T>(factory: Factory<IRQD>, handler: ResourceMiddlewareHandler<IRQD, T>, storageKey?: string): express.RequestHandler;
export declare function PermissionMiddlewareTemplete<G, IRQD extends IRequestData<G>>(factory: Factory<IRQD>, handler: PermissionMiddlewareHandler<IRQD>): express.RequestHandler;
