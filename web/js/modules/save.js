/**
 * @file save.js
 * @description to handle saving data logic
 */

import { toReadableLabel } from "../utils/ids.js";
import { handleSaveClick } from "../ui/listeners.js";

export function saveData() {
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
  handleSaveClick(jsonString)
}

