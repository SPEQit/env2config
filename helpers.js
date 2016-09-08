/**
 * Provides helper functions that can be used inside env2json scripts.
 * @module helpers
 */
module.exports = {
    /**
     * Creates a function-based definition that unsets the related JSON key if
     * the requested environment variable is `false`.
     *
     * @param {string} env  - The environment variable (without prefix) to use.
     * @returns {Function}  - The function-based definition for the JSON key.
     */
    true_or_undefined: function true_or_undefined(env) {
        return (get) => {
            var value = get.asBoolean(env);
            if (!value) { return undefined; }
            return value;
        };
    },

    /**
     * Creates a function-based definition that unsets the related JSON key if
     * the requested environment variable is `true`.
     *
     * @param {string} env  - The environment variable (without prefix) to use.
     * @returns {Function}  - The function-based definition for the JSON key.
     */
    false_or_undefined: function false_or_undefined(env) {
        return (get) => {
            var value = get.asBoolean(env);
            if (value) { return undefined; }
            return value;
        };
    }
};
