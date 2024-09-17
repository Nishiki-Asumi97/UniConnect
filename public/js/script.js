document.addEventListener("DOMContentLoaded", function () {

  FAQModule.submitFAQ();

  FAQUserModule.viewFAQListUser();
  FAQModule.showEditForm();
  FAQModule.closeModal();
  FAQModule.submitEditFAQ();

  initMap();
  getEvents();
  getCategories();
  const sidePanelC = document.getElementById("sidePanelC");
  const sidePanelE = document.getElementById("sidePanelE");
  const addCategoryBtn = document.getElementById("addCategoryBtn");
  const addEventBtn = document.getElementById("addEventBtn");
  const closePanel = document.getElementById("closePanel");
  const closePanelE = document.getElementById("closePanelE");
  const eventAddForm = document.getElementById("eventForm");
  const categoryForm = document.getElementById("categoryForm");
  const cancelForm = document.getElementById("cancel");
  const imagePreview = document.getElementById("imagePreview");
  const banner = document.getElementById("event-banner");
  var bannerBase64String = "";

  var dates = document.querySelectorAll(".datepicker");
  M.Datepicker.init(dates);

  var time = document.querySelectorAll(".timepicker");
  M.Timepicker.init(time);

  var selects = document.querySelectorAll("select");
  M.FormSelect.init(selects);

  var modal = document.querySelectorAll(".modal");
  M.Modal.init(modal, {
    onCloseEnd: function (el) {
      location.reload();
    },
  });

  // Open side panel
  addCategoryBtn.addEventListener("click", () => {
    sidePanelC.style.width = "25%";
    sidePanelC.style.display = "block";
    addCategoryBtn.style.display = "none";
    addEventBtn.style.display = "none";
    sidePanelC.classList.add("open");
    document.getElementById('overlay').classList.add('visible');
  });

  // Close side panel
  closePanel.addEventListener("click", () => {
    sidePanelC.style.marginLeft = "0%";
    sidePanelC.style.display = "none";
    addCategoryBtn.style.display = "inline-block";
    addEventBtn.style.display = "inline-block";
    sidePanelC.classList.remove("open");
    sidePanelE.style.marginLeft = "0%";
    sidePanelE.style.display = "none";
    sidePanelE.classList.remove("open");

    document.getElementById('overlay').classList.remove('visible');
    categoryForm.reset();
  });

  closePanelE.addEventListener("click", () => {
    sidePanelE.style.marginLeft = "0%";
    sidePanelE.style.display = "none";
    addCategoryBtn.style.display = "inline-block";
    addEventBtn.style.display = "inline-block";
    sidePanelE.classList.remove("open");

    document.getElementById('overlay').classList.remove('visible');
    eventAddForm.reset();
    imagePreview.src = "";
    bannerBase64String = "";
    eventLocation = {};
  });

  addEventBtn.addEventListener("click", () => {
    sidePanelE.style.width = "25%";
    sidePanelE.style.display = "block";
    addCategoryBtn.style.display = "none";
    addEventBtn.style.display = "none";
    sidePanelE.classList.add("open");
    document.getElementById('overlay').classList.add('visible');
    getCategories();
    initMapPlace();
  });

  cancelForm.addEventListener("click", () => {
    sidePanelE.style.marginLeft = "0%";
    sidePanelE.style.display = "none";
    addCategoryBtn.style.display = "inline-block";
    addEventBtn.style.display = "inline-block";
    sidePanelE.classList.remove("open");

    eventAddForm.reset();
    imagePreview.src = "";
    bannerBase64String = "";
    eventLocation = {};
  });

  //category filter area horizontal scroll
  const scrollContainer = document.getElementById("scroll-container");
  let isDragging = false;
  let startX;
  let scrollLeft;

  scrollContainer.addEventListener("mousedown", (e) => {
    isDragging = true;
    startX = e.pageX - scrollContainer.offsetLeft;
    scrollLeft = scrollContainer.scrollLeft;
    scrollContainer.style.cursor = "grabbing";
  });

  scrollContainer.addEventListener("mouseleave", () => {
    isDragging = false;
    scrollContainer.style.cursor = "grab";
  });

  scrollContainer.addEventListener("mouseup", () => {
    isDragging = false;
    scrollContainer.style.cursor = "grab";
  });

  scrollContainer.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - scrollContainer.offsetLeft;
    const walk = (x - startX) * 2;
    scrollContainer.scrollLeft = scrollLeft - walk;
  });

  scrollContainer.addEventListener("touchstart", (e) => {
    isDragging = true;
    startX = e.touches[0].pageX - scrollContainer.offsetLeft;
    scrollLeft = scrollContainer.scrollLeft;
    scrollContainer.style.cursor = "grabbing";
  });

  scrollContainer.addEventListener("touchend", () => {
    isDragging = false;
    scrollContainer.style.cursor = "grab";
  });

  scrollContainer.addEventListener("touchmove", (e) => {
    if (!isDragging) return;
    const x = e.touches[0].pageX - scrollContainer.offsetLeft;
    const walk = (x - startX) * 2;
    scrollContainer.scrollLeft = scrollLeft - walk;
  });

  //Event Banner Image Preview
  banner.addEventListener("change", function () {
    const file = banner.files[0];

    const reader = new FileReader();

    reader.onload = function (e) {
      const imageDataUrl = e.target.result;
      bannerBase64String = reader.result
        .replace("data:", "")
        .replace(/^.+,/, "");
      const imagePreview = document.getElementById("imagePreview");
      imagePreview.src = imageDataUrl;
    };

    reader.readAsDataURL(file);
  });

  document
    .getElementById("edit-event-btn")
    .addEventListener("click", function () {
      // Hide read-only view and show edit form
      document.getElementById("event-details-view").style.display = "none";
      document.getElementById("edit-event-form").style.display = "block";
      document.getElementById("edit-event-btn").style.display = "none";
      document.getElementById("delete-event-btn").style.display = "none";
      document.getElementById("save-update-btn").style.display = "inline-block";
      initMapPlaceUpdate();
    });

  document
    .getElementById("save-update-btn")
    .addEventListener("click", function () {
      var location = document.getElementById("edit-event-location");

      // prettier-ignore
      const updatedEvent = {
        "name": document.getElementById("edit-event-name").value,
        "details": document.getElementById("edit-details").value,
        "date": new Date(document.getElementById("edit-date").value),
        "location": {
          "address": location.value,
          "latitude": Number(location.getAttribute("latitude")),
          "longitude": Number(location.getAttribute("longitude")),  
        },
        "timeStart": document.getElementById("edit-timeStart").value,
        "timeEnd": document.getElementById("edit-timeEnd").value,
        "categories": Array.from(
          document.getElementById("edit-selectCategory").selectedOptions
        ).map((option) => option.value),
        "organizerName": document.getElementById("edit-organizerName").value,
        "organizerContact": document.getElementById("edit-organizerContact").value,
        "banner": updatedBannerString,
      };

      updateEvent(selectedEventId, updatedEvent);
    });

  //Submit Event Form
  eventAddForm.addEventListener("submit", async function (event) {
    var location = document.getElementById("event-location");

    event.preventDefault();

    const data =
      // prettier-ignore
      {
      "name": document.getElementById("event-name").value,
      "details": document.getElementById("details").value,
      "date": new Date(document.getElementById("date").value),
      "location": {
        "address": location.value,
        "latitude": Number(location.getAttribute("latitude")),
        "longitude": Number(location.getAttribute("longitude")),
      },
      "timeStart": document.getElementById("timeStart").value,
      "timeEnd": document.getElementById("timeEnd").value,
      "categories": Array.from(
        document.getElementById("selectCategory").selectedOptions
      ).map((option) => option.value),
      "organizerName": document.getElementById("organizerName").value,
      "organizerContact": document.getElementById("organizerContact").value,
      "banner": bannerBase64String,
    };

    try {
      await fetch("/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      M.toast({ html: "Event Added Successfully" });
      eventAddForm.reset();
      imagePreview.src = "";
      sidePanelE.classList.remove("open");

      getEvents();
      setTimeout(() => {
        location.reload();
      }, 1000);
    } catch (err) {
      M.toast({ html: "Event Adding Failed" });
    }
  });

  document
    .getElementById("delete-event-btn")
    .addEventListener("click", function () {
      if (selectedEventId) {
        deleteEvent(selectedEventId);
      }
    });
});

