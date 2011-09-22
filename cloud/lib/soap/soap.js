/*
 * NodeJS Module to invoke HTTPS SOAP Web Services. This supports invocation of both SOAP 1.1 and SOAP 1.2 services.
 *
 * @author Roshan
 * @author Ankur
 */

// Dependencies
var http = require("http");
var https = require("https");
var xmlMapper = require("./xmlmapper");
var log = require("../log/log.js");
var serviceConfig = require("../../services/serviceConfig.js");

/**
 * SOAPClient library class. Enables invocation of SOAP Web Services using a
 * JSON Payload over HTTP(S).
 */
var SOAPClient = function() {

    // Public Functions
    this.soapRequest = soapRequest;

    // Public Constants
    this.SOAPv11 = 'http://schemas.xmlsoap.org/soap/envelope/';
    this.SOAPv12 = 'http://www.w3.org/2003/05/soap-envelope';
    this.SOAPContentType = 'application/soap+xml';

    /**
     * Transform the given JSON structure into a XML SOAP Message. Invoke the
     * service endpoint. The response is mapped to a JSON again and returned to
     * the caller.
     * 
     * @param jsonRequest
     * @param requestParams
     * @param soapVersion
     * @param callback
     */
    function soapRequest(jsonRequestObj, requestParams, successCallback, errorCallback) {

        // TODO: Validate input parameters.

        // Construct the SOAP Envelope Structure
        var soapMessageJson = createSOAPMessage(jsonRequestObj, requestParams.soapVersion);
        var soapMessageXml = xmlMapper.jsonToXml(soapMessageJson);

        // Construct the Request Object
        var httpRequestParams = {
            method : "POST",
            host : requestParams.host,
            port : requestParams.port,
            path : requestParams.uri,
            headers : {
                'host' : requestParams.host,
                'Content-Type' : 'application/soap+xml',
                'Content-Length' : soapMessageXml.toString().length,
                'action' : requestParams.action
            }
        };

        log.info("---- SOAP CALL INITIATED ----");
        log.info("SOAP Service Host: " + requestParams.host + ":" + requestParams.port);
        log.info("SOAP Service URI: " + requestParams.uri);
        log.info("SOAP HTTP Type: " + (requestParams.secure ? "https" : "http"));
        log.info("SOAP Action Header: " + requestParams.action);
        log.info("SOAP Service Request: " + soapMessageXml.toString());

        // HTTP timeouts. If timeout triggers, invoke error callback.
        var timerId = setTimeout(function() {
            log.info("---- SOAP CALL FAILED (TIMEOUT) ---- "  + requestParams.action);
            handleServiceErrors(errorCallback);
        }, serviceConfig.timeout);

        // Finally, dispatching the request
        var httpClient = (requestParams.secure) ? https : http;
        var req = httpClient.request(httpRequestParams, function(res) {

            // Stop our timer since we received the response.
            clearTimeout(timerId);

            // Response Handling
            res.setEncoding('utf8');
            var respText = '';

            // Received a chunk (Invoked once for every chunk
            // received)
            res.on('data', function(respData) {
                respText = respText + respData;
            });

            // Received all chunks
            res.on('end', function() {

                // Map XML to JSON
                log.info("SOAP Service Response: " + respText);
                jsonSOAPResp = xmlMapper.xmlToJson(respText);
                log.info("JSON Service Response: " + JSON.stringify(jsonSOAPResp));

                // Process the SOAP response.
                jsonResultData = extractResponseData(jsonSOAPResp, requestParams.soapVersion, function(jsonResultData) {

                    log.info("---- SOAP CALL SUCCESSFUL ---- "  + requestParams.action);
                    successCallback(jsonResultData);

                }, function() {

                    log.info("---- SOAP CALL FAILED (FAULT) ---- "  + requestParams.action);
                    log.error("Failed invocation of Web Service: " + requestParams.action);
                    handleServiceErrors(errorCallback);

                });

            });

        });

        req.write(soapMessageXml.toString());
        req.end();

    } // soapRequest()

    /**
     * Wrap request with SOAP Header and Envelope. Returns a "cooked" JSON
     * object which is ready to be marshalled into an XML SOAP message.
     * 
     * @param jsonRequest
     * @param soapVersion:
     *            any one from [1.1, 1.2]
     */
    function createSOAPMessage(jsonReqObj, soapVersion) {

        // Add SOAP Namespace
        jsonReqObj._namespaces.soap = soapVersion;

        // Construct the (JSON equivalent) of the SOAP Message Structure
        var soapMessage = {
            '_namespaces' : jsonReqObj['_namespaces'],
            '_xml' : {
                'soap:Envelope' : {
                    'soap:Header' : jsonReqObj._header,
                    'soap:Body' : jsonReqObj._body
                }
            }
        };

        return soapMessage;

    }

    /**
     * Extracts response data from the SOAP Envelope. Returns required biz data
     * as JSON object
     * 
     * @param jsonSOAPResponse
     * @param soapVersion:
     *            any one from [1.1, 1.2]
     */
    function extractResponseData(jsonResObj, soapVersion, successCallback, errorCallback) {

        log.info("JSON SOAP Response:" + JSON.stringify(jsonResObj));

        var jsonResDataObj = {
            _namespaces : {},
            _header : {},
            _xml : {}
        };

        // Extract Namespaces
        var soapNSPrefix = '';
        for (key in jsonResObj._namespaces) {

            // Namespace matches our current soap version
            if (jsonResObj._namespaces[key] === soapVersion) {
                soapNSPrefix = key + ':';
            }

            jsonResDataObj._namespaces[key] = jsonResObj._namespaces[key];
        }

        // Extract the data(SOAP Body and Header) from the SOAP Response
        var envelopeJSON = jsonResObj._xml[soapNSPrefix + 'Envelope'];
        if (envelopeJSON) {
            jsonResDataObj._xml = envelopeJSON[soapNSPrefix + 'Body'];
            jsonResDataObj._header = envelopeJSON[soapNSPrefix + 'Header'];
        }

        // Did we get a SOAP Fault?
        var body = envelopeJSON[soapNSPrefix + 'Body'];
        var fault = body[soapNSPrefix + 'Fault'];

        if (fault != null) {
            errorCallback();
        } else {
            return successCallback(jsonResDataObj);
        }

    } // extractResponseData()

    /**
     * Invoked when the backend SOAP call has a timeout.
     * 
     * @param errorCallback
     */
    function handleServiceErrors(errorCallback) {

        // If there is a errorCallback, invoke it.
        // Otherwise this only gets handled by our global uncaughtException
        // handler.
        if (errorCallback != null) {
            var errObj = {
                "status" : "ERR_SVC_FAILED",
                "message" : "Failed invocation of SOAP Web Service"
            };
            errorCallback(errObj);
        }

    } // handleServiceErrors()

}; // End Class SOAPClient

// Export Module
module.exports = new SOAPClient();