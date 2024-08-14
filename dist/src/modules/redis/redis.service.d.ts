export declare class RedisService {
    private readonly redisClient;
    constructor();
    setex(key: string, value: string, expiresInSeconds: number): Promise<void>;
    set(key: string, value: string): Promise<void>;
    get(key: string): Promise<string | null>;
    del(key: string): Promise<void>;
}
