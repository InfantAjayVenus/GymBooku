export default class Config {
    constructor(private version: string, private _date: Date, private config: any = {}) { }

    get currentVersion() {
        return this.version;
    }

    get  date() {
        return this._date;
    }

    get data() {
        return this.config;
    }

    static fromJSON(rawJSON: any) {
        return new Config(rawJSON.version, new Date(rawJSON._date), rawJSON.config);
    }

    updateDate(date: Date) {
        return new Config(this.version, date, this.config);
    }

    updateConfig(config: any) {
        return new Config(this.version, this._date, { ...this.config, ...config });
    }
}