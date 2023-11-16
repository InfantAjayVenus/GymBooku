import { createContext } from "react";
import useStoredReducer from "src/hooks/useStoredReducer";
import ConfigReducer, { ConfigActionType } from "src/reducers/ConfigReducer";

interface ConfigContextType {
    config: Config;
    updateConfig: (config: any) => void;
}

export const ConfigContext = createContext<ConfigContextType>({
    config: new Config('1.0'),
    updateConfig: (_: any) => {},
});

export default function ConfigProvider({ children }: { children: React.ReactNode }) {
    const [config, configDispatch] = useStoredReducer(
        'WORKOUT_CONFIG',
        ConfigReducer,
        new Config('1.0'),
        (state) => ({ type: ConfigActionType.INIT_CONFIG, payload: state })
    )
    return (
        <ConfigContext.Provider value={{ config, updateConfig: (config: any) => configDispatch({ type: ConfigActionType.UPDATE_CONFIG, payload: config }) }}>
            {children}
        </ConfigContext.Provider>
    );
}