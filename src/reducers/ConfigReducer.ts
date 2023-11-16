export enum ConfigActionType {
    INIT_CONFIG = 'INIT_CONFIG',
    UPDATE_CONFIG = 'UPDATE_CONFIG',
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
        case ConfigActionType.UPDATE_CONFIG: {
            return state.updateConfig(action.payload);
        }
        default:
            return state;
    }
}