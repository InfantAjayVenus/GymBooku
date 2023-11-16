class Config {
    constructor(private version: string, private config:any={}) {}

    get currentVersion() {
        return this.version;
    }

    get configData() {
        return this.config;
    }

    static fromJSON(rawJSON: any) {
        return new Config(rawJSON.version, rawJSON.config);
    }

    updateConfig(config: any) {
        return new Config(this.version, {...this.config, ...config});
    }
}