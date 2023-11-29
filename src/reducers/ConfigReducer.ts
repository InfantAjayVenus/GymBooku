import Config from "src/models/Config";

export enum ConfigActionType {
    INIT_CONFIG = 'INIT_CONFIG',
    UPDATE_CONFIG_DATA = 'UPDATE_CONFIG',
    UPDATE_CONFIG_DATE = 'UPDATE_CONFIG_DATE',
}
export interface ConfigAction {
    type: string;
    payload: any;
}
export default function ConfigReducer(state: Config, action: ConfigAction) {
    switch (action.type) {
        case ConfigActionType.INIT_CONFIG: {
            if ('id' in action.payload) return action.payload;
            const rawJSON = JSON.parse(JSON.stringify(action.payload));
            return Config.fromJSON(rawJSON);
        }
        case ConfigActionType.UPDATE_CONFIG_DATA: {
            return state.updateConfig(action.payload);
        }
        case ConfigActionType.UPDATE_CONFIG_DATE: {
            return state.updateDate(action.payload);
        }
        default:
            return state;
    }
}