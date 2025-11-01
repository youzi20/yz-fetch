export function isValid<T extends any>(val: T): boolean {
  if (Array.isArray(val)) return val.length > 0;

  return val !== "" && val !== null && val !== undefined && JSON.stringify(val) !== "{}";
}

export const trimParams = (arg: Record<string, any> | any[] = {}, callback?: (value: [string, any]) => void) => {
  if (Array.isArray(arg)) return arg.filter(Boolean);

  const params: Record<string, any> = {};

  Object.entries(arg).forEach(([key, value]) => {
    if (value === undefined || value === null || value == "") return;

    params[key] = value;
    callback?.([key, value]);
  });

  return params;
};

export const encodeParams = (arg: Record<string, any> = {}, trim?: boolean) => {
  const params: string[] = [];

  trimParams(arg, ([key, value]: [string, any]) => {
    params.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`);
  });

  return params.join("&");
};

export const formDataParams = (arg: Record<string, any> = {}, trim?: boolean) => {
  const formData = new FormData();

  trimParams(arg, ([key, value]: [string, any]) => {
    if (value instanceof File) {
      if (Array.isArray(value)) {
        value.forEach(v => formData.append(key, v));
      } else {
        formData.append(key, value);
      }
    } else if (value instanceof Object) {
      formData.append(key, JSON.stringify(value));
    } else {
      formData.append(key, value);
    }
  });

  return formData;
};
