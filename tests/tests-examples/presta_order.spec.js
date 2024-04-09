import { test, expect } from '@playwright/test';

const xmlData = `
<prestashop>
    <customer>
        <passwd>12313123</passwd>
        <lastname>Doe</lastname>
        <firstname>John</firstname>
        <email>ramon@come_jamon.es</email>
        <id_gender>1</id_gender>
    </customer>
</prestashop>
`;
const customersEndpoint = `/api/customers`;
let user_id;



test('PrestaShop Create Order', async ({ request }) => {
  test.beforeAll(async () => {
    console.log('Test setup: Starting up resources...');
    const createResponse = await request.post(customersEndpoint, { data: xmlData });
    if (createResponse.status() === 201) {
      const xmlResponse = await createResponse.text();
      const user_id_match = xmlResponse.match(/<id><!\[CDATA\[(.*?)\]\]><\/id>/);
      user_id = user_id_match ? user_id_match[1] : null;
      if (!user_id) throw new Error("Failed to extract user ID from response.");
    }
    else throw new Error("Failed to create customer."); 
    // Setup actions here
    // E.g., starting a server, initializing database connections, etc.
    console.log('Suite setup: Starting up resources...');
  });

  // Suite-level teardown with afterAll
  test.afterAll(async () => {
    console.log('Test teardown: Releasing resources...');
    deleteResponse = await request.delete(`${customersEndpoint}/${user_id}`);
    if (deleteResponse.status() == 200) {
      console.log(`User with ID ${user_id} deleted successfully.`);
    }
    else throw new Error("Failed to delete customer.");
    // Teardown actions here
    // E.g., stopping a server, closing database connections, etc.
    console.log('Suite teardown: Releasing resources...');
  });

  test
})