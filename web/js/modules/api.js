/**
 * @file api.js
 * @description Backend API calls via Eel
 */

/**
 * Fetch all fields from the backend (Python via Eel).
 * @returns {Promise<Array<Object>>}
 */
export function fetchAllFields() {
  return new Promise((resolve) => {
    eel.get_all_fields()((rows) => resolve(rows));
  });
}

export function updateUserData(path, jsonString) {
  eel.updateUserData(path, jsonString);
}

export function getUserData(path) {
  return new Promise((resolve) => {
    eel.getUserData(path)((userdataStr) => resolve(userdataStr));
  });
}