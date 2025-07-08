import { useQuery } from '@tanstack/react-query';
import Cookies from 'js-cookie';
import { API_URL } from '../../utils/config-global';

export const useGetProfile = (options = {}) => {
  return useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      // Get token from cookies
      const token = Cookies.get('accessToken');
      
      console.log('🔍 Token from cookies:', token ? 'Found' : 'Missing');
      console.log('🔍 Full token:', token);
      
      if (!token) {
        throw new Error('No authentication token found');
      }

      const baseUrl = API_URL || 'http://localhost:8000';
      const apiUrl = `${baseUrl}/api/user/profile`;
      
      console.log('🌐 Making request to:', apiUrl);
      
      try {
        const response = await fetch(apiUrl, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        console.log('📡 Response status:', response.status);
        console.log('📡 Response headers:', response.headers);
        console.log('📡 Response ok:', response.ok);
        
        // Get the raw response text to see what we're actually receiving
        const responseText = await response.text();
        console.log('📄 Raw response:', responseText.substring(0, 200) + '...');
        
        // Check if response is HTML (starts with <!DOCTYPE or <html)
        if (responseText.startsWith('<!DOCTYPE') || responseText.startsWith('<html')) {
          console.error('❌ Received HTML instead of JSON. This usually means:');
          console.error('   1. The API endpoint does not exist');
          console.error('   2. The server is returning an error page');
          console.error('   3. The API route is not properly configured');
          throw new Error(`API endpoint returned HTML instead of JSON. Status: ${response.status}`);
        }

        // Try to parse as JSON
        try {
          const data = JSON.parse(responseText);
          console.log('✅ Parsed JSON successfully:', data);
          return data;
        } catch (parseError) {
          console.error('❌ Failed to parse JSON:', parseError);
          throw new Error(`Invalid JSON response: ${parseError.message}`);
        }

      } catch (fetchError) {
        console.error('❌ Fetch error:', fetchError);
        throw fetchError;
      }
    },
    ...options,
  });
};