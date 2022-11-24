## discourse-client-performance

A plugin which collects performance information from client browsers and writes it to a log file for later analysis. Each line of
the log file should be parsed as JSON.

### Configuration

The plugin is disabled-by-default. It is configured using site settings (which, as normal, can be overridden for an entire
cluster using environment variables).

- **client performance enabled** (`DISCOURSE_CLIENT_PERFORMANCE_ENABLED`) (default: `false`): Set 'true' to enable the plugin

Data will be written to `log/client-performance.log` in the Rails App directory. If using something similar to the standard
installation described in `https://github.com/discourse/discourse_docker`, you will probably want to link that file to another
location. For core's logs, that is handled [here](https://github.com/discourse/discourse_docker/blob/e0f27d1340/templates/web.template.yml#L101-L102).
To mimic that configuration for `client-performance.log`, you should add something like this to your app.yml file:

```yaml
- exec:
    cd: $home
    cmd:
      - touch -a /shared/log/rails/client-performance.log
      - ln -s /shared/log/rails/client-performance.log $home/log
```
