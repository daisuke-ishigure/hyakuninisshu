'use strict';

$("#toggle2").on("change", function (event) {
  $("#moon").toggle();
  $("#cloud").toggle();
  event.stopPropagation();
});

