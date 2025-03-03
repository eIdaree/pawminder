import * as SecureStore from 'expo-secure-store';

export const tokenCache = {
  async getToken(key: string) {
    try {
      const item = await SecureStore.getItemAsync(key);
      if (item) {
        console.log(`${key} was used 🔐`);
      } else {
        console.log(`No values stored under key: ${key}`);
      }
      return item;
    } catch (error) {
      console.error('SecureStore get item error: ', error);
      await SecureStore.deleteItemAsync(key);
      return null;
    }
  },

  async saveToken(key: string, value: string) {
    try {
      await SecureStore.setItemAsync(key, value);
      console.log(`${key} saved successfully 🔑`);
    } catch (err) {
      console.error('Error saving item: ', err);
    }
  },

  async deleteToken(key: string) {
    try {
      await SecureStore.deleteItemAsync(key);
      console.log(`${key} deleted successfully 🗑️`);
    } catch (err) {
      console.error('Error deleting item: ', err);
    }
  },
};
