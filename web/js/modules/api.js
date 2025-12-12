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

export function updateUserData(jsonString) {
  eel.updateUserData(jsonString);
}

export function getUserData() {
  return new Promise((resolve) => {
    eel.getUserData()((userdataStr) => resolve(userdataStr));
  });
}