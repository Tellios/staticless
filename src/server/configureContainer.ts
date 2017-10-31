import { Container } from "inversify";
import { Config } from "./Config";
import { BaseController } from "./controllers/base/BaseController";
import { FrontendConfigController } from "./controllers/FrontendConfigController";
import { WikiController } from "./controllers/WikiController";
import { Log } from "./Log";
import { GitLabApiRepository } from "./services/gitlab/api/GitLabApiRepository";
import { GitLabWikiService } from "./services/gitlab/api/GitLabWikiService";

export function configureContainer(container: Container, log: Log, settings: Config) {
    container.bind(Log).toConstantValue(log);
    container.bind(Config).toConstantValue(settings);

    container.bind(FrontendConfigController).to(FrontendConfigController);
    container.bind(BaseController).to(FrontendConfigController);
    container.bind(WikiController).to(WikiController);
    container.bind(BaseController).to(WikiController);

    container.bind(GitLabApiRepository).to(GitLabApiRepository);
    container.bind(GitLabWikiService).to(GitLabWikiService);
}