let markers = [];
let currentInfoWindow = null;
let selectedEventId = null;
let selectedEventAttendess = 0;
let map;
let updatedBannerString = "";
let existingCategories = [];
let oldCategoryValue = "";

// GET categories
async function getCategories() {
  try {
    await fetch("/categories")
      .then((response) => response.json())
      .then((categories) => {
        showCategories(categories);
        showCategoryFilters(categories);
      });
  } catch (err) {
    console.log("Failed to fetch categories:", err);
  }
}

//Show Categories inside Category Side Panel
function showCategories(categories) {
  const categoryList = document.getElementById("categoryList");
  categoryList.innerHTML = "";

  const table = document.createElement("table");
  const tbody = document.createElement("tbody");

  var select = document.getElementById("selectCategory");
  var selectEdit = document.getElementById("edit-selectCategory");
  populateSelect(categories, select);
  populateSelect(categories, selectEdit);
  existingCategories.length = 0;

  categories.forEach((category) => {
    existingCategories.push(category.name);

    const tr = document.createElement("tr");
    tr.id = `category-row-${category._id}`;

    tr.innerHTML = `
      <td id="category-name-${category._id}">${category.name}</td>
      <td>
          <button class="btn-medium btn-floating light-blue accent-3" id="editBtn" onclick="updateCategory('${category._id}')">
            <i class="material-icons">edit</i>
          </button>
      </td>
      <td>
          <button class="btn-medium red btn-floating" id="deleteBtn" onclick="deleteCategory('${category._id}')">
            <i class="material-icons">delete</i>
          </button>
      </td>
    `;

    tbody.appendChild(tr);
  });

  table.appendChild(tbody);
  categoryList.appendChild(table);
}

