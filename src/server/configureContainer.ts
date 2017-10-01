import { Container } from "inversify";
import { Log } from "./Log";

export function configureContainer(container: Container, log: Log) {
    container.bind<Log>(Log).toConstantValue(log);
}
