import { XMLBuilder } from 'fast-xml-parser';
export async function sendRequest(requestContext, endpoint, method, body = null) {
  // Convert method to lowercase to standardize it
  const methodName = method.toLowerCase();

  // Check if the method is supported
  if (!['get', 'post', 'put', 'delete'].includes(methodName)) {
    throw new Error(`Unsupported method: ${method}`);
  }

  // Prepare the options for the fetch request
  const options = {
    method: methodName, // Specifies the method
  };

  // Conditionally add the body for POST and PUT requests
  if (['post', 'put'].includes(methodName) && body !== null) {
    options.headers = {
      'Content-Type': 'application/xml', // Set content type as XML
    };
    options.data = body; // Directly assign the XML string as the body
  }

  // Dynamically call the method based on methodName
  const response = await requestContext[methodName](endpoint, options);
  return response; // Consider processing the response based on the expected format
}

export function buildCustomerXML(customerData) {
  // Define the structure of the customer JSON object
  const customerJson = {
    prestashop: {
      "@_xmlns:xlink": "http://www.w3.org/1999/xlink",
      customer: customerData
    }
  };

  // XML Builder options
  const options = {
    format: true,
    ignoreAttributes: false,
    attributeNamePrefix: "@_", // Ensuring consistency with prefix usage
  };

  // Assuming XMLBuilder is already imported or available in this scope
  const builder = new XMLBuilder(options);
  const xmlContent = builder.build(customerJson);

  return xmlContent;
}

export function verifyRequiredKeys(customerJson, CUSTOMER_REQUIRED_KEYS) {
  // Validation against required keys
  CUSTOMER_REQUIRED_KEYS.forEach(key => {
    if (!customerJson.hasOwnProperty(key)) {
      throw new Error(`Missing required customer key: ${key}`);
    }
  });
};


export async function extractUserIdFromResponse(response) {
  const xmlResponse = await response.text();
  const userIdMatch = xmlResponse.match(/<id><!\[CDATA\[(.*?)\]\]><\/id>/);
  const USER_ID = userIdMatch ? userIdMatch[1] : null;
  
  if (!USER_ID) {
    throw new Error("Failed to extract user ID from response.");
  }
  return USER_ID;
}
