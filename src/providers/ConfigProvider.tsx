import { createContext } from "react";
import useRecurringTimer from "src/hooks/useRecurringTimer";
import useStoredReducer from "src/hooks/useStoredReducer";
import Config from "src/models/Config";
import ConfigReducer, { ConfigActionType } from "src/reducers/ConfigReducer";
import compareDatesOnly from "src/utils/compareDatesOnly";

interface ConfigContextType {
    config: Config;
    updateConfig: (config: any) => void;
}

export const ConfigContext = createContext<ConfigContextType>({
    config: new Config('1.0', new Date()),
    updateConfig: (_: any) => { },
});

export default function ConfigProvider({ children }: { children: React.ReactNode }) {
    const [config, configDispatch] = useStoredReducer(
        'WORKOUT_CONFIG',
        ConfigReducer,
        new Config('1.0', new Date()),
        (state) => ({ type: ConfigActionType.INIT_CONFIG, payload: state })
    )

    useRecurringTimer(() => {
        const newDate = new Date();
        if (compareDatesOnly(newDate, config.date)) return;
        configDispatch({ type: ConfigActionType.UPDATE_CONFIG_DATE, payload: newDate as any });
    }, (1000 * 60) * 5);

    return (
        <ConfigContext.Provider
            value={{
                config,
                updateConfig: (updatedConfig: any) => configDispatch({ type: ConfigActionType.UPDATE_CONFIG_DATA, payload: { ...updatedConfig } })
            }}>
            {children}
        </ConfigContext.Provider>
    );
}