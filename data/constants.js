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

    static get CONSOLE() {
        return {
            get GOOD() {
                return '#1';
            },
            get WORKING() {
                return '#2';
            },
            get ERROR() {
                return '#3';
            },
            get LOADING() {
                return '#4';
            },
            get INFO() {
                return '#5';
            },
            get FOUND() {
                return '#6';
            }
        };
    }

    static get IMAGES() {
        return {
            get CHART_BACKGROUND() {
                return 'chart-bg.png';
            }
        };
    }
}

module.exports = Constants;