# env2config

> Generate node-config JSON files from environment variables

## Installation

``` sh
> npm install env2config --save
```

## Usage

``` sh
> env2config
```

``` json
"scripts": {
    "gen-config": "./node_modules/.bin/env2config"
}
```

By default, the `env2config` CLI looks for `config/env2config.js` to contain the
definitions for the config JSON file to create. It will check the `$NODE_ENV`
environment variable to determine the name of the file to create in the
`config/` directory, defaulting to `development` if the environment variable is
not set.

## Author

© 2016 SPEQit <opensource@speqit.com> (https://www.speqit.com)

## License

Released under the MIT license.
