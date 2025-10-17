
 // ---------------- REFERRAL HANDLING ----------------
 const urlParams = new URLSearchParams(window.location.search);
 let ref = urlParams.get("ref") || localStorage.getItem("referralCode");
 if (ref) {
  document.getElementById("referralField").value = ref;
  document.getElementById("referralWrapper").style.display = "block";
 }
 
 // ---------------- COUNTRY + CITY AUTOCOMPLETE ----------------
 const countryInput = document.getElementById("countryInput");
 const countryCodeInput = document.getElementById("countryCode"); // hidden input
 const cityInput = document.getElementById("cityInput");
 const countryList = document.getElementById("countryList");
 const cityList = document.getElementById("cityList");
 
 let allCountries = [];
 let countryMap = {};
 let allCities = [];
 let cachedCities = {};
 
 // Restore cached selections
 if (localStorage.getItem("selectedCountry")) {
  countryInput.value = localStorage.getItem("selectedCountry");
  if (localStorage.getItem("selectedCountryCode")) {
   countryCodeInput.value = localStorage.getItem("selectedCountryCode");
  }
  loadCities(countryInput.value);
 }
 if (localStorage.getItem("selectedCity")) {
  cityInput.value = localStorage.getItem("selectedCity");
 }
 
 // Fetch country list (with codes)
 fetch("https://countriesnow.space/api/v0.1/countries/iso")
  .then((res) => res.json())
  .then((data) => {
   allCountries = data.data.map((c) => c.name).sort((a, b) => a.localeCompare(b));
   data.data.forEach((c) => {
    countryMap[c.name] = c.Iso2;
   });
  });
 
 function showList(input, list, items) {
  list.innerHTML = "";
  const query = input.value.toLowerCase();
  if (!query) {
   list.style.display = "none";
   return;
  }
  const filtered = items.filter((item) => item.toLowerCase().includes(query));
  filtered.forEach((item) => {
   const li = document.createElement("li");
   li.textContent = item;
   li.addEventListener("click", () => {
    input.value = item;
    list.style.display = "none";
    
    if (input === countryInput) {
     localStorage.setItem("selectedCountry", item);
     const code = countryMap[item] || "";
     countryCodeInput.value = code;
     localStorage.setItem("selectedCountryCode", code);
     loadCities(item);
    } else if (input === cityInput) {
     localStorage.setItem("selectedCity", item);
    }
   });
   list.appendChild(li);
  });
  list.style.display = filtered.length ? "block" : "none";
 }
 
 function loadCities(country) {
  cityInput.value = "";
  cityList.innerHTML = "";
  allCities = [];
  
  if (cachedCities[country]) {
   allCities = cachedCities[country];
   showList(cityInput, cityList, allCities);
   return;
  }
  
  fetch("https://countriesnow.space/api/v0.1/countries/cities", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ country }),
   })
   .then((res) => res.json())
   .then((data) => {
    if (data.data && Array.isArray(data.data)) {
     allCities = data.data.sort((a, b) => a.localeCompare(b));
     cachedCities[country] = allCities;
     showList(cityInput, cityList, allCities);
    }
   });
 }
 
 countryInput.addEventListener("input", () =>
  showList(countryInput, countryList, allCountries)
 );
 cityInput.addEventListener("input", () =>
  showList(cityInput, cityList, allCities)
 );
 
 // Hide dropdowns when clicking outside
 document.addEventListener("click", (e) => {
  if (!countryInput.contains(e.target) && !countryList.contains(e.target)) {
   countryList.style.display = "none";
  }
  if (!cityInput.contains(e.target) && !cityList.contains(e.target)) {
   cityList.style.display = "none";
  }
 });
 
 // ---------------- MULTI-STEP FORM ----------------
 (function() {
  const steps = document.querySelectorAll(".form-step");
  const nextBtn = document.querySelector(".next-btn");
  const prevBtn = document.querySelector(".prev-btn");
  const submitBtn = document.querySelector(".submit-btn");
  const form = document.querySelector("form.resume-form");
  
  let currentStep = 0;
  const controls = form.querySelectorAll("input, textarea, select");
  
  // Persist values in localStorage
  controls.forEach((control) => {
   const name = control.name;
   if (!name || control.type === "file") return;
   
   const saved = localStorage.getItem(name);
   if (control.type === "radio") {
    if (saved && saved === control.value) control.checked = true;
    control.addEventListener("change", () => {
     if (control.checked) localStorage.setItem(name, control.value);
    });
   } else if (control.type === "checkbox") {
    if (saved !== null) control.checked = saved === "true";
    control.addEventListener("change", () =>
     localStorage.setItem(name, control.checked)
    );
   } else {
    if (saved !== null) control.value = saved;
    control.addEventListener("input", () =>
     localStorage.setItem(name, control.value)
    );
   }
  });
  
  function showStep(n) {
   steps.forEach((s, i) => s.classList.toggle("active", i === n));
   prevBtn.style.display = n > 0 ? "inline-block" : "none";
   nextBtn.style.display = n < steps.length - 1 ? "inline-block" : "none";
   submitBtn.style.display = n === steps.length - 1 ? "inline-block" : "none";
  }
  
  function validateStep(n) {
   const step = steps[n];
   const fields = step.querySelectorAll("input, textarea, select");
   
   for (const field of fields) {
    if (field.type === "radio" || field.type === "file") continue;
    if (!field.checkValidity()) {
     field.reportValidity();
     field.focus();
     return false;
    }
   }
   
   const radios = step.querySelectorAll('input[type="radio"]');
   if (radios.length > 0) {
    const groups = new Set();
    radios.forEach((r) => {
     if (r.required) groups.add(r.name);
    });
    for (const groupName of groups) {
     const checked = step.querySelector(
      `input[name="${groupName}"]:checked`
     );
     if (!checked) {
      const firstRadio = step.querySelector(
       `input[name="${groupName}"]`
      );
      if (firstRadio) {
       firstRadio.setCustomValidity("Please select an option.");
       firstRadio.reportValidity();
       firstRadio.setCustomValidity("");
       firstRadio.focus();
      }
      return false;
     }
    }
   }
   return true;
  }
  
  nextBtn.addEventListener("click", () => {
   if (!validateStep(currentStep)) return;
   if (currentStep < steps.length - 1) currentStep++;
   showStep(currentStep);
  });
  
  prevBtn.addEventListener("click", () => {
   if (currentStep > 0) currentStep--;
   showStep(currentStep);
  });
  
  form.addEventListener("submit", function(e) {
   if (!validateStep(currentStep)) {
    e.preventDefault();
    return false;
   }
  });
  
  showStep(currentStep);
 })();
 
 // Reference toggle
 const referencePref = document.getElementById("reference-preference");
 const referenceLabel = document.getElementById("reference-details-label");
 const referenceTextarea = document.getElementById("references");
 
 function toggleReferenceDetails() {
  if (!referencePref) return;
  const show = referencePref.value === "provide-details";
  referenceLabel.style.display = show ? "block" : "none";
  referenceTextarea.style.display = show ? "block" : "none";
 }
 
 toggleReferenceDetails();
 if (referencePref)
  referencePref.addEventListener("change", toggleReferenceDetails);
 
 // ---------------- PHONE INPUT WITH COUNTRY ----------------
 const phoneInput = document.querySelector("#phone");
 
 // Restore cached phone number
 const savedPhone = localStorage.getItem("savedPhone");
 if (savedPhone) phoneInput.value = savedPhone;
 
 const iti = window.intlTelInput(phoneInput, {
  initialCountry: "auto",
  allowDropdown: true,
  separateDialCode: false,
  geoIpLookup: (callback) => {
   const cachedCountry = localStorage.getItem("savedCountry");
   if (cachedCountry) {
    callback(cachedCountry);
    return;
   }
   fetch("https://ipapi.co/json")
    .then((res) => res.json())
    .then((data) => {
     localStorage.setItem("savedCountry", data.country_code);
     callback(data.country_code);
    })
    .catch(() => callback("us"));
  },
  utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js",
 });
 
 phoneInput.addEventListener("input", () => {
  localStorage.setItem("savedPhone", phoneInput.value);
 });
 
 phoneInput.addEventListener("countrychange", () => {
  const countryData = iti.getSelectedCountryData();
  if (countryData && countryData.iso2) {
   localStorage.setItem("savedCountry", countryData.iso2);
  }
 });
 
 // Restore saved country code on reload
 const savedCountry = localStorage.getItem("savedCountry");
 if (savedCountry && window.intlTelInputGlobals) {
  const itiSaved = window.intlTelInputGlobals.getInstance(phoneInput);
  if (itiSaved) itiSaved.setCountry(savedCountry);
 }
 
 // ---------------- FORM SUBMIT OVERLAY ----------------
 (function() {
  const form = document.querySelector("form.resume-form");
  const submitBtn = document.querySelector(".submit-btn");
  
  form.addEventListener("submit", function(e) {
   if (!form.checkValidity()) {
    e.preventDefault();
    form.reportValidity();
    return false;
   }
   
   const overlay = document.createElement("div");
   overlay.classList.add("loading-overlay");
   overlay.innerHTML = `
        <div class="spinner"></div>
        <div class="loading-text">Submitting</div>
      `;
   document.body.appendChild(overlay);
   submitBtn.disabled = true;
  });
 })();
