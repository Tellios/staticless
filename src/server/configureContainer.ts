import { Container } from "inversify";
import { Config } from "./Config";
import { BaseController } from "./controllers/base/BaseController";
import { WikiController } from "./controllers/WikiController";
import { Log } from "./Log";
import { GitLabApiRepository } from "./services/gitlab/api/GitLabApiRepository";
import { GitLabWikiService } from "./services/gitlab/api/GitLabWikiService";

export function configureContainer(container: Container, log: Log, settings: Config) {
    container.bind<Log>(Log).toConstantValue(log);
    container.bind<Config>(Config).toConstantValue(settings);

    container.bind<WikiController>(WikiController).to(WikiController);
    container.bind<BaseController>(BaseController).to(WikiController);

    container.bind<GitLabApiRepository>(GitLabApiRepository).to(GitLabApiRepository);
    container.bind<GitLabWikiService>(GitLabWikiService).to(GitLabWikiService);
}
