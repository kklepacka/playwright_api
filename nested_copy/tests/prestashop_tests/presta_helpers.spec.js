import { test } from '@playwright/test';
import { sendRequest,buildCustomerXML,verifyRequiredKeys,extractUserIdFromResponse } from '../helpers/helpers'; // Adjust the path as necessary


const CUSTOMERS_ENDPOINT = '/api/customers';
let USER_ID;

const CUSTOMER_REQUIRED_KEYS = ['firstname', 'lastname', 'email', 'passwd', 'id_gender'];

let customerXML;
const customerJson = {
      firstname: 'Marylin',
      lastname: 'Monroe',
      email: 'marylin@mm.com',
      passwd: 'securepassword123', // Corrected typo in 'secure'
      id_gender: '2',
      optin: '1',
      active: '1',
      newsletter: '1',
      birthday: '2000-01-01',

    }

test.describe.serial('PrestaShop Create User', () => {

  test('Get customer list', async ({ request }) => {
    
    const response = await sendRequest(request, CUSTOMERS_ENDPOINT, "GET");
    const responseBody = await response.text();
    if (response.status() !== 200) {
      console.log("Failed to get customer list: " + responseBody); // Log your custom message
      throw new Error("Expected status 200, got " + response.status()); // This will fail the test
    }
  })


  test('Setup And Delete An Account', async ({ request }) => {
    // Customer JSON structure

    // Validation against required keys
    
    verifyRequiredKeys(customerJson, CUSTOMER_REQUIRED_KEYS);

    try {
      customerXML = buildCustomerXML(customerJson);
    } catch (error) {
      console.error(error);
    }

    // Create customer
    const createResponse = await sendRequest(request, CUSTOMERS_ENDPOINT, "POST", customerXML);
    const responseText = await createResponse.text();
    if (createResponse.status() === 201) {
      USER_ID = await extractUserIdFromResponse(createResponse);
    }
    else throw new Error("Failed to create customer. Response status code: " + createResponse.status()); 
    
    console.log(`User ${customerJson.firstname} ${customerJson.lastname} with ID ${USER_ID} created successfully.`);
  });

  test('Delete An Account', async ({ request }) => {
    // Delete customer
    const deleteResponse = await sendRequest(request, `${CUSTOMERS_ENDPOINT}/${USER_ID}`, "DELETE");
    if (deleteResponse.status() === 200) {
      console.log(`User ${customerJson.firstname} ${customerJson.lastname} with ID ${USER_ID} deleted successfully.`);
    }
    else throw new Error("Failed to delete customer. Response status code: " + deleteResponse.status());
  })

});