//Show Category Filters
function showCategoryFilters(categories) {
  const cardList = document.getElementById("scroll-container");
  cardList.innerHTML = "";

  const allCard = document.createElement("div");
  allCard.classList.add(
    "option-card",
    "center-align",
    "white",
    "z-depth-1",
    "activeCard"
  );

  allCard.innerHTML = `<h5>All</h5>`;

  allCard.addEventListener("click", function () {
    document.querySelectorAll(".option-card").forEach((card) => {
      card.classList.remove("activeCard");
    });
    allCard.classList.add("activeCard");
    getEvents();
  });

  cardList.appendChild(allCard);

  categories.forEach((category) => {
    const card = document.createElement("div");
    card.classList.add("option-card", "center-align", "white", "z-depth-1");
    card.innerHTML = `
    <h5>${category.name}</h5>`;

    card.addEventListener("click", function () {
      document.querySelectorAll(".option-card").forEach((card) => {
        card.classList.remove("activeCard");
      });

      card.classList.add("activeCard");
      getEventsByCategory(category._id);
    });
    cardList.appendChild(card);
  });
}

//Validate Categories
function validateCategory() {
  const category = document.getElementById("name").value;
  if (existingCategories.includes(category.trim())) {
    M.toast({ html: "This Category already exist", classes: "toast" });
    return false;
  }
}

//GET All Events
async function getEvents() {
  showSpinner();
  try {
    await fetch("/events")
      .then((response) => response.json())
      .then((events) => {
        setEventCardContainer(events);
      });
  } catch (e) {
    console.log(e);
  }
}

//Get Events by filtered Category
async function getEventsByCategory(category) {
  try {
    showSpinner();
    await fetch(`/events/category/${category}`)
      .then((response) => response.json())
      .then((events) => {
        setEventCardContainer(events);
      });
  } catch (e) {
    console.log(e);
  }
}

