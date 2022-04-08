declare type HandleErrorMessage = (response: any) => any;
declare type HandleCatchMessage = (error: Error) => any;
declare type OptionsProps = {
    method?: "GET" | "POST";
    credentials?: RequestCredentials;
    headers?: string[][] | Record<string, string>;
    body?: Record<string, any> | string;
    rawJson?: Record<string, any>;
    formdata?: Record<string, any>;
    handleErrorMessage?: HandleErrorMessage;
    handleCatchMessage?: HandleCatchMessage;
};
declare function Request(url: string, params?: OptionsProps): Promise<any>;

export { Request as default };
