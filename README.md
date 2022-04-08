## Fetch 库
封装原生 fetch，支持 `get` `post` `rawJson` `formdata`

```javascript
import Request from 'yz-fetch'

Request("url", {
    method: "get",
    body: { ...params }
});
```