//Show Events in Page
function setEventCardContainer(events) {
  const cardContainer = document.getElementById("event-container");
  cardContainer.innerHTML = "";
  if (events.length === 0) {
    const noDataMessage = document.createElement("div");
    noDataMessage.classList.add("no-data");
    noDataMessage.textContent = "No Events available.";
    cardContainer.appendChild(noDataMessage);
    initMap();
    hideSpinner();
    return;
  }
  markers.forEach((marker) => {
    marker.setMap(null); // Removes the marker from the map
  });
  markers = [];

  events.forEach((event) => {
    const card = document.createElement("div");
    card.classList.add("card");

    card.innerHTML = `
      <div class="card-image">
        <img src="data:image/png;base64,${
          event.banner
        }" onerror="this.onerror=null; this.src='./img/img-noload.jpg';" alt="Event Image">
        <span class="card-title">
          ${new Date(event.date).toDateString()} <br/> 
          ${event.timeStart} - ${event.timeEnd}
        </span>
      </div>
      <div class="card-content">
        <span class="card-title">${event.name}</span>
        <p>${event.details}</p>
      </div>
      <div class="card-action">
        <div class="row">
          <div class="col s1"><i class="material-icons icon-location">location_on</i></div>
          <div class="col s5">${event.location?.address}</div>
          <div class="col s5">
            <button class="waves-light btn" id="rsvp-btn-${event._id}" 
                onclick="updateRSVP('${event._id}',${
      event.attendees
    })">RSVP</button>
            <span id="attendees-count-${event._id}">${
      event.attendees
    } Going</span>
          </div>
          <div class="col s1">
          <button class="btn-flat view-event-btn"><i class="material-icons icon-view">visibility</i></button></div>
        </div>
      </div>
    `;
    cardContainer.appendChild(card);

    const viewButton = card.querySelector(".view-event-btn");
    viewButton.addEventListener("click", () => viewEvent(event));

    var marker = new google.maps.Marker({
      position: { lat: event.location.latitude, lng: event.location.longitude },
      map: map,
      title: event.address,
    });

    markers.push(marker);

    var infoWindow = new google.maps.InfoWindow({
      content: `<div><strong>${event.name}</strong><br>
      ${new Date(event.date).toDateString()}<br>
      ${event.timeStart} - ${event.timeEnd}<br>
      ${event.location.address}</div>`,
    });

    marker.addListener("click", function () {
      if (currentInfoWindow) {
        currentInfoWindow.close();
      }
      infoWindow.open(map, marker);
      currentInfoWindow = infoWindow;
    });

    hideSpinner();
  });
}

//View of an Event when click view btn
function viewEvent(event) {
  const modal = document.getElementById("eventModal");
  const modalTitle = document.getElementById("modal-title");
  const modalContent = document.getElementById("modal-content");
  selectedEventId = event._id;
  selectedEventAttendess = event.attendees;

  modalTitle.innerHTML = event.name;
  modalContent.innerHTML = `
    <div class="row">
     <div class="col s12 m6 l6">
      <img id="modal-image" src="data:image/png;base64,${
        event.banner
      }" alt="Event Image" class="responsive-img modal-image">
     </div>
     <div class="col s12 m6 l6">
      <p id="modal-date-time" class="modal-info">
      <i class="material-icons">event</i><b>Date:</b> ${new Date(
        event.date
      ).toDateString()}</p>
      <p id="modal-date-time" class="modal-info">
      <i class="material-icons">timelapse</i><b>Time:</b> ${
        event.timeStart
      } - ${event.timeEnd}</p>
      <p id="modal-location" class="modal-info">
      <i class="material-icons">location_city</i><b>Location:</b> ${
        event.location.address
      }</p>
      <p id="modal-organizer" class="modal-info">
      <i class="material-icons">assignment_ind</i><b>Organizer:</b>${
        event.organizerName
      } - ${event.organizerContact}</p>
      <p id="modal-location" class="modal-info">
      <i class="material-icons">accessibility</i>${
        event.attendees
      } Going to Attend</p>
      <p id="modal-details" class="modal-info">${event.details}</p>
     </div>
    </div>
    `;

  // Open the modal
  const modalInstance = M.Modal.getInstance(modal);
  modalInstance.open();

  const selectedCategories = event.categories;
  document.getElementById("edit-event-name").value = event.name;
  document.getElementById("edit-date").value = event.date.split("T")[0]; // Format the date properly
  document.getElementById("edit-timeStart").value = event.timeStart;
  document.getElementById("edit-timeEnd").value = event.timeEnd;
  document.getElementById("edit-details").value = event.details;
  document.getElementById("edit-organizerName").value = event.organizerName;
  document.getElementById("edit-organizerContact").value =
    event.organizerContact;
  var location = document.getElementById("edit-event-location");
  location.value = event.location.address;
  location.setAttribute("latitude", event.location.latitude);
  location.setAttribute("longitude", event.location.longitude);

  var selectElement = document.getElementById("edit-selectCategory");
  selectElement.value = event.categories;

  Array.from(selectElement.options).forEach((option) => {
    if (selectedCategories.includes(option.value)) {
      option.selected = true;
    } else {
      option.selected = false;
    }
  });

  var editPreview = document.getElementById("edit-imagePreview");

  var editBanner = document.getElementById("edit-event-banner");
  editPreview.src = `data:image/png;base64,${event.banner}`;
  updatedBannerString = event.banner;

  editBanner.addEventListener("change", function () {
    const file = editBanner.files[0];

    const reader = new FileReader();

    reader.onload = function (e) {
      const imageDataUrl = e.target.result;
      updatedBannerString = reader.result
        .replace("data:", "")
        .replace(/^.+,/, "");
      editPreview.src = imageDataUrl;
    };

    reader.readAsDataURL(file);
  });
}

