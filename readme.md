# Staticless
The goal of Staticless is to provide a simplified flow for viewing markdown wikis in GitLab similar to GitLab pages but without the need to generate static web pages using builds combined with deploys. Instead Staticless relies on the GitLab API to retrieve pages.

The required [GitLab API](https://docs.gitlab.com/ce/api/wikis.html) was added in GitLab 10.0, Staticless will therefore not work with versions before GitLab 10.0.

**Disclaimer: Staticless is still under development. In its current state bugs, issues, and sudden changes may occur.**

## Running Staticless
For now the only supported way of using Staticless is by using the provided [Docker container](https://store.docker.com/community/images/tellios/staticless). More ways may be added and documented in the future.

### Configuring Staticless
Configurations can be applied using configuration files using the following paths:

1. Working directory `staticless.json` file
2. `Application directory/config/staticless.json` file

#### Configuration properties

An example of this is the JSON configuration here:

```json
{
    "object": {
        "property": "value"
    }
}
```

which is equivalent to the argument `--object.property value` and the environment variable `OBJECT_PROPERTY=value`.

##### Available configuration properties

| Property            | Type     | Description                                                                  |
| ------------------- | -------- | ---------------------------------------------------------------------------- |
| frontend.title      | String   | Title displayed in the web UI.                                               |
| server.address      | String   | Host name or IP address the server will listen on, defaults to `0.0.0.0`.    |
| server.port         | Number   | Ports the server will listen on, defaults to `8080`.                         |
| cache.time          | Number   | Minutes to cache gitlab related items. `0` will disable caching.             |
| sources             | Array    | The available wikis as an array.                                             |
| sources[i].name     | String   | The name of the wiki, used to identify the wiki to users.                    |
| sources[i].homeslug | String   | The wiki slug displayed by default when no page has been selected.           |
| sources[i].apitoken | String   | Token used to authenticate with the GitLab API.                              |
| sources[i].url      | String   | Url to the GitLab instance used, for GitLab.com it is https://gitlab.com/.   |
| sources[i].projectid| Number   | The ID of the GitLab project which contains the WIKI.                        |

### Using Docker
When using docker, both the `server.address` and `server.port` configurations will always be set to their defaults. Changing the port and listener address is instead managed by exposing the container on different ports using docker port mapping.

Start a container instance of Staticless by running the following `docker run` command:

```shell
docker run \
  -d \
  -v "path/to/staticless/config/folder:/opt/app/config" \
  tellios/staticless
```
