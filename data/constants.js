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
                },
                get LOCK_CLOSED() {
                    return '🔒';
                },
                get KEY_LOCKED() {
                    return '🔐';
                },
                get FILE_CABINET() {
                    return '🗄️'
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
                return 32188084552374576;
            }
        };
    }

    static get GIT() {
        return {
            get START_DAYS_BACK_FROM_TODAY() {
                return 30;
            },
            get GRAPH() {
                return {
                    get SIZEX() {
                        return 1000;
                    },
                    get SIZEY() {
                        return 600;
                    }
                };
            },
            get PIECHART() {
                return {
                    get SIZEX() {
                        return 1000;
                    },
                    get SIZEY() {
                        return 1000;
                    }
                };
            }
        };
    }
}

module.exports = Constants;