//Delete Event
function deleteEvent(eventId) {
  if (confirm("Are you sure you want to delete this event?")) {
    fetch(`/events/${eventId}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (response.ok) {
          M.toast({ html: "Event deleted successfully" });
          setTimeout(() => {
            location.reload();
          }, 1000);
          location.reload();
        } else {
          M.toast({ html: "Failed to delete the event" });
          setTimeout(() => {
            location.reload();
          }, 1000);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }
}

//Update Event API Call
function updateEvent(eventId, updatedEvent) {
  fetch(`/events/${eventId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedEvent),
  })
    .then((response) => {
      if (response.ok) {
        M.toast({ html: "Event updated successfully" });
      } else {
        M.toast({ html: "Failed to update event" });
      }
      setTimeout(() => {
        location.reload();
      }, 1000);
    })
    .catch((error) => {
      console.log("Error:", error);
    });
}

// Populate Categories into Event Forms
function populateSelect(data, select) {
  var instance = M.FormSelect.getInstance(select);
  if (instance) {
    instance.destroy();
  }
  select.innerHTML = `<option value="" disabled>--Select an option--</option>`;

  data.forEach((item) => {
    const option = document.createElement("option");
    option.value = item._id;
    option.textContent = item.name;
    option.index;
    select.appendChild(option);
  });

  M.FormSelect.init(select);

  var dropdownItems = document.querySelectorAll(".select-dropdown li");
  dropdownItems.forEach(function (item, index) {
    item.setAttribute("tabindex", (index + 1).toString());
  });
}

//RSVP Count Increase
function updateRSVP(id) {
  const attendeesCount = document.getElementById(`attendees-count-${id}`);
  let count = attendeesCount.textContent.split(" ")[0];
  let value = parseInt(count);
  attendeesCount.textContent = `${value + 1} Going`;

  try {
    fetch(`/events/rsvp/${id}`, {
      method: "PATCH",
    });
  } catch (err) {
    attendeesCount.textContent = `${value} Going`;
  }
}

//Delete Category
async function deleteCategory(id) {
  if (confirm("Are you sure you want to delete this item?")) {
    try {
      await fetch(`/categories/${id}`, {
        method: "DELETE",
      }).then((response) => {
        if (response.ok) {
          M.toast({ html: "Category Deleted", classes: "toast" });
          const row = document.getElementById(`category-row-${id}`);
          if (row) {
            row.remove();
          }
        } else {
          M.toast({
            html: "This already associated with Events",
            classes: "toast",
          });
        }
      });
      getCategories();
    } catch (err) {
      console.log(err);
    }
  }
}

//Update Category View Setup
function updateCategory(id) {
  document
    .querySelectorAll("button")
    .forEach((button) => (button.disabled = true));

  const cell = document.getElementById(`category-name-${id}`);
  var categoryValue = cell.textContent;
  oldCategoryValue = categoryValue;

  cell.innerHTML = ` <input type="text" id="edit-category-input-${id}" value="${categoryValue}">
        <button class="btn-small light-blue accent-3 waves-effect waves-light btn" onClick="saveUpdateCategory('${id}')">Save</button>
        <button class="btn-small red waves-effect waves-light btn" onclick="cancelUpdateCategory('${id}','${categoryValue}')">Cancel</button>`;
}

