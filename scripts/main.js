// Add your javascript here
// Don't forget to add it into respective layouts where this js file is needed

var conditionalColors = { 'PRESENT': 'blue', 'COMPLETED': 'green' }
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
      let target = $(this.hash);
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
          let $target = $(target);
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
  let workbook = XLSX.read(data, { type: 'base64' });
  let collections = { certifications: [], experience: [], skills: [], projects: [] }
  let sheet_name_list = workbook.SheetNames;
  sheet_name_list.forEach(function (y) { /* iterate through sheets */
    //Convert the cell value to Json
    let roa = XLSX.utils.sheet_to_json(workbook.Sheets[y]);
    if (roa.length > 0) {
      if (y == 'Certifications') {
        collections.certifications.push(roa);
      }
      else if (y == 'Experience') {
        collections.experience.push(roa);
      }
      else if (y == 'Skills') {
        collections.skills.push(roa);
      }
      else if (y == 'Projects') {
        collections.projects.push(roa);
      }
    }
  });
  localStorage.setItem('collections', JSON.stringify(collections))
}

function GetLocalData() {
  let stored = localStorage.getItem('collections');
  if (stored) local_collections = JSON.parse(stored);
  else local_collections = { certifications: [], experience: [], skills: [] };
  return local_collections
}

function ValidateLocalData() {
  let stored = localStorage.getItem('collections');
  return stored ? true : false
}

$(document).ready(function () {
  loadDatafromAPI();
  setTimeout(() => {
    let localData = GetLocalData()
    appendData(localData.certifications[0])
    appendExperienceDetails(localData.experience[0]);
    appendSkills(localData.skills[0])
    appendProjects(localData.projects[0]);
  }, 1000)

  $('#showMore').on('click', function (e) {
    e.preventDefault();
    appendData(GetLocalData().certifications[0])
  });
});

window.globals = {
  page: 1,
  step: 5,
  start: 0,
  end: 5
}
function appendData(rows) {

  let data = rows.splice(window.globals.start, window.globals.end)
  let finalContent = ""
  for (let i = 0; i < data.length; i++) {
    let item = data[i];
    let content = `
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
                                      target="_blank" rel="noreferrer">Go
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
  window.globals.start += window.globals.step
  if (rows.length % window.globals.step == 0) $('#showMore').hide();

}
function loadDatafromAPI() {
  let file_url = "https://api.github.com/repos/jjnanthakumar/jjnanthakumar.github.io/contents/portfolios.xlsx"
  if (!ValidateLocalData()) {
    $.ajax({
      url: file_url,
      dataType: 'jsonp',
      headers: {
        'accept': 'application/vnd.github.VERSION.raw',
        'Authorization': "token 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"
      },
      success: function (results) {
        LoadExcelJSON(results.data.content);
      }
    });
  }

}


function appendExperienceDetails(rows) {
  let finalContent = ""
  for (let i = 0; i < rows.length; i++) {
    let item = rows[i];
    let content = `
      <div class="card">
        <div class="row">
          <div class="col-md-3 bg-warning" data-aos="fade-right" data-aos-offset="50"
            data-aos-duration="500">
            <div class="card-body cc-experience-header">
              <p>${item.DateFrom} - ${item.DateTo} </p>
              <div class="h5">${item.Company}</div>
            </div>
          </div>
          <div class="col-md-9" data-aos="fade-left" data-aos-offset="50" data-aos-duration="500">
            <div class="card-body">
              <span style="float: right;"><button class="btn-tag"
                style="border-color: ${conditionalColors[item.Status]}; background-color: ${conditionalColors[item.Status]};">${item.Status}</button></span>
              <div class="h5">${item.Role}</div>
              <p class="category">${item.Location}</p>
              <p>${item.Description}</p>
              <a href="${item.CredentialURL}" class="${!item.CredentialURL ? 'disabledlink' : ''}" target="_blank" rel="noreferrer" onclick="return ${!item.CredentialURL ? false : true}">Go to
                Credential</a>
            </div>
          </div>
        </div>
      </div>
    `
    finalContent += content

  }
  $('#exp-contents').append(finalContent)
}

function appendSkills(rows) {
  let finalContent = ""
  for (let i = 0; i < rows.length; i++) {
    let item = rows[i];
    content =
      `
      <div class="col-md-6">
        <div class="progress-container progress-primary"><span
          class="progress-badge">${item.Category}</span>
          <div class="progress">
            <div class="progress-bar progress-bar-primary" data-aos="progress-full"
              aria-progressbar-name="progressbar"
              data-aos-offset="10" data-aos-duration="2000" role="progressbar"
              aria-valuenow=${item.Percent} aria-valuemin="0" aria-valuemax="100"
              style="width: ${item.Percent};"></div>
            <span class="progress-value">${item.Percent}</span>
          </div>
        </div>
      </div>
    `
    finalContent += content
  }
  $('#skill-contents').append(finalContent)
}

function appendProjects(rows) {
  let finalContent = ""
  for (let i = 0; i < rows.length; i++) {
    item = rows[i]
    content =
      `<div class="col-md-6" >
        <div class="cc-porfolio-image img-raised" data-aos="fade-up"
          data-aos-anchor-placement="top-bottom"><a href=${item.ProjectURL} target="_blank" rel="noreferrer">
            <figure class="cc-effect"><img height="360" width="680" data-src=${item.CoverImage} class="lazyload" alt="Image" />
              <figcaption>
                <div class="h4">${item.Title}</div>
                <p>${item.Category}</p>
              </figcaption>
            </figure>
          </a>
        </div>
      </div>
    `
    finalContent += content
  }
  $('#project-contents').append(finalContent)

}

function clearLocalCollection() {
  if (ValidateLocalData()) {
    localStorage.removeItem('collections');
  }
  window.location.reload();
}