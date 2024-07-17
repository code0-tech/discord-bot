class Constants {
    static get DISCORD() {
        return {
            PERMS: {
                get USER_OVERRIDE() {
                    return 1;
                }
            },
            EMOJIS: {
                get COMMAND_APPLY() {
                    return '💌';
                },
                get COMMAND_SUPPORT() {
                    return '📞';
                },
                get COMMAND_APPLICATION() {
                    return '💌';
                },
                get COMBINELINE() {
                    return '｜';
                },
                get FIRSTPLACE() {
                    return '🥇';
                },
                get SECONDPLACE() {
                    return '🥈';
                },
                get THIRDPLACE() {
                    return '🥉';
                },
                get TROPHY() {
                    return '🏆';
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

    static get SEEDS() {
        return {
            get GITCHART() {
                return 232;
            }
        };
    }
}

module.exports = Constants;