//Category Update Cancel
function cancelUpdateCategory(id, value) {
  document
    .querySelectorAll("button")
    .forEach((button) => (button.disabled = false));
  const cell = document.getElementById(`category-name-${id}`);
  cell.textContent = value;
}

//Save Category Update
async function saveUpdateCategory(id) {
  document
    .querySelectorAll("button")
    .forEach((button) => (button.disabled = false));
  const newValue = document.getElementById(`edit-category-input-${id}`).value;

  const cell = document.getElementById(`category-name-${id}`);
  cell.textContent = newValue;

  try {
    if (existingCategories.includes(newValue.trim())) {
      M.toast({ html: "This Category already exist", classes: "toast" });
      cell.textContent = oldCategoryValue;
      return;
    }else{
      await fetch(`/categories/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(
          // prettier-ignore
          { "name": newValue }
        ),
      })
      .then((response) => {
        if(response.ok){
          M.toast({ html: "Category Updated" , classes:"toast"});
          getCategories();
        }
      });
    }
  } catch (err) {
    console.log();
  }
}

function showSpinner() {
  document.getElementById("spinner").style.display = "block";
}

function hideSpinner() {
  document.getElementById("spinner").style.display = "none";
}

// Load map
async function initMap() {
  const { Map } = await google.maps.importLibrary("maps");
  await google.maps.importLibrary("places");

  map = new Map(document.getElementById("map"), {
    center: { lat: -25.2744, lng: 133.7751 },
    zoom: 4.5,
  });
}

//Setup Location place Autocomplete
async function initMapPlace() {
  //@ts-ignore
  await google.maps.importLibrary("places");
  const location = document.getElementById("event-location");
  //@ts-ignore
  placeAutocomplete = new google.maps.places.Autocomplete(location, {
    componentRestrictions: { country: "au" },
  });

  //@ts-ignore
  placeAutocomplete.addListener("place_changed", function () {
    var place = placeAutocomplete.getPlace();
    if (!place.geometry || !place.geometry.location) {
      console.log("No details available for input: '" + place.name + "'");
      return;
    }

    location.setAttribute("latitude", place.geometry.location.lat());
    location.setAttribute("longitude", place.geometry.location.lng());
  });
}

async function initMapPlaceUpdate() {
  //@ts-ignore
  await google.maps.importLibrary("places");
  const location = document.getElementById("edit-event-location");
  //@ts-ignore
  placeAutocomplete = new google.maps.places.Autocomplete(location, {
    componentRestrictions: { country: "au" },
  });

  //@ts-ignore
  placeAutocomplete.addListener("place_changed", function () {
    var place = placeAutocomplete.getPlace();
    if (!place.geometry || !place.geometry.location) {
      console.log("No details available for input: '" + place.name + "'");
      return;
    }

    location.setAttribute("latitude", place.geometry.location.lat());
    location.setAttribute("longitude", place.geometry.location.lng());
  });
}

// FAQ module ==========================================================

const FAQModule = (function () {

  //create FAQ
  function submitFAQ() {
    const submitButton = document.getElementById('submitButton');

    submitButton.addEventListener('click', function (event) {
      event.preventDefault();

      const question = document.getElementById('question').value;
      const answer = document.getElementById('answer').value;

      if (!question || !answer) {
        alert("Both Question and Answer are required!");
        return;
      }

      // Data to be sent
      const formData = { question, answer };

      // Send the data to the backend
      fetch('/FAQ/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })
      .then(response => response.json())
      .then(data => {
        if (data.error) {
          alert(data.error);
        } else {
          alert('FAQ added successfully!');
          document.getElementById('question').value = '';
          document.getElementById('answer').value = '';
          viewFAQList();
        }
      })
      .catch(error => console.error('Error:', error));
    });
  }

    // Function to submit the edit form and call the Edit API
  function submitEditFAQ() {
    console.log("api eka athulkata enawa")
    const id = document.getElementById('editFAQId').value;
    console.log("meka thmai frontend eke id eka" +id );
    const newQuestion = document.getElementById('editFAQQuestion').value;
    const newAnswer = document.getElementById('editFAQAnswer').value;



    // Send the PUT request to the edit API
    fetch('FAQ/edit', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: id, // The FAQ's ID
        newQuestion: newQuestion,
        newAnswer: newAnswer
      }),
    })
    .then(response => response.json())
    .then(data => {
      if (data.error) {
        alert(data.error);
      } else {
        alert('FAQ updated successfully!');
        document.getElementById(`category-name-${id}`).innerText = `${newQuestion} - ${newAnswer}`;
          
      // Update the FAQ directly in the list without page reload
      const faqRow = document.getElementById(`category-name-${id}`);
      faqRow.innerHTML = `${newQuestion} - ${newAnswer}`;

      // Hide the modal after saving changes
      document.getElementById('editFAQModal').style.display = 'none';

      // Show the Edit and Delete buttons again
      const buttons = document.querySelectorAll('.editBtnFAQ, .deleteBtnFAQ');
      buttons.forEach(button => {
        button.style.display = 'inline-block'; // Show the buttons again
      });
      }
    })
    .catch(error => console.error('Error:', error));
  }
    

  // Function to view FAQ list
  function viewFAQList() {
        
    fetch('/FAQ/list')
    .then(response => response.json())
    .then(data => {
       const faqContainer = document.getElementById('FAQList');
       faqContainer.innerHTML = '';  // Clear the existing list

            if (!data || !data.data || data.data.length === 0) {
              faqContainer.innerHTML = '<li>No FAQs available</li>';
              return;
            }

            const table = document.createElement('table');
        table.style.width = '100%';
        table.style.borderCollapse = 'collapse';
        table.style.marginBottom = '20px';


              data.data.forEach(faq => {
                const listItem = document.createElement('tr');
            listItem.id = `category-row-${faq._id}`;
            listItem.classList.add('collection-item');
            listItem.innerHTML = `
                <td id="category-name-${faq._id}">${faq.question} - ${faq.answer}</td>
                <td>
                <button class="waves-effect waves-light btn light-blue editBtnFAQ" onclick="showEditForm('${faq._id}','${faq.question}','${faq.answer}')" faq-id="${faq._id}" que-id="${faq.question}" ans-id="${faq.answer}">
                  EDIT
                </button>
                
                <!-- Edit FAQ Modal with inline CSS -->
                <div id="editFAQModal" style="
                  display: none;
                  position: fixed;
                  z-index: 1;
                  left: 0;
                  top: 0;
                  width: 100%;
                  height: 100%;
                  overflow: auto;
                  background-color: rgba(0, 0, 0, 0.4);
                ">
                  <div class="modal-content" style="
                    background-color: #f0f8ff;
                    margin: 15% auto;
                    padding: 20px;
                    border: 2px solid #add8e6;
                    width: 30%;
                    border-radius: 10px;
                    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
                  ">
                    <h3 style="
                      color: #0077b6;
                      font-weight: bold;
                      text-align: center;
                      margin-bottom: 20px;
                    ">Edit FAQ</h3>
                    <input type="hidden" id="editFAQId">
                    <div style="margin-bottom: 15px;">
                      <label for="editFAQQuestion" style="display: block; margin-bottom: 5px;">Question</label>
                      <input type="text" id="editFAQQuestion" style="
                        width: 100%;
                        padding: 5px;
                        border: 1px solid #ccc;
                        border-radius: 5px;
                      ">
                    </div>
                    <div style="margin-bottom: 15px;">
                      <label for="editFAQAnswer" style="display: block; margin-bottom: 5px;">Answer</label>
                      <input type="text" id="editFAQAnswer" style="
                        width: 100%;
                        padding: 5px;
                        border: 1px solid #ccc;
                        border-radius: 5px;
                      ">
                    </div>
                    <div style="
                      text-align: center;
                      padding: 10px;
                    ">
                      <button class="waves-effect waves-light btn light-blue editBtnFAQsave" onclick="submitEditFAQ()">
                        Save Changes
                      </button>
                      <button class="waves-effect waves-light btn red editBtnFAQcancel" onclick="
                        document.getElementById('editFAQModal').style.display = 'none';
                        window.location.href = 'http://localhost:3000/FAQ';
                      ">
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
                </div>
                
                </td>
              <td>
              <td>
                <button class="waves-effect waves-light btn red deleteBtnFAQ" onclick="deleteFAQ('${faq._id}')" data-id="${faq._id}">
                 DELETE
                </button>
                </td>
                `
            faqContainer.appendChild(listItem);
                
                
            });

            // Initialize delete button functionality
            initializeDeleteButtons();
            initializeEditButtons();
            })
      .catch(error => console.error('Error fetching FAQs:', error));    
  }


  // Function to delete FAQ based on its ID
  function deleteFAQ(faqId) {
    // Confirm deletion before proceeding
    const confirmDelete = confirm('Are you sure you want to delete this FAQ?');
    
    if (!confirmDelete) {
      return; // If the user cancels, do nothing
    }

    // Send DELETE request to the backend
    fetch(`/FAQ/delete/${faqId}`, {
      method: 'DELETE',
    })
    .then(response => response.json())
    .then(data => {
      if (data.error) {
        alert(data.error);
      } else {
        alert('FAQ deleted successfully!');
        // Remove the deleted FAQ from the DOM
        document.getElementById(`category-name-${faqId}`).parentElement.remove();
      }
    })
    .catch(error => console.error('Error:', error));
  }

  function showEditForm(id, question, answer){
    console.log("edit form ekata enawa");
    const modal = document.getElementById('editFAQModal');
    modal.style.display = 'block'; // Show the modal
    document.getElementById('editFAQId').value = id;
    document.getElementById('editFAQQuestion').value = question;
    document.getElementById('editFAQAnswer').value = answer;

    console.log("edit form ekata eddi id eka: ",question  )

    // Hide the Edit and Delete buttons
    const buttons = document.querySelectorAll('.editBtnFAQ, .deleteBtnFAQ');
    buttons.forEach(button => {
      button.style.display = 'none'; // Hide all Edit and Delete buttons
    });

    // Register the save event listener
    const saveButton = document.querySelector('.editBtnFAQsave');
    saveButton.onclick = function () {
      submitEditFAQ();
    };
    
  }

  // Initialize delete buttons event listeners
  function initializeDeleteButtons() {
    const deleteButtons = document.querySelectorAll('.deleteBtnFAQ');

    deleteButtons.forEach(button => {
      button.addEventListener('click', function () {
        const faqId = this.getAttribute('data-id');
        deleteFAQ(faqId);
      });
    });
  }

  function initializeEditButtons(){
    const editButtons = document.querySelectorAll('.editBtnFAQ');
    editButtons.forEach(button => {
    button.addEventListener('click', function () {
      const faqId = this.getAttribute('faq-id');
      const que = this.getAttribute('que-id');
      const ans = this.getAttribute('ans-id');

      console.log(faqId)
      showEditForm(faqId,que,ans);
    });
    });
  }

  viewFAQList();

  return {
    submitFAQ,
    viewFAQList,
    deleteFAQ,
    showEditForm,
    submitEditFAQ
  };
})();

const FAQUserModule = (function (){

  //Display the FAQ list to the user
  function viewFAQListUser() {
    fetch('/FAQ/User/list')
      .then(response => response.json())
      .then(data => {
        const faqContainer = document.getElementById('ViewFAQList');
        faqContainer.innerHTML = '';  // Clear the existing list
  
        if (!data || !data.data || data.data.length === 0) {
          faqContainer.innerHTML = '<p>No FAQs available</p>';
          return;
        }
  
        data.data.forEach(faq => {
          // Create a card element for each FAQ
          const card = document.createElement('div');
          card.classList.add('card');
          card.innerHTML = `
            <div class="faq-user-page card-content">
              <span class="faq-user-page card-title">${faq.question}</span>
              <p>${faq.answer}</p>
            </div>
          `;
  
          faqContainer.appendChild(card);
        });
      })
      .catch(error => console.error('Error fetching FAQs:', error));
  }

  viewFAQListUser();

  return {
    viewFAQListUser
  };
})();
