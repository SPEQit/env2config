/**
 * A collection of environment variables with support for name prefixes.
 */
class Environment
{
    /**
     * Creates an instance of the @{link Environment} class.
     *
     * @param {Object.<string,string>} env  - The environment variable collection to wrap.
     * @param {string} prefix               - The prefix to use when getting environment variable values.
     */
    constructor(env, prefix) {
        this.env = env;
        this.prefix = prefix;
    }

    /**
     * Gets the value of an environment variable.
     *
     * @param {string} name  - The environment variable name without prefix.
     * @returns {string}     - The value of the environment variable.
     */
    get(name) {
        return this.env[this.prefix + name];
    }
}

module.exports = Environment;
