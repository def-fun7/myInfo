/**
 * @file save.js
 * @description to handle saving data logic
 */

import { toReadableLabel } from "../utils/ids.js";
import { updateUserData } from "./api.js";

export function saveData(path) {
  var $formInput = $("#form").find("input");

  var dataDict = {};
  $formInput.each(function () {
    const $element = $(this);
    var key = toReadableLabel($element.attr("id"));
    var value = $element.val();

    if (value.length) {
      dataDict[key] = value;
    }
  });
    const jsonString = JSON.stringify(dataDict, null, 4);
    updateUserData(path, jsonString);
  console.log(jsonString);
}
