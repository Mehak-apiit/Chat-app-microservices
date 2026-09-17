export type EventPayload = Record<string,unknown>;
export interface DomainEvent<TType extends string, Tpayload extends EventPayload> {
    type: TType;
    payload: Tpayload;
    occurredAt: string;
}
export interface EvnetMetadata {
    correlationId: string;
    causationId: string;
    version?: number;


}
export interface OutboundEvent<
TType extends string,
TPayload extends EventPayload,
> extends DomainEvent<TType, TPayload> {
    metadata?: EvnetMetadata;
}
export interface InBoundEvent<
TType extends string,
TPayload extends EventPayload,
> extends DomainEvent<TType, TPayload> {
    metadata: EvnetMetadata;
}