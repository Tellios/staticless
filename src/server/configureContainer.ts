import { Container } from "inversify";
import { Config } from "./Config";
import { BaseController } from "./controllers/base/BaseController";
import { FrontendConfigController } from "./controllers/FrontendConfigController";
import { UploadController } from "./controllers/UploadController";
import { WikiController } from "./controllers/WikiController";
import { Log } from "./Log";
import { GitLabApiRepository } from "./services/gitlab/api/GitLabApiRepository";
import { GitLabUploadService } from "./services/gitlab/api/GitLabUploadService";
import { GitLabWikiService } from "./services/gitlab/api/GitLabWikiService";
import { MarkdownParserService } from "./services/markdown/MarkdownParserService";

export function configureContainer(container: Container, log: Log, settings: Config) {
    container.bind(Log).toConstantValue(log);
    container.bind(Config).toConstantValue(settings);

    container.bind(FrontendConfigController).to(FrontendConfigController);
    container.bind(BaseController).to(FrontendConfigController);

    container.bind(UploadController).to(UploadController);
    container.bind(BaseController).to(UploadController);

    container.bind(WikiController).to(WikiController);
    container.bind(BaseController).to(WikiController);

    container.bind(GitLabApiRepository).to(GitLabApiRepository);
    container.bind(GitLabUploadService).to(GitLabUploadService);
    container.bind(GitLabWikiService).to(GitLabWikiService);
    container.bind(MarkdownParserService).to(MarkdownParserService);
}
