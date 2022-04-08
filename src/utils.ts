export const filterParams = (value: any) => {
    const params: any = {};

    Object.entries(value).forEach(([key, value]) => {
        if (value !== undefined && value !== "") {
            params[key] = value;
        }
    });

    return params;
}

export const trimParams = (value: any) => {
    return Object.entries(filterParams(value)).map(([value, key]) => `${value}=${key}`).join("&");
}

export const trimFormDataParams = (value: any) => {
    const formData = new FormData();

    Object.entries(filterParams(value)).forEach(([key, value]: [string, any]) => {
        if (value === undefined || value === "") {

        } else if (value instanceof Object) {
            formData.append(key, JSON.stringify(value));
        } else {
            formData.append(key, value);
        }
    })

    return formData;
}