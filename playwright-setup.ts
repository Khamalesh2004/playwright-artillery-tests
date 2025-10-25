import { Page, BrowserContext } from '@playwright/test';

export async function userLifecycleScenario(page: Page, context: BrowserContext, userData: any) {
  const accessToken = "98ab5ab318bc6d991394e6ff7710930378cdb3a12e06da6a8520a264f8cce279"; // Replace with real token
  
  try {
    // Generate unique test data
    const timestamp = Date.now();
    const randomId = Math.floor(Math.random() * 10000);
    const testUser = {
      name: `Test User ${timestamp}`,
      email: `testuser${timestamp}${randomId}@example.com`,
      gender: 'male',
      status: 'active'
    };

    console.log('Starting POST request to create user...');
    
    // Step 1: Create user (POST)
    const createResponse = await page.request.post('https://gorest.co.in/public/v2/users', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      data: testUser
    });

    console.log(`Create User Status: ${createResponse.status()}`);
    
    if (createResponse.status() !== 201) {
      const errorText = await createResponse.text();
      console.error(`Failed to create user: ${errorText}`);
      return { success: false };
    }

    const responseData = await createResponse.json() as any;
    const userId = responseData.id;
    console.log(`User created successfully with ID: ${userId}`);

    // Step 2: Retrieve user (GET)
    console.log('Starting GET request to retrieve user...');
    const getResponse = await page.request.get(`https://gorest.co.in/public/v2/users/${userId}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      }
    });

    console.log(`Get User Status: ${getResponse.status()}`);
    
    if (getResponse.status() === 200) {
      const userData = await getResponse.json();
      console.log(`User retrieved successfully: ${userData.name}`);
      console.log(' User creation and retrieval validated successfully');
      return { success: true, userId };
    } else {
      console.error('Failed to retrieve user');
      return { success: false };
    }
    
  } catch (error) {
    console.error(' Scenario failed:', error);
    return { success: false, error: error instanceof Error ? error.message : String(error) };
  }
}

export default userLifecycleScenario;
