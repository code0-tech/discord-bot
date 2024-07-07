class Constants {
    static EXAMPLE = "Example";


    static get DISCORD() {
        return {
            PERMS: {
                get USER_OVERRIDE() {
                    return 1;
                }
            }
        };
    }
}

module.exports = Constants;