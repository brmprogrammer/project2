
module.exports = (req, res, next) => {
    const axios = require('axios');
    const config = require('./config.js');
    let name = req.body.name;
    let number = req.body.phone;
    let newFact = JSON.stringify(req.body.fact[0]);
    newFact = newFact.replace(/[{}, "", \\ ]/g, ' ');
    let specialMessage = `Thank you, ${name} for signing up for text alerts at ${new Date().toLocaleTimeString()} ${JSON.stringify(newFact)}!`
    res.end(specialMessage);

    const validateNotEmpty = (value, fieldName) => {
        if (!value) {
            throw `${fieldName} parameter is mandatory`;
        }
    }

    const buildUrl = (url) => {
        return `https://${url}/sms/2/text/advanced`;
    }

    const buildHeaders = (apiKey) => {
        return {
            'Content-Type': 'application/json',
            'Authorization': `App ${apiKey}`
        };
    }

    const buildAxiosConfig = (apiKey) => {
        return {
            headers: buildHeaders(apiKey)
        };
    }

    const buildRequestBody = (destinationNumber, message) => {
        const destinationObject = {
            to: destinationNumber
        };
        const messageObject = {
            destinations: [destinationObject],
            text: message
        };
        return {
            messages: [messageObject]
        }
    }

    const parseSuccessResponse = (axiosResponse) => {
        const responseBody = axiosResponse.data;
        const singleMessageResponse = responseBody.messages[0];
        return {
            success: true,
            'messageId': singleMessageResponse.messageId,
            'status': singleMessageResponse.status.name,
            'category': singleMessageResponse.status.groupName
        };
    }

    const parseFailedResponse = (axiosError) => {
        if (axiosError.response) {
            const responseBody = axiosError.response.data;
            return {
                success: false,
                errorMessage: responseBody.requestError.serviceException.text,
                errorDetails: responseBody
            };
        }
        return {
            success: false,
            errorMessage: axiosError.message
        };
    }

    destinationNumber = number;

    function sendSms(config, destinationNumber, message) {
        validateNotEmpty(config.url, 'config.url');
        validateNotEmpty(config.apiKey, 'config.apiKey');
        validateNotEmpty(destinationNumber, 'destinationNumber');
        validateNotEmpty(message, 'message');

        const url = buildUrl(config.url);
        const requestBody = buildRequestBody(destinationNumber, message);
        const axiosConfig = buildAxiosConfig(config.apiKey);

        console.log('POST ', url, ' body ', JSON.stringify(requestBody, null, 2));

        return axios.post(url, requestBody, axiosConfig)
            .then(res => parseSuccessResponse(res))
            .catch(err => parseFailedResponse(err));
    }

    sendSms(config, destinationNumber, specialMessage);
}
