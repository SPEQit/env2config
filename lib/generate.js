var _ = require('lodash'),
    Environment = require('./environment');

/**
 * Generates a JSON object from the provided env2json definitions object.
 *
 * @param {Object} definitions  - The definitions object to use for building the JSON object.
 * @param {Object} [config]     - The configuration settings for the generation process.
 * @param {string} [config.prefix]          - A prefix common to all environment variables.
 * @param {Function} [config.null_handler]  - A function that suggests how to deal with empty values in the output object.
 * @param {Object.<string,string>} [environment]  - A custom collection of environment variables.
 *                                                  Defaults to `process.env` if not provided.
 *
 * @returns {Object}  - A JSON object built from the provided definitions and environment.
 */
function generate(definitions, config, environment) {
    config = _.defaults({},
        definitions.$config,
        config,
        {
            prefix: '',
            null_handler: () => undefined
        });

    var env = new Environment(environment || process.env, config.prefix),
        get = make_get(env);

    return build_object(_.omit(definitions, '$config'), config, env, get);
}

function parseBoolean(b) {
    return !(/^(false|off|no|0)$/i).test(b) && !!b;
}

/**
 * Creates the `get` function object provided to function-based definitions.
 * @private
 *
 * @param {Environment} env  - The environment variable collection to use.
 * @returns {Function}       - The `get` function object.
 */
function make_get(env) {
    /**
     * Returns the value of the requested environment variable.
     * @param {string} k  - The name of the environment variable (without prefix).
     * @returns {string}  - The value of the environment variable.
     */
    var get = k => env.get(k);

    /**
     * Returns the value of the requested environment variable as a Javascript boolean.
     * @param {string} k  - The name of the environment variable (without prefix).
     * @returns {boolean} - The value of the environment variable.
     */
    get.asBoolean = k => parseBoolean(env.get(k));
    /**
     * Returns the value of the requested environment variable as an integer Javascript number.
     * @param {string} k  - The name of the environment variable (without prefix).
     * @returns {number}  - The value of the environment variable.
     */
    get.asInt = k => parseInt(env.get(k));
    /**
     * Returns the value of the requested environment variable as a floating-point Javascript number.
     * @param {string} k  - The name of the environment variable (without prefix).
     * @returns {number}  - The value of the environment variable.
     */
    get.asFloat = k => parseFloat(env.get(k));
    /**
     * Returns the value of the requested environment variable as a JSON object.
     * @param {string} k  - The name of the environment variable (without prefix).
     * @returns {Object}  - The value of the environment variable.
     */
    get.asObject = k => JSON.parse(env.get(k));

    return get;
}

/**
 * Recursively builds a JSON object based on the provided source object and environment.
 * @private
 *
 * @param {Object}   source  - The definitions object specifying the output schema and mapped environment variables.
 * @param {Object}   config  - The configuration object for the operation.
 * @param {string}   config.prefix       - A prefix common to all environment variables.
 * @param {Function} config.null_handler - A function that suggests how to deal with empty values in the output object.
 * @param {Object.<string,string>} env   - The environment variable collection to use.
 * @param {Function} get     - The getter function to provide to function-based definitions.
 *
 * @returns {Object}  - A JSON object built from the provided parameters.
 */
function build_object(source, config, env, get) {
    var dest = {};

    for (var key of Object.getOwnPropertyNames(source)) {
        var value;

        switch (typeof source[key]) {
        case 'string':
            value = env.get(source[key]);
            break;
        case 'object':
            value = build_object(source[key], config, env, get);
            break;
        case 'function':
            value = source[key](get);
            break;
        default:
            value = source[key];
        }
        if (value == null) {
            value = config.null_handler(key, get);
        }

        if (value !== undefined) {
            dest[key] = value;
        }
    }

    return dest;
}

module.exports = generate;
