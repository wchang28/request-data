/// <reference types="express" />
/// <reference types="node" />
import * as express from "express";
import { ReadableContent } from "rest-api-interfaces";
import { Readable } from "stream";
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
export declare type JSONEndwareHandler<IRQD, T> = (rqd: IRQD) => Promise<T>;
export declare type ResourceMiddlewareHandler<IRQD, T> = (rqd: IRQD) => Promise<T>;
export declare type PermissionMiddlewareHandler<IRQD> = (rqd: IRQD) => Promise<void>;
export declare type ReadableStreamContent = ReadableContent<Readable>;
export declare type ReadabeStreamEndwareHandler<IRQD> = (rqd: IRQD) => Promise<ReadableStreamContent>;
export declare function JSONEndwareTemplete<G, IRQD extends IRequestData<G>, T>(factory: Factory<IRQD>, handler: JSONEndwareHandler<IRQD, T>): express.RequestHandler;
export declare function ReadableStreamEndwareTemplete<G, IRQD extends IRequestData<G>>(factory: Factory<IRQD>, handler: ReadabeStreamEndwareHandler<IRQD>): express.RequestHandler;
export declare function ResourceMiddlewareTemplete<G, IRQD extends IRequestData<G>, T>(factory: Factory<IRQD>, handler: ResourceMiddlewareHandler<IRQD, T>, storageKey?: string): express.RequestHandler;
export declare function PermissionMiddlewareTemplete<G, IRQD extends IRequestData<G>>(factory: Factory<IRQD>, handler: PermissionMiddlewareHandler<IRQD>): express.RequestHandler;
