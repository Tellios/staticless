import { Container } from "inversify";
import { BaseController } from "./controllers/base/BaseController";
import { HomeController } from "./controllers/HomeController";
import { Log } from "./Log";

export function configureContainer(container: Container, log: Log) {
    container.bind<Log>(Log).toConstantValue(log);

    container.bind<HomeController>(HomeController).to(HomeController);
    container.bind<BaseController>(BaseController).to(HomeController);
}
