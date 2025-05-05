import axios from 'axios';
import { XMLParser } from 'fast-xml-parser';

const NAMESPACE = "http://tempuri.org/"; // your fixed namespace

export const callSoapService = async (url, methodName, parameters = {}) => {
    const paramXML = Object.entries(parameters)
        .map(([key, value]) => `<${key}>${value}</${key}>`)
        .join('');

    const soapEnvelope = `<?xml version="1.0" encoding="utf-8"?>
  <soap:Envelope 
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
    xmlns:xsd="http://www.w3.org/2001/XMLSchema" 
    xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
    <soap:Body>
      <${methodName} xmlns="${NAMESPACE}">
        ${paramXML}
      </${methodName}>
    </soap:Body>
  </soap:Envelope>`;

    const soapAction = `${NAMESPACE}${methodName}`;

    try {
        const { data } = await axios.post(url, soapEnvelope, {
            headers: {
                'Content-Type': 'text/xml;charset=utf-8',
                'SOAPAction': soapAction,
            },
        });

        const parser = new XMLParser({ ignoreAttributes: false });
        const response = parser.parse(data);

        // 🔍 Extract actual result
        const body = response['soap:Envelope']['soap:Body'];
        const methodResponse = body[`${methodName}Response`];
        const result = methodResponse[`${methodName}Result`];
        
        return result;

    } catch (error) {
        console.error('SOAP error:', error);
        throw error;
    }
};
