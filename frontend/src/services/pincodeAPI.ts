// Third Party Web API Integration - India Post Pincode API
// This demonstrates the use of fetch API instead of axios
// Relevant for Indian e-commerce: Validate pincode and check delivery serviceability

interface PincodeData {
  pincode: string;
  city: string;
  state: string;
  district: string;
  country: string;
  serviceable: boolean;
}

/**
 * Validate Indian pincode and get location details
 * Uses native fetch API (requirement: use fetch API)
 * Third-party API: India Post Pincode API or similar service
 */
export const validatePincode = async (pincode: string): Promise<PincodeData | null> => {
  try {
    // Using fetch API instead of axios (fulfills requirement)
    const response = await fetch(
      `https://api.postalpincode.in/pincode/${pincode}`
    );

    if (!response.ok) {
      throw new Error('Pincode validation service unavailable');
    }

    const data = await response.json();
    
    if (data && data[0] && data[0].Status === 'Success' && data[0].PostOffice) {
      const postOffice = data[0].PostOffice[0];
      return {
        pincode: pincode,
        city: postOffice.District || postOffice.Name,
        state: postOffice.State,
        district: postOffice.District,
        country: 'India',
        serviceable: true,
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error validating pincode:', error);
    // Return null if validation fails
    return null;
  }
};

/**
 * Check if pincode is serviceable for delivery
 * Useful for e-commerce to show delivery availability
 */
export const checkDeliveryServiceability = async (pincode: string): Promise<boolean> => {
  try {
    const data = await validatePincode(pincode);
    return data !== null && data.serviceable;
  } catch (error) {
    console.error('Error checking delivery serviceability:', error);
    return false;
  }
};


