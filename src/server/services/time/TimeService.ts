import { injectable } from 'inversify';

@injectable()
export class TimeService {
    public getCurrentTimeInMilliseconds(): number {
        return Date.now();
    }
}
