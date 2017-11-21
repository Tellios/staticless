import { injectable } from "inversify";

@injectable()
export class CacheService<TKey, TValue> {
    private store: Map<TKey, { added: number, value: TValue }>;
    private lifeExpectancy: number;

    /**
     * Initializes the cache service.
     * @param lifeExpectancy the age cached items are allowed to live before they are scraped in minutes.
     */
    public initialize(lifeExpectancy: number) {
        this.lifeExpectancy = lifeExpectancy;
        this.store = new Map();
    }

    public get(key: TKey): TValue | undefined {
        const item = this.store.get(key);

        if (typeof item === "undefined") {
            return undefined;
        } else {
            const itemAge = ((Date.now() - item.added) / 1000) / 60;

            if (itemAge > this.lifeExpectancy) {
                this.store.delete(key);
                return undefined;
            } else {
                return item.value;
            }
        }
    }

    public set(key: TKey, value: TValue) {
        this.store.set(key, { added: Date.now(), value });
    }
}
