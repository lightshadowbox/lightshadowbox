function WebWorker() {
    this.onmessage = (e) => {
        const {
            data: { apiUrl, method, token },
        } = e;

        fetch(apiUrl, {
            method: method || 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: token,
            },
        })
            .then((response) => {
                return response.blob();
            })
            .then((ref) => {
                postMessage(ref);
            })
            .catch((e) => e);
    };
}

export default class WebWorkerEnabler {
    constructor() {
        let code = WebWorker.toString();
        code = code.substring(code.indexOf('{') + 1, code.lastIndexOf('}'));

        const blob = new Blob([code], { type: 'application/javascript' });
        return new Worker(URL.createObjectURL(blob));
    }
}

//  const workerInstance = new WebWorkerEnabler();

//  workerInstance.addEventListener(
//      nameMessage,
//      e => {
//        console.log(e)
//      },
//      false,
//  );
//  workerInstance.postMessage({
//      formResultId: id,
//      apiUrl: `${Config.API_SERVER}${path}`,
//      method: 'GET',
//      token: `${tokenType} ${accessToken}`,
//  });
