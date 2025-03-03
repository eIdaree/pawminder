export const fetchPetData = async (token: string, userId: string) => {
    try {
      const baseURL = process.env.EXPO_PUBLIC_BASE_URL; 
      const response = await fetch(`${baseURL}/pets/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (response.status === 200) {
        return await response.json();
      } else {
        console.error("Failed to fetch pet data", response.status);
        return null;
      }
    } catch (error) {
      console.error("Error fetching pet data:", error);
      return null;
    }
  };