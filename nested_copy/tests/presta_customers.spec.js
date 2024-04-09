// Import necessary modules
import { test, expect } from '@playwright/test';
import { XMLParser, XMLBuilder } from 'fast-xml-parser';

test.describe.serial('PrestaShop Create User', () => {

  const CUSTOMER_REQUIRED_KEYS = ['firstname', 'lastname', 'email', 'passwd', 'id_gender'];
  const customersEndpoint = `/api/customers`;
  let user_id;


  test('Setup And Delete An Account', async ({ request }) => {
    // Customer JSON structure
    const customerJson = {
      prestashop: {
        "@_xmlns:xlink": "http://www.w3.org/1999/xlink",
        customer: {
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
      }
    };

    // Validation against required keys
    const CUSTOMER_REQUIRED_KEYS = ['firstname', 'lastname', 'email', 'passwd', 'id_gender'];
    CUSTOMER_REQUIRED_KEYS.forEach(key => {
      if (!customerJson.prestashop.customer.hasOwnProperty(key)) {
        throw new Error(`Missing required customer key: ${key}`);
      }
    });

    // XML Builder options
    const options = {
      format: true,
      ignoreAttributes: false,
      attributeNamePrefix: "@_", // Ensuring consistency with prefix usage
    };

    const builder = new XMLBuilder(options);
    const xmlContent = builder.build(customerJson);

    // Create customer
    const createResponse = await request.post(customersEndpoint, { data: xmlContent });
    if (createResponse.status() === 201) {
      const xmlResponse = await createResponse.text();
      const user_id_match = xmlResponse.match(/<id><!\[CDATA\[(.*?)\]\]><\/id>/);
      user_id = user_id_match ? user_id_match[1] : null;
      if (!user_id) throw new Error("Failed to extract user ID from response.");
    }
    else throw new Error("Failed to create customer."); 
    
    console.log(`User ${customerJson.prestashop.customer.firstname} ${customerJson.prestashop.customer.lastname} with ID ${user_id} created successfully.`);
  });


  test('Get customer details', async ({ request }) => {
    const singleCustomerEndpoint = `/api/customers/${user_id}`;
    console.log(singleCustomerEndpoint);
    
    const response = await request.get(singleCustomerEndpoint);
    const text = await response.text();
    console.log(text);
   } );


  test('Delete customer', async ({ request }) => {

    const singleCustomerEndpoint = `/api/customers/${user_id}`;
    
    console.log(singleCustomerEndpoint);

    const deleteResponse = await request.delete(singleCustomerEndpoint);
    if (deleteResponse.status() == 200) {
      console.log(`User with ID ${user_id} deleted successfully.`);
    }
    else throw new Error("Failed to delete customer.");
  });




  test('Get customer list', async ({ request }) => {
    const customersEndpoint = `/api/customers`;

    const getResponse = await request.get(customersEndpoint);
    const responseBody = await getResponse.text();
    expect(getResponse.status()).toBe(200);
    expect(responseBody).not.toContain(`id="${user_id}"`);
  })
})