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

function LoadExcelJSON(data) {
  var workbook = XLSX.read(data, { type: 'base64' });
  var collections = {certifications: []}
  var sheet_name_list = workbook.SheetNames;
  sheet_name_list.forEach(function (y) { /* iterate through sheets */
    //Convert the cell value to Json
    var roa = XLSX.utils.sheet_to_json(workbook.Sheets[y]);
    if (roa.length > 0) {
      collections.certifications.push(roa);
    }
  });
  localStorage.setItem('collections', JSON.stringify(collections))
}

function GetLocalData() {
  var stored = localStorage.getItem('collections');
  if (stored) local_collections = JSON.parse(stored);
  else local_collections = { 'certifications': [] };
  return local_collections
}

function ValidateLocalData(key) {
  var stored = localStorage.getItem('collections');
  return stored ? true : false
}

$(document).ready(function () {
  if(ValidateLocalData){
    appendData(GetLocalData().certifications[0])
  }
  $('#showMore').on('click', function (e) {
    e.preventDefault();
    appendData(GetLocalData().certifications[0])
  });
});


window.itemsCount = 0;
function appendData(rows) {
  var finalContent = ""
  let pagination = 5;
  for (let i = window.itemsCount; i < (window.itemsCount + pagination); i++) {
    var item = rows[i];
    var content = `
              <div class="card" id="index${i}">
                  <div class="row">
                      <div class="col-md-3 bg-success" data-aos="fade-right" data-aos-offset="50"
                          data-aos-duration="500">
                          <div class="card-body cc-education-header">
                              <div class="h5">${item.Source}</div>
                              <p>Issued on ${item.IssuedOn}<br><em>(This certification does not expire)</em></p>
                          </div>
                      </div>
                      <div class="col-md-9" data-aos="fade-left" data-aos-offset="50" data-aos-duration="500">
                          <div class="card-body">
                              <div class="h5">${item.Title}</div>
                              <p class="category">${item.SubSource}</p>
                              <p>Credential Id: ${item.CredentialId}<br>
                                  Grade Achieved: ${item.Grade}<br>
                                  <a href="${item.CredentialURL}"
                                      target="_blank">Go
                                      to Credential</a>
                              </p>
                          </div>
                      </div>
                  </div>
              </div>
      `
    finalContent += content

  }
  $('#cert-contents').append(finalContent)
  window.itemsCount += pagination;
  if (window.itemsCount > rows.length) {
    $('#showMore').hide();
  }
}