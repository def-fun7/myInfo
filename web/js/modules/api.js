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

/**
 * Calls the Python function to update user data and returns a Promise
 * that resolves with the Python status/message.
 *
 * @param {string} jsonString - The JSON string of data to save.
 * @returns {Promise<Object>} A Promise that resolves with the status object 
 * returned by the Python function.
 */
export function updateUserData(jsonString) {
    return new Promise((resolve, reject) => {
        // Call the exposed Python function (updateUserData)
        // The result is passed to the callback function
        eel.updateUserData(jsonString)((result) => {
            // Check the status returned by Python
            if (result && result.status === 'error') {
                reject(result.message); // Reject the promise on Python error
            } else {
                resolve(result); // Resolve with the full status object (success or unchanged)
            }
        });
    });
}
export function getUserData() {
  return new Promise((resolve) => {
    eel.getUserData()((userdataStr) => resolve(userdataStr));
  });
}
// This is the function you will call when the button is clicked.
export function createMyInfoPage() {
    return new Promise((resolve, reject) => {
        // Call the exposed Python function (createMyInfoPage)
        eel.createMyInfoPage()((result) => {
            // 'result' contains the dictionary returned by Python (status, message)
            if (result && result.status === 'success') {
                console.log(result.message); // Log the success message
                resolve(result.message);      // Resolve the Promise
            } else {
                console.error("Page creation failed:", result.message);
                reject(result.message);      // Reject the Promise on error
            }
        })
    })
}