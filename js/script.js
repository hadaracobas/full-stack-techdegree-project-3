/* ***###*** THE "NAME" FIELD ***###*** */
// focus the name input field after page load
const nameInput = document.getElementById("name");
window.addEventListener("load", () => {
  nameInput.focus();
});

// validate name keyup event
nameInput.addEventListener("keyup", () => {
  validateNameField();
});

/* ***###*** THE "EMAIL" FIELD ***###*** */
// validate keyup event
const emailInput = document.getElementById("email");
emailInput.addEventListener("keyup", () => {
  validateEmailField();
});

/* ***###*** THE "JOB ROLE" FIELD ***###*** */
// hide/display the "other job" input text field if the user has selected the "Other" option
const selectJobTitle = document.getElementById("title");
const otherJobInput = document.getElementById("other-job-role");
otherJobInput.style.display = "none";
selectJobTitle.addEventListener("change", () => {
  if (selectJobTitle.value === "other") {
    otherJobInput.style.display = "inline-block";
  } else {
    otherJobInput.style.display = "none";
  }
});

/* ***###*** T-SHIRT INFO FORM SECTION ***###*** */
// get section elements
const selectDesign = document.getElementById("design");
const selectColor = document.getElementById("color");
const colorOptions = selectColor.getElementsByTagName("option");
const colorDefaultOption = document.getElementById("color-default-option");

// disable select color
selectColor.disabled = true;

selectDesign.addEventListener("change", () => {
  // enable color input field
  selectColor.disabled = false;
  // remove color default option
  colorDefaultOption && colorDefaultOption.remove();
  // toggle relevant color options
  for (let i = 0; i < colorOptions.length; i++) {
    if (selectDesign.value === colorOptions[i].getAttribute("data-theme")) {
      colorOptions[i].removeAttribute("hidden");
      document
        .querySelectorAll(
          `[data-theme="${colorOptions[i].getAttribute("data-theme")}"]`
        )[0]
        .setAttribute("selected", true);
    } else {
      colorOptions[i].setAttribute("hidden", true);
      colorOptions[i].removeAttribute("selected");
    }
  }
});

/* ***###*** "REGISTER FOR ACTIVITIES" SECTION ***###*** */
// get section elements
const activities = document.getElementById("activities");
const totalCostElem = document.getElementById("activities-cost");
const activitiesInputs = activities.getElementsByTagName("input");

// set counter var to track total cost
let totalCostOfActivities = 0;
activities.addEventListener("change", (event) => {
  // cost - convert the string to number, calc the total cost, and display on the page
  let activityCost = event.target.getAttribute("data-cost") * 1;
  if (event.target.checked) {
    totalCostOfActivities += activityCost;
  } else {
    totalCostOfActivities -= activityCost;
  }

  // display total cost
  totalCostElem.innerHTML = `Total: $${totalCostOfActivities}`;

  // prevent users from registering for conflicting activities
  for (let i = 0; i < activitiesInputs.length; i++) {
    if (
      event.target.getAttribute("data-day-and-time") ===
        activitiesInputs[i].getAttribute("data-day-and-time") &&
      event.target !== activitiesInputs[i]
    ) {
      if (event.target.checked) {
        activitiesInputs[i].parentNode.classList.add("disabled");
        activitiesInputs[i].disabled = true;
      } else {
        activitiesInputs[i].parentNode.classList.remove("disabled");
        activitiesInputs[i].disabled = false;
      }
    }
  }
});

/* ***###*** "PAYMENT INFO" SECTION ***###*** */
// get section elements
const selectPayment = document.getElementById("payment");
const creditCardSection = document.getElementById("credit-card");
const paypalSection = document.getElementById("paypal");
const bitcoinSection = document.getElementById("bitcoin");

// hide paypal and bitcoin sections by default
paypalSection.style.display = "none";
bitcoinSection.style.display = "none";

// display the relevant payment section only
selectPayment.addEventListener("change", (event) => {
  if (event.target.value === "credit-card") {
    creditCardSection.style.display = "block";
    paypalSection.style.display = "none";
    bitcoinSection.style.display = "none";
  } else if (event.target.value === "paypal") {
    creditCardSection.style.display = "none";
    paypalSection.style.display = "block";
    bitcoinSection.style.display = "none";
  } else if (event.target.value === "bitcoin") {
    creditCardSection.style.display = "none";
    paypalSection.style.display = "none";
    bitcoinSection.style.display = "block";
  }
});

/* ***###*** FORM VALIDATION ***###*** */
const registrationForm = document.getElementById("registration-form");

/**
 * "isValidField" function: validate field. return boolean value.
 *
 * @param {regex} regex - relevant regex to validate the string field value
 * @param {string} str - the string field value to validate
 */
function isValidField(regex, str) {
  return regex.test(str);
}

/**
 * "invalidElem" function: style invalid element
 *
 * @param {element} ele - the invalid element
 */
