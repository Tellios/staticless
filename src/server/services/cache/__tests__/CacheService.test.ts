import { CacheService } from '../CacheService';
import { TimeService } from '../../time/TimeService';
import { Config } from '../../../Config';

describe('CacheService', () => {
    let timeServiceMock: Partial<TimeService>;
    let configMock: Partial<Config>;
    let cacheService: CacheService<string, string>;

    beforeEach(() => {
        timeServiceMock = {
            getCurrentTimeInMilliseconds: jest.fn(() => 0)
        };

        configMock = {
            get: jest.fn(() => ({
                cache: {
                    time: 30
                }
            }))
        };

        cacheService = new CacheService(timeServiceMock as TimeService, configMock as Config);
    });

    describe('set', () => {
        test('should add item to cache', () => {
            cacheService.initialize();

            cacheService.set('key', 'value');
            const value = cacheService.get('key');

            expect(value).toBe('value');
        });

        test('should replace existing item if called multiple times with same key', () => {
            cacheService.initialize();

            cacheService.set('key', 'value1');
            cacheService.set('key', 'value2');
            const value = cacheService.get('key');

            expect(value).toBe('value2');
        });

        test('should not cache item if cache time is set to 0', () => {
            configMock.get = jest.fn(() => ({
                cache: {
                    time: 0
                }
            }));

            cacheService.initialize();

            cacheService.set('key', 'value1');
            const value = cacheService.get('key');

            expect(value).toBeUndefined();
        });
    });

    describe('get', () => {
        test('should return undefined if item has expired', () => {
            timeServiceMock.getCurrentTimeInMilliseconds = jest
                .fn()
                .mockImplementationOnce(() => 0)
                // 4 minutes has passed
                .mockImplementationOnce(() => 4 * 1000 * 60);

            // Life expectancy is 3 minutes
            configMock.get = jest.fn(() => ({
                cache: {
                    time: 3
                }
            }));

            cacheService.initialize();

            cacheService.set('key', 'value');
            const value = cacheService.get('key');

            expect(value).toBeUndefined();
        });
    });
});
