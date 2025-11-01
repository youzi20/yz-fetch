import { encodeParams, formDataParams, trimParams } from "./helpers";
import {
  HandleCatchMessage,
  HandleErrorMessage,
  HandleSuccessMessage,
  OptionsType,
  RequestClientConfig,
  ResponseType,
} from "./type";

export class RequestClient {
  private baseUrl: string;
  private debug: boolean;

  constructor(config: RequestClientConfig) {
    this.baseUrl = config.baseUrl;
    this.debug = config.debug ?? false;
  }

  async request<T>(url: string, options: OptionsType = {}): Promise<T | null> {
    const [fullUrl, init, handlers] = this.createFetchRequest(url, options);

    try {
      if (this.debug) console.debug("[Request Start]", fullUrl, init);

      const response = await fetch(fullUrl, init);

      if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);

      const contentType = response.headers.get("content-type") || "";
      let res: ResponseType<T> | null = null;

      if (contentType.includes("application/json")) res = await response.json();

      if (res) {
        if (res.code === 200) {
          handlers.handleSuccessMessage?.(res);
          return res.data;
        } else {
          handlers.handleErrorMessage?.(res);
        }
      }

      return null;
    } catch (error: any) {
      if (this.debug) {
        console.error("[Request Error]", error);
      }

      handlers.handleCatchMessage?.(error);
      return null;
    }
  }

  private createFetchRequest(
    url: string,
    options: OptionsType
  ): [
    string,
    RequestInit,
    {
      handleSuccessMessage?: HandleSuccessMessage;
      handleErrorMessage?: HandleErrorMessage;
      handleCatchMessage?: HandleCatchMessage;
    }
  ] {
    const {
      auth,
      trim = true,
      body,
      rawJson,
      formData,
      formUrlencoded,
      handleSuccessMessage,
      handleErrorMessage,
      handleCatchMessage,
      method = "GET",
      headers = {},
      ...rest
    } = options;

    const requestHeaders = new Headers(headers);

    const requestInit: RequestInit = {
      method,
      credentials: "include",
      redirect: "follow",
      ...rest,
      headers: requestHeaders,
    };

    var fullUrl = new URL(url.match(/^https?:\/\//) ? url : `${this.baseUrl}${url}`);

    if (method === "GET" && body) {
      trimParams(body, ([key, value]) => {
        fullUrl.searchParams.append(key, value);
      });
    } else if (method === "PUT") {
      requestInit.body = body as File;
    } else if (method === "POST") {
      if (rawJson) {
        requestHeaders.set("Content-Type", "application/json; charset=utf-8");
        requestInit.body = JSON.stringify(trim ? trimParams(rawJson) : rawJson);
      } else if (formUrlencoded) {
        requestHeaders.set("Content-Type", "application/x-www-form-urlencoded; charset=utf-8");
        requestInit.body = encodeParams(formUrlencoded, trim);
      } else if (formData) {
        requestInit.body = formDataParams(formData, trim);
      }
    }

    return [
      fullUrl.toString(),
      requestInit,
      {
        handleSuccessMessage,
        handleErrorMessage,
        handleCatchMessage,
      },
    ];
  }
}
