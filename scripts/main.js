// Add your javascript here
// Don't forget to add it into respective layouts where this js file is needed

// Testing Contact form this can be removed if any page crashed.
var flags = { email: false, phone: false, name: false, message: false }
function generateError(inputObj) {
  let element;
  if (!document.getElementById(inputObj.id + 'error')) {
    element = document.createElement('small')
    element.setAttribute('id', inputObj.id + 'error')
    element.setAttribute('class', 'errors')
  }
  else {
    element = document.getElementById(inputObj.id + 'error')
  }
  element.style.color = "red";
  element.style.fontSize = "12px"
  element.style.display = "inline"
  switch (inputObj.getAttribute('id')) {
    case 'phone':
      if (isEmpty(inputObj.value)) {
        element.innerText = "Mobile Number Field should not be empty"
        inputObj.style.border = "1px solid red";
        flags.phone = false
      }
      else if (!isMobileValid(inputObj.value)) {
        element.innerText = "Make sure the number is in (###)########### format"
        inputObj.style.border = "1px solid red";
        flags.phone = false
      }
      else {
        flags.phone = true
      }

      if (!flags.phone) insertAfter(inputObj, element)

      break;

    case 'name':
      if (isEmpty(inputObj.value)) {
        element.innerText = "Name Field should not be empty"
        inputObj.style.border = "1px solid red";
        flags.name = false
      }
      else if (!isNameValid(inputObj.value)) {
        element.innerText = "Please provide a valid name"
        inputObj.style.border = "1px solid red";
        flags.name = false
      }
      else {
        flags.name = true
      }
      if (!flags.name) insertAfter(inputObj, element)
      break;

    case 'email':
      if (isEmpty(inputObj.value)) {
        element.innerText = "Email Field should not be empty"
        inputObj.style.border = "1px solid red";
        flags.email = false
      }
      else if (!isEmailValid(inputObj.value)) {
        element.innerText = "Please provide a valid Email Id"
        inputObj.style.border = "1px solid red";
        flags.email = false
      }
      else {
        flags.email = true
      }
      if (!flags.email) insertAfter(inputObj, element)
      break;
    case 'company':
      if (isEmpty(inputObj.value)) {
      }
      break;
    case 'message':
      if (isEmpty(inputObj.value)) {
        element.innerText = "Message Field should not be empty"
        inputObj.style.border = "1px solid red";
        flags.message = false
      }
      else {
        flags.message = true
      }
      if (!flags.message) insertAfter(inputObj, element)
      break;
    default:
      break;
  }
}

function insertAfter(referenceNode, newNode) {
  referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

function clearErrors(elements) {
  jQuery('.errors').remove() // Remove Error elements
}

function isEmpty(val) {
  // To check if the input field is empty or not
  return val.length == 0
}

function isMobileValid(val) {
  // This function validates for Mobile Number
  let pattern = /^\([0-9]{1,3}\)\d{4,12}$/g
  return pattern.test(val)
}

function isEmailValid(val) {
  // This function validates Email
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(val).toLowerCase());
}

function isNameValid(val) {
  // This function is to validate name using Regex
  let pattern = /^[a-zA-Z \.]{3,}$/g
  return pattern.test(val)
}

jQuery(document).ready(function ($) {

  const dob = new Date("02/17/2000")
  var month_diff = Date.now() - dob.getTime();

  var year = (new Date(month_diff)).getFullYear();
  var age = Math.abs(year - 1970);
  $('#age').html(age)
  $('button[name="cf-submit"]').click((e) => {
    var elements = document.getElementsByClassName('input')
    clearErrors(elements); // Clear All Error Elements
    for (let i = 0; i < elements.length; i++) {
      generateError(elements[i]); // Generate Error Messages
    }

    if (Object.values(flags).every(e => e)) {
      $('#cform').submit();
    }
    // This is to fade out Error Messages
    setTimeout(() => {
      $('.errors').fadeOut(2000)
    }, 5000)
    return Object.values(flags).every(e => e)

  });
});

function reload() {
  window.location.reload(true);
}


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
  return collections
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
  const USER_ID = "user_pXXWo8nEe8W3NAwRLeNhI"
  const SERVICE_ID = "contactform_service"
  var templateParams = {
    from_name: "",
    to_name: "",
    mobile: "",
    email: "",
    company: "",
    message: ""
  }
  emailjs.init(USER_ID);
  loadDatafromAPI();

  $('#showMore').on('click', function (e) {
    e.preventDefault();
    appendData(GetLocalData().certifications[0])
  });

  $('#cform').on('submit', e => {
    e.preventDefault();
    $('#reload').css("display", "inline-block")
    if ($('#send').attr("data-another") == "true") {
      showNewForm()
      return false
    }
    $('input').attr("disabled", "disabled")
    $('#message').attr("disabled", "disabled")
    templateParams.from_name = $('#name').val()
    templateParams.to_name = "Nanthakumar J J"
    templateParams.email = $('#email').val()
    templateParams.company = $('#company').val().length > 0 ? $('#company').val() : "No Company Provided"
    templateParams.mobile = $('#phone').val()
    templateParams.message = $('#message').val()
    emailjs.send(SERVICE_ID, "contactform", templateParams)
      .then(function (response) {
        // console.log('SUCCESS!', response.status, response.text);
        afterFormSubmit()
      }, function (error) {
        console.log('FAILED...', error);
      });;
  });
});

function showNewForm() {
  $("#cform")[0].reset();
  $('#modalheader').show()
  $('#modalbody').show()
  $('#content').hide()
  $('#send').attr('data-another', false)
  $('#send').html('Send')
}
function afterFormSubmit() {
  $('#modalheader').hide();
  $('#modalbody').hide();
  $('#content').html("Thank you for contacting Nanthakumar J J. We have recieved your request and our team will get back to you ASAP.")
  $('#content').show()
  $('#send').html('Send Another Response')
  $('#send').attr('data-another', true)
  $('input').removeAttr("disabled")
  $('#message').removeAttr("disabled")
  $('#reload').hide()
}

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
  // if (ValidateLocalData()) {
  //   localStorage.removeItem('collections');
  // }
  if (!ValidateLocalData()) {
    $.ajax({
      url: file_url,
      dataType: 'jsonp',
      headers: {
        'accept': 'application/vnd.github.VERSION.raw',
        'Authorization': "token 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"
      },
      success: function (results) {
        let localData = LoadExcelJSON(results.data.content);
        appendData(localData.certifications[0])
        appendExperienceDetails(localData.experience[0]);
        appendSkills(localData.skills[0])
        appendProjects(localData.projects[0]);
      }
    });
  }
  else {
    // load from local
    let localData = GetLocalData();
    appendData(localData.certifications[0])
    appendExperienceDetails(localData.experience[0]);
    appendSkills(localData.skills[0])
    appendProjects(localData.projects[0]);
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