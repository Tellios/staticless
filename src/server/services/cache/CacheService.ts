import { injectable } from "inversify";
import { TimeService } from "../time/TimeService";

interface ICacheItem<TValue> {
    added: number;
    value: TValue;
}

@injectable()
export class CacheService<TKey, TValue> {
    private store: Map<TKey, ICacheItem<TValue>>;
    private lifeExpectancy: number;

    constructor(private timeService: TimeService) { }

    /**
     * Initializes the cache service.
     * @param lifeExpectancy the age cached items are valid in minutes.
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
            if (this.hasItemExpired(item)) {
                this.store.delete(key);
                return undefined;
            } else {
                return item.value;
            }
        }
    }

    public set(key: TKey, value: TValue) {
        this.store.set(key, {
            added: this.timeService.getCurrentTimeInMilliseconds(),
            value
        });
    }

    private hasItemExpired(item: ICacheItem<TValue>) {
        const itemAge = this.convertMillisecondsToMinutes(
            this.timeService.getCurrentTimeInMilliseconds() - item.added
        );

        return itemAge > this.lifeExpectancy;
    }

    private convertMillisecondsToMinutes(milliseconds: number) {
        return (milliseconds / 1000) / 60;
    }
}
