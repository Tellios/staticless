import { Container } from 'inversify';
import { Config } from './Config';
import { BaseController } from './controllers/base/BaseController';
import { FrontendConfigController } from './controllers/FrontendConfigController';
import { UploadController } from './controllers/UploadController';
import { WikiController } from './controllers/WikiController';
import { Log } from './Log';
import { GitLabApiRepository } from './services/gitlab/api/GitLabApiRepository';
import { GitLabUploadService } from './services/gitlab/api/GitLabUploadService';
import { GitLabProjectService } from './services/gitlab/api/GitLabProjectService';
import { GitLabWikiService } from './services/gitlab/api/GitLabWikiService';
import { MarkdownParserService } from './services/markdown/MarkdownParserService';
import { CacheService } from './services/cache/CacheService';
import { TimeService } from './services/time/TimeService';

export function configureContainer(container: Container, log: Log, config: Config) {
    container.bind(Log).toConstantValue(log);
    container.bind(Config).toConstantValue(config);

    container.bind(FrontendConfigController).to(FrontendConfigController);
    container.bind(BaseController).to(FrontendConfigController);

    container.bind(UploadController).to(UploadController);
    container.bind(BaseController).to(UploadController);

    container.bind(WikiController).to(WikiController);
    container.bind(BaseController).to(WikiController);

    container.bind(GitLabApiRepository).to(GitLabApiRepository);
    container.bind(GitLabUploadService).to(GitLabUploadService);
    container
        .bind(GitLabWikiService)
        .to(GitLabWikiService)
        .inSingletonScope();
    container
        .bind(GitLabProjectService)
        .to(GitLabProjectService)
        .inSingletonScope();
    container.bind(MarkdownParserService).to(MarkdownParserService);

    container.bind(CacheService).to(CacheService);
    container.bind(TimeService).to(TimeService);
}