function invalidElem(ele) {
  ele.parentNode.classList.add("not-valid");
  ele.parentNode.classList.remove("valid");
  ele.parentNode.lastElementChild.style.display = "block";
}

/**
 * "validElem" function: style valid element
 *
 * @param {element} ele - the valid element
 */
function validElem(ele) {
  ele.parentNode.classList.add("valid");
  ele.parentNode.classList.remove("not-valid");
  ele.parentNode.lastElementChild.style.display = "none";
}

/**
 * "validateNameField" function: validate the name field
 *
 * @param {array} errorsArr - array to track the invalid fields on submit
 */
function validateNameField(errorsArr) {
  const regexNameField = /^[a-zA-Z ]+$/;
  if (!isValidField(regexNameField, nameInput.value)) {
    invalidElem(nameInput);
    errorsArr && errorsArr.push("Name");
    // conditional error message
    if (nameInput.value.length === 0) {
      nameInput.parentNode.lastElementChild.textContent =
        "Name field cannot be blank";
    } else {
      nameInput.parentNode.lastElementChild.textContent =
        "Name field cannot contain numbers or symbols";
    }
  } else {
    validElem(nameInput);
  }
}

/**
 * "validateEmailField" function: validate the email field
 *
 * @param {array} errorsArr - array to track the invalid fields on submit
 */
function validateEmailField(errorsArr) {
  const regexEmailField = /^[^@]+@[^@.]+\.[a-z]+$/i;
  if (!isValidField(regexEmailField, emailInput.value)) {
    invalidElem(emailInput);
    errorsArr && errorsArr.push("Email");
    // conditional error message
    if (emailInput.value.length === 0) {
      emailInput.parentNode.lastElementChild.textContent =
        "Email field cannot be blank";
    } else {
      emailInput.parentNode.lastElementChild.textContent =
        "Email address must be formatted correctly";
    }
  } else {
    validElem(emailInput);
  }
}

// validate form handle submit
registrationForm.addEventListener("submit", (event) => {
  // set array to collect error messages
  let requiredFieldsList = [];

  // # Name validation
  validateNameField(requiredFieldsList);

  // # Email validation
  validateEmailField(requiredFieldsList);

  // # Activities validation
  let checkedActivitiesArr = [];
  // loop and check all activities inputs. If input is checked, push to the activities array
  for (let i = 0; i < activitiesInputs.length; i++) {
    if (activitiesInputs[i].checked === true) {
      checkedActivitiesArr.push(activitiesInputs[i]);
    }
  }
  // if the activities array is empty, set section as required
  if (checkedActivitiesArr.length === 0) {
    activities.classList.add("not-valid");
    activities.classList.remove("valid");
    activities.lastElementChild.style.display = "block";
    requiredFieldsList.push("Activities");
  } else {
    activities.classList.remove("not-valid");
    activities.classList.add("valid");
    activities.lastElementChild.style.display = "none";
  }

  // # Credit card validation
  const creditCardInput = document.getElementById("cc-num");
  const zipInput = document.getElementById("zip");
  const cvvInput = document.getElementById("cvv");

  // check if user selected credit card
  if (selectPayment.value === "credit-card") {
    const regexCreditCardField = /^[0-9]{13,16}$/i;
    // validate credit card input field
    if (!isValidField(regexCreditCardField, creditCardInput.value)) {
      invalidElem(creditCardInput);
      requiredFieldsList.push("Credit card");
    } else {
      validElem(creditCardInput);
    }

    // validate zip input field
    const regexZipField = /^[0-9]{5}$/;
    if (!isValidField(regexZipField, zipInput.value)) {
      invalidElem(zipInput);
      requiredFieldsList.push("Zip");
    } else {
      validElem(zipInput);
    }

    // validate cvv input field
    const regexCvvField = /^[0-9]{3}$/;
    if (!isValidField(regexCvvField, cvvInput.value)) {
      invalidElem(cvvInput);
      requiredFieldsList.push("CVV");
    } else {
      validElem(cvvInput);
    }
  } else {
    // if credit card is not selected remove all credit card required styles
    validElem(creditCardInput);
    validElem(zipInput);
    validElem(cvvInput);
    creditCardInput.parentNode.classList.remove("valid");
    zipInput.parentNode.classList.remove("valid");
    cvvInput.parentNode.classList.remove("valid");
  }

  // # Prevent default if form is invalid:
  if (requiredFieldsList.length > 0) {
    event.preventDefault();
    alert("Please fill in all required fields");
  }
});

/* ***###*** ACCESSIBILITY ***###*** */
// activities - add/remove the focus class
for (let i = 0; i < activitiesInputs.length; i++) {
  activitiesInputs[i].addEventListener("focus", (event) => {
    event.target.parentNode.classList.add("focus");
  });
  activitiesInputs[i].addEventListener("blur", (event) => {
    event.target.parentNode.classList.remove("focus");
  });
}
