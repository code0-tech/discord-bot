class Constants {
    static get DISCORD() {
        return {
            STATUS: {
                get ONLINE() {
                    return 'online';
                }
            },
            PERMS: {
                get USER_OVERRIDE() {
                    return 1;
                }
            },
            EMOJIS: {
                get CUSTOM() {
                    return {
                        get PBL0() {
                            return '<:pbl0:1273720212536954972>';
                        },
                        get PBL1() {
                            return '<:pbl1:1273720260633297029>';
                        },
                        get PBM0() {
                            return '<:pbm0:1273720276839829564>';
                        },
                        get PBM1() {
                            return '<:pbm1:1273720293822697624>';
                        },
                        get PBR0() {
                            return '<:pbr0:1273720327335313418>';
                        },
                        get PBR1() {
                            return '<:pbr1:1273720346809339976>';
                        }
                    }
                },
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
            },
            get EPOCH_OFFSET() {
                return 1420070400000; // (01-01-2015) for Discord
            },
            get SNOWFLAKE_DIVIDER() { // part of: const timestamp = (id / Constants.DISCORD.SNOWFLAKE_DIVIDER) + Constants.DISCORD.EPOCH_OFFSET;
                return 4194304;
            },
            get EMBED_IMAGE_NAME() { // Used for simple Attachment image naming and retrieving
                return {
                    get BUILDER() {
                        return {
                            get DEFAULT_PNG_01() {
                                return 'default_01.png';
                            },
                        }
                    },
                    get EMBED() {
                        return {
                            get DEFAULT_PNG_01() {
                                return 'attachment://default_01.png';
                            }
                        }
                    }
                }
            }
        }
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
        }
    }

    static get SYMBOLS() {
        return {
            get PERCENTAGE() {
                return '%';
            }
        }
    }

    static get IMAGES() {
        return {
            get CHART_BACKGROUND() {
                return 'chart-bg.png';
            }
        }
    }

    static get SEEDS() {
        return {
            get GITCHART() {
                return 32188084552374576; // Seed for user colors
            }
        }
    }

    static get GIT() {
        return {
            get GITHUB_SCOPES() {
                return 'user:read read:org'
            },
            get START_DAYS_BACK_FROM_TODAY() { // Git rank graph total days
                return 30;
            },
            get GRAPH() {
                return {
                    get SIZEX() {
                        return 1000;
                    },
                    get SIZEY() {
                        return 600;
                    },
                    get SCHEDULE() {
                        return '0 16 * * *';
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
            },
            get URL() {
                return {
                    OAUTH_LINK(state, scope) {
                        return `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&state=${state}&scope=${encodeURIComponent(scope)}`;
                    },
                    get GRAPHQL() {
                        return 'https://api.github.com/graphql';
                    },
                    get ACCESS_TOKEN() {
                        return 'https://github.com/login/oauth/access_token';
                    }
                }
            }
        }
    }

    static get SETTINGS() {
        return {
            get DATE() {
                return {
                    get LOCALE() {
                        return {
                            get GERMAN() {
                                return 'de-DE';
                            },
                            get US() {
                                return 'en-US';
                            }
                        }
                    }
                }
            },
            get ENCODING() {
                return {
                    get UTF8() {
                        return 'utf-8';
                    },
                    get ASCII() {
                        return 'ASCII';
                    },
                    get HEX() {
                        return 'hex';
                    }
                }
            }
        }
    }


    static get TIME_MULTIPLIER_MS() {
        return {
            get SECONDS() {
                return 1000;
            },
            get MINUTE() {
                return 1000 * 60;
            },
            get DAY() {
                return 1000 * 60 * 60 * 24;
            },
            get MONTH() {
                return 1000 * 60 * 60 * 24 * 30;
            }
        }
    }

    static get MONGO() {
        return {
            get SORT() {
                return {
                    get ASC() {
                        return 1;
                    },
                    get DESC() {
                        return -1;
                    }
                }
            }
        }
    }

    static get CRYPTO() {
        return {
            get ALGORITHM() {
                return 'aes-256-cbc';
            },
            get SALT() {
                return 'salt';
            },
            get KEYLEN() {
                return 32;
            }
        }
    }
}


module.exports = Constants;