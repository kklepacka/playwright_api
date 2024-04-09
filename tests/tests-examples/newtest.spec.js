import { test, expect } from '@playwright/test';


test.describe.parallel('API requests', () => {

  const baseURL = 'https://reqres.in';

  test('API GET request', async ({ request }) => {

    const response = await request.get(`${baseURL}/api/users/2`);
    const responseBody = JSON.parse(await response.text());
    console.log(responseBody);

    //Assertions

    expect(response.status()).toBe(200);
    console.log(responseBody.data);
    //expect(responseBody.data.id).toBe(2);
  })




  test('API POST request', async ({ request }) => {

    const response = await request.post(`${baseURL}/api/users`, {
      data: {
        name: 'Kasia',
        job: 'queen'
      }
    });
    expect(response.status()).toBe(201);
    const responseBody = JSON.parse(await response.text());
    console.log(responseBody);
    expect(responseBody.name).toContain('Kasia');
  })

  test('API POST request - login', async ({ request }) => {
    const response = await request.post(`${baseURL}/api/login`, {
      data: {
        email: 'eve.holt@reqres.in',
        password: 'cityslicka'
      }
    });
    expect(response.status()).toBe(200);
    const responseBody = JSON.parse(await response.text());
    console.log(responseBody);
    expect(responseBody.token).toBeTruthy();
  })
})