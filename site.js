/**
 * Initialize all the html elements
 */
const addPrefForm = document.getElementById("preference");
const formUsername = document.getElementById("username");
const formActivity = document.getElementById("activity");
const formTimespan = document.getElementById("timeSpent");
const tbody = document.getElementById("tbody");

const btnShowForm = document.getElementById("btnShowForm");
const btnDelete = document.getElementById("btnDeleteAll");
const btnSavePref = document.getElementById("btnSubmit");

var modal = document.getElementById("myModal");
// const data = {
//   username: "test",
//   activities: [
//     {
//       activity: "Some random value",
//       timespan: 60,
//     },
//     {
//       activity: "Some other random value",
//       timespan: 60,
//     },
//   ],
// };

/**
 * Function to load all activities from a json file and load them to the page
 */
const loadAllActivities = () => {
  // load data
  const data = readActivities();

  //console.log(data);

  if (data === null) {
    return;
  }

  // clear table -  prevents duplicates
  tbody.innerHTML = "";

  // append to table
  // iterate through the activities array
  for (var a = 0; a < data.activities.length; a++) {
    let tr = document.createElement("tr");
    let td = document.createElement("td");
    let td2 = document.createElement("td");
    let td3 = document.createElement("td");

    td.innerText = data.activities[a].activity;
    td2.innerText = data.activities[a].timespan + "min";
    //td3.innerText = "/";

    tr.appendChild(td);
    tr.appendChild(td2);
    //tr.appendChild(td3);

    tbody.appendChild(tr);
  }

  logEvents({
    event: "Activities data retrieval",
    data,
  });
};

/**
 * Events for button clicks
 */
btnShowForm.addEventListener("click", (e) => {
  // prevent the page from reloading
  e.preventDefault();

  // get the preference section and show it
  // addPrefForm.classList.remove("hide");
  // addPrefForm.classList.add("show");
  modal.style.display = "block";
});

btnSavePref.addEventListener("click", (e) => {
  // prevent the page from reloading
  e.preventDefault();

  let username = formUsername.value;
  let activity = formActivity.value;
  let timespan = formTimespan.value;

  if (activity == "" || timespan == "") {
    alert("Please fill all fields");
    return;
  }

  const newPref = {
    activity,
    timespan,
  };

  // load data
  let data = readActivities();

  if (data === null) {
    data = {
      activities: [],
    };
  }

  data.activities.push(newPref);

  writeToStorage(data);

  loadAllActivities();

  logEvents({
    event: "Updating user preference",
    data: newPref,
  });

  // get the preference section and hide it
  // addPrefForm.classList.remove("show");
  // addPrefForm.classList.add("hide");

  modal.style.display = "none";
});

// Read data
function readActivities() {
  const response = localStorage.getItem("activities");
  //console.log(response)
  const data = JSON.parse(response);
  return data;
}

// Write data
const writeToStorage = (data) => {
  //console.log(data);
  localStorage.setItem("activities", JSON.stringify(data));
};

function addRowHandlers() {
  var table = document.getElementById("table");
  var rows = table.getElementsByTagName("tr");
  for (i = 0; i < rows.length; i++) {
    var currentRow = table.rows[i];
    console.log(i);
    var createClickHandler = function (row) {
      return function () {
        var cell = row.getElementsByTagName("td")[0];
        var id = cell.innerHTML;
        //alert("activity:" + id);
      };
    };

    currentRow.onclick = createClickHandler(currentRow);
  }
}

btnDelete.addEventListener("click", (e) => {
  e.preventDefault();
  var h = confirm(
    "This action will delete all the saved activities. Kindly confirm to clear all."
  );
  if (h) {
    localStorage.setItem("activities", null);
    alert("All activities have been cleared successfully!");
  }
  location.reload();
});

//function to control Hue lights
async function controlHueLights() {
  // Hue credentials
  const hueConfig = {
    bridgeIP: "your_bridge_ip",
    username: "your_hue_username",
  };

  // API request to Philips Hue bridge
  try {
    const response = await fetch(
      `http://${hueConfig.bridgeIP}/api/${hueConfig.username}/lights`
    );
    const lightsData = await response.json();

    logEvents({
      event: "Setting Hue lights",
      data: lightsData,
    });
    //console.log("Hue lights:", lightsData);
  } catch (error) {
    console.error("Error fetching Hue lights:", error.message);
  }
}

// load all events
const logEvents = (data) => {
  console.log(data);
};

// execute functions
window.onload = (e) => {
  loadAllActivities();

  if (e.target == modal) {
    modal.style.display = "none";
  }
};
