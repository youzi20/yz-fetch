export interface ResponseType<T = any> {
  code: number;
  data: T;
  message: string;
}

export type HandleSuccessMessage = (response: ResponseType) => any;
export type HandleErrorMessage = (response: ResponseType) => any;
export type HandleCatchMessage = (error: Error) => any;

export interface OptionsType extends Omit<RequestInit, "body"> {
  auth?: boolean;
  trim?: boolean;
  body?: Record<string, any> | File;
  rawJson?: Record<string, any>;
  formData?: Record<string, any>;
  formUrlencoded?: Record<string, any>;
  handleSuccessMessage?: HandleSuccessMessage;
  handleErrorMessage?: HandleErrorMessage;
  handleCatchMessage?: HandleCatchMessage;
}

export interface RequestClientConfig {
  baseUrl: string;
  debug?: boolean;
}
