import fetch from "node-fetch";

const invokeUrl = "https://ai.api.nvidia.com/v1/genai/black-forest-labs/flux.2-klein-4b"

const headers = {
    "Authorization": `Bearer ${process.env.EXPO_PUBLIC_NVIDIA_FLUX_API_KEY}`,
    "Accept": "application/json",
}

const payload = {
  "prompt": "Professional food photography of a fresh apple as a grocery item, centered, isolated on a deep charcoal black background, soft cinematic lighting, high-detail texture, 8k resolution, modern tech-forward aesthetic. Real food item, not a logo or brand, actual edible food product.",
  "width": 1024,
  "height": 1024,
  "seed": 0,
  "steps": 4
}

console.log('Testing NVIDIA API...');
console.log('URL:', invokeUrl);
console.log('Payload:', JSON.stringify(payload, null, 2));

try {
  let response = await fetch(invokeUrl, {
      method: "post",
      body: JSON.stringify(payload),
      headers: { "Content-Type": "application/json", ...headers }
  });

  console.log('Response status:', response.status);
  console.log('Response headers:', Object.fromEntries(response.headers.entries()));

  if (response.status != 200) {
    let errBody = await response.text();
    console.error('Error response:', errBody);
    throw "invocation failed with status " + response.status + " " + errBody
  }
  
  let response_body = await response.json()
  console.log('Response structure:');
  console.log('Keys:', Object.keys(response_body));
  
  // Log the full response but limit the output for readability
  const responseStr = JSON.stringify(response_body, null, 2);
  if (responseStr.length > 1000) {
    console.log('Response (first 1000 chars):', responseStr.substring(0, 1000) + '...');
    console.log('Response length:', responseStr.length);
  } else {
    console.log('Full response:', responseStr);
  }

  // Check for base64 data
  for (const [key, value] of Object.entries(response_body)) {
    if (typeof value === 'string' && value.length > 1000) {
      console.log(`Found large string in field "${key}" with length: ${value.length}`);
      console.log(`First 100 chars: ${value.substring(0, 100)}`);
      
      // Test if it's base64
      const base64Pattern = /^[A-Za-z0-9+/]+={0,2}$/;
      if (base64Pattern.test(value.substring(0, 100))) {
        console.log(`Field "${key}" appears to be base64 data!`);
      }
    }
  }

} catch (error) {
  console.error('Test failed:', error);
}
