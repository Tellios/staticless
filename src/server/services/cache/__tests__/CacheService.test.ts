import { CacheService } from "../CacheService";
import { TimeService } from "../../time/TimeService";

describe("CacheService", () => {
    let timeServiceMock: Partial<TimeService>;
    let cacheService: CacheService<string, string>;

    beforeEach(() => {
        timeServiceMock = {
            getCurrentTimeInMilliseconds: jest.fn(() => 0)
        };

        cacheService = new CacheService(timeServiceMock as TimeService);
    });

    describe("set", () => {
        test("should add item to cache", () => {
            cacheService.initialize(1);

            cacheService.set("key", "value");
            const value = cacheService.get("key");

            expect(value).toBe("value");
        });

        test("should replace existing item if called multiple times with same key", () => {
            cacheService.initialize(1);

            cacheService.set("key", "value1");
            cacheService.set("key", "value2");
            const value = cacheService.get("key");

            expect(value).toBe("value2");
        });
    });

    describe("get", () => {
        test("should return undefined if item has expired", () => {
            timeServiceMock.getCurrentTimeInMilliseconds = jest.fn()
                .mockImplementationOnce(() => 0)
                // 4 minutes has passed
                .mockImplementationOnce(() => 4 * 1000 * 60);

            // Life expectancy is 3 minutes
            cacheService.initialize(3);

            cacheService.set("key", "value");
            const value = cacheService.get("key");

            expect(value).toBeUndefined();
        });
    });
});
