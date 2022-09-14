# uva_request_list_profile

An ArchivesSpace plugin that introduces a request_list profile for UvA

# Configuration

This plugin depends on the `request_list` plugin. It includes a `depends_on`
directive in `config.yml`, but unfortunately a core bug means that it is
still necessary to declare `request_list` before this plugin in AppConfig,
like this:

```ruby
AppConfig[:plugins] = [
                       ...
                       'request_list',
                       'uva_request_list_profile',
                       ...
                      ]
```

> Note: the bug is that public app locale files are loaded in AppConfig
> order rather than dependency order.

Then to configure `request_list` for the UvA handler, use an entry like this:

```ruby
AppConfig[:request_list] = {
  :button_position => 0,
  :record_types => ['archival_object', 'resource', 'top_container'],

  :request_handlers => {
    :uva_handler => {
      :name => 'UvA TopDesk Broker',
      :profile => :uva_topdesk,
      :broker_url => '[URL OF TOPDESK BROKER ENDPOINT]',
    }
  },
  :repositories => {
    :default => {
      :handler => :uva_handler,
    }
  }
}
```
