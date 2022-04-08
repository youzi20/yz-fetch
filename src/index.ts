import { filterParams, trimParams, trimFormDataParams } from "./utils";

type HandleErrorMessage = (response: any) => any
type HandleCatchMessage = (error: Error) => any

type OptionsProps = {
    method?: "GET" | "POST"
    credentials?: RequestCredentials
    headers?: string[][] | Record<string, string>
    body?: Record<string, any> | string
    rawJson?: Record<string, any>
    formdata?: Record<string, any>
    handleErrorMessage?: HandleErrorMessage
    handleCatchMessage?: HandleCatchMessage
}


interface RequestInit {
    /**
     * A BodyInit object or null to set request's body.
     */
    body?: BodyInit | null;
    /**
     * A string indicating how the request will interact with the browser's cache to set request's cache.
     */
    cache?: RequestCache;
    /**
     * A string indicating whether credentials will be sent with the request always, never, or only when sent to a same-origin URL. Sets request's credentials.
     */
    credentials?: RequestCredentials;
    /**
     * A Headers object, an object literal, or an array of two-item arrays to set request's headers.
     */
    headers?: HeadersInit;
    /**
     * A cryptographic hash of the resource to be fetched by request. Sets request's integrity.
     */
    integrity?: string;
    /**
     * A boolean to set request's keepalive.
     */
    keepalive?: boolean;
    /**
     * A string to set request's method.
     */
    method?: string;
    /**
     * A string to indicate whether the request will use CORS, or will be restricted to same-origin URLs. Sets request's mode.
     */
    mode?: RequestMode;
    /**
     * A string indicating whether request follows redirects, results in an error upon encountering a redirect, or returns the redirect (in an opaque fashion). Sets request's redirect.
     */
    redirect?: RequestRedirect;
    /**
     * A string whose value is a same-origin URL, "about:client", or the empty string, to set request's referrer.
     */
    referrer?: string;
    /**
     * A referrer policy to set request's referrerPolicy.
     */
    referrerPolicy?: ReferrerPolicy;
    /**
     * An AbortSignal to set request's signal.
     */
    signal?: AbortSignal | null;
    /**
     * Can only be null. Used to disassociate request from any Window.
     */
    window?: any;
}

const optionInit = (url: string, params: OptionsProps): [string, RequestInit, { handleErrorMessage: HandleErrorMessage, handleCatchMessage: HandleCatchMessage }] => {
    const defaultConfig = {
        method: "GET",
        // credentials: 'include',
        handleErrorMessage(response: any) {
            console.log(response);
            // antdMessage.error(response?.message);
        },
        handleCatchMessage(error: Error) {
            console.log(error)
        }
    }

    const { body, rawJson, formdata, handleErrorMessage, handleCatchMessage, ...other } = Object.assign({}, defaultConfig, params);
    const options: RequestInit = Object.assign({}, other);


    if (other.method === "GET" && body) {
        url += "?" + trimParams(body);
    } else if (other.method === "POST") {
        if (rawJson) {
            options.headers = {
                "Content-Type": "application/json; charset=utf-8"
            }

            options.body = JSON.stringify(filterParams(rawJson));
        } else if (formdata) {
            options.body = trimFormDataParams(formdata);
        }
    }

    return [url, options || {}, { handleErrorMessage, handleCatchMessage }];
}

export default function Request(url: string, params?: OptionsProps) {
    const [urls, options, callback] = optionInit(url, params ?? {});

    return fetch(urls, options)
        .then((body) => {
            return body.json()
        })
        .then((res) => {
            const { code, result } = res;
            if (code === 0) {
                return result;
            } else {
                callback.handleErrorMessage(res);
            }
        })
        .catch((error) => {
            callback.handleCatchMessage(error);
        });
}