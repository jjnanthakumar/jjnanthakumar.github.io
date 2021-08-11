// Add your javascript here
// Don't forget to add it into respective layouts where this js file is needed

$(document).ready(function () {
  AOS.init({
    // uncomment below for on-scroll animations to played only once
    // once: true  
  }); // initialize animate on scroll library
});

// Smooth scroll for links with hashes
$('a.smooth-scroll')
  .click(function (event) {
    // On-page links
    if (
      location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '')
      &&
      location.hostname == this.hostname
    ) {
      // Figure out element to scroll to
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
      // Does a scroll target exist?
      if (target.length) {
        // Only prevent default if animation is actually gonna happen
        event.preventDefault();
        $('html, body').animate({
          scrollTop: target.offset().top
        }, 1000, function () {
          // Callback after animation
          // Must change focus!
          var $target = $(target);
          $target.focus();
          if ($target.is(":focus")) { // Checking if the target was focused
            return false;
          } else {
            $target.attr('tabindex', '-1'); // Adding tabindex for elements not focusable
            $target.focus(); // Set focus again
          };
        });
      }
    }
  });

function getExcelJSON(data) {
  var workbook = XLSX.read(data, { type: 'base64' });
  var sheet_name_list = workbook.SheetNames;
  sheet_name_list.forEach(function (y) { /* iterate through sheets */
    //Convert the cell value to Json
    var roa = XLSX.utils.sheet_to_json(workbook.Sheets[y]);
    if (roa.length > 0) {
      result = roa;
    }
  });
  return result
}