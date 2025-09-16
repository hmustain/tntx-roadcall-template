// Helper function: Show a dynamic section and (optionally) scroll it into view
function showSection(sectionElement) {
  sectionElement.style.display = "block";
}

document.addEventListener("DOMContentLoaded", function () {
  // Multi-step navigation variables
  var currentStep = 1;
  var steps = document.querySelectorAll(".form-step");
  var totalSteps = steps.length;

  function showStep(step) {
    steps.forEach(function (el) {
      el.style.display = "none";
    });
    var stepElement = document.getElementById("step-" + step);
    stepElement.style.display = "block";
    stepElement.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  document.querySelectorAll(".next-step").forEach(function (button) {
    button.addEventListener("click", function () {
      if (currentStep < totalSteps) {
        currentStep++;
        showStep(currentStep);
      }
    });
  });

  document.querySelectorAll(".prev-step").forEach(function (button) {
    button.addEventListener("click", function () {
      if (currentStep > 1) {
        currentStep--;
        showStep(currentStep);
      }
    });
  });

  showStep(currentStep);

  // === Dynamic sections ===
  var companySelect = document.getElementById("company");
  var fedexDetails = document.getElementById("fedexDetails");
  var otherCompanyContainer = document.getElementById("otherCompanyContainer");
  var driverTypeSection = document.getElementById("driverTypeSection");
  var destinationSection = document.getElementById("destinationSection");
  var customerNameSection = document.getElementById("customerNameSection");

  var accidentSection = document.getElementById("accidentSection");
  var accidentLinkSection = document.getElementById("accidentLinkSection");
  var accidentSelect = document.getElementById("accidentSelect");

  companySelect.addEventListener("change", function () {
    fedexDetails.style.display = "none";
    otherCompanyContainer.style.display = "none";
    driverTypeSection.style.display = "none";
    destinationSection.style.display = "none";
    customerNameSection.style.display = "none";
    accidentSection.style.display = "none";
    accidentLinkSection.style.display = "none";

    if (this.value === "FedEx") showSection(fedexDetails);
    if (this.value === "Other") showSection(otherCompanyContainer);
    if (this.value === "Big M") showSection(driverTypeSection);
    if (this.value === "RE Garrison") accidentSection.style.display = "block";

    updateBigMFlagBanner();
  });

  accidentSelect.addEventListener("change", function () {
    accidentLinkSection.style.display = (this.value === "yes") ? "block" : "none";
  });

  // === Load number / weight / destination ===
  var loadStatusSelect = document.getElementById("loadStatus");
  var loadNumberSection = document.getElementById("loadNumberSection");
  var weightSection = document.getElementById("weightSection");

  loadStatusSelect.addEventListener("change", function () {
    var isLoaded = this.value === "loaded";
    loadNumberSection.style.display = isLoaded ? "block" : "none";
    weightSection.style.display = (isLoaded && companySelect.value !== "RE Garrison") ? "block" : "none";

    if (isLoaded && companySelect.value === "RE Garrison") {
      destinationSection.style.display = "block";
      customerNameSection.style.display = "block";
    } else {
      destinationSection.style.display = "none";
      customerNameSection.style.display = "none";
    }
  });

  // === Big M Driver Flag Banner ===
  var truckInput = document.getElementById("truck");
  var bigMFlagBanner = document.createElement("div");
  bigMFlagBanner.id = "bigMFlagBanner";
  bigMFlagBanner.className = "alert alert-danger d-none";
  bigMFlagBanner.style.whiteSpace = "pre-wrap";

  // List of flagged trucks
  const bigMDriverFlags = [
    {
      truck: "1455",
      driver: "John Barresi",
      phone: "615-502-9938",
      message: "Must call Big M for ANY approvals before work is done.\nExceptions:FedEx load OR roadside emergency."
    },
    {
      truck: "1335",
      driver: "David Glade",
      phone: "",
      message: "Must call Big M for ANY approvals before work is done.\nExceptions:FedEx load OR roadside emergency."
    }
  ];

  function updateBigMFlagBanner() {
    const isBigM = companySelect.value === "Big M";
    const truckNumber = (truckInput.value || "").trim();
    const matchedFlag = bigMDriverFlags.find(f => f.truck === truckNumber);
    if (isBigM && matchedFlag) {
      bigMFlagBanner.innerHTML = `🚨 BIG M – UNIT ${matchedFlag.truck} (Driver: ${matchedFlag.driver}${matchedFlag.phone ? `, ${matchedFlag.phone}` : ""})\n${matchedFlag.message}`;
      bigMFlagBanner.classList.remove("d-none");
    } else {
      bigMFlagBanner.classList.add("d-none");
    }
  }

  var formEl = document.getElementById("roadCallForm");
  formEl.parentNode.insertBefore(bigMFlagBanner, formEl);
  companySelect.addEventListener("change", updateBigMFlagBanner);
  truckInput.addEventListener("input", updateBigMFlagBanner);
  updateBigMFlagBanner();

  // === Tire questions & damage details ===
  var tireBreakdownSelect = document.getElementById("tireBreakdown");
  var tireQuestions = document.getElementById("tireQuestions");
  tireBreakdownSelect.addEventListener("change", function () {
    if (this.value === "yes") {
      showSection(tireQuestions);
      setTimeout(() => document.getElementById("step-8").scrollIntoView({ behavior: "smooth", block: "end" }), 100);
    } else {
      tireQuestions.style.display = "none";
    }
  });

  var damageSelect = document.getElementById("damage");
  var damageDetails = document.getElementById("damageDetails");
  damageSelect.addEventListener("change", function () {
    damageDetails.classList.toggle("d-none", this.value !== "yes");
  });

  // === Generate Report ===
  document.getElementById("roadCallForm").addEventListener("submit", function (e) {
    e.preventDefault();

    var formData = new FormData(this);
    var data = {};
    formData.forEach((value, key) => data[key] = value);

    if (data["Company"] === "Other") {
      data["Company"] = data["Other Company"] || "Other";
      delete data["Other Company"];
    }

    var unitType = "", unitNumber = "";
    if (data["Unit Affected"]) {
      if (data["Unit Affected"].toLowerCase() === "tractor") {
        unitType = "TRK"; unitNumber = data["Truck Number"] || "";
      } else if (data["Unit Affected"].toLowerCase() === "trailer") {
        unitType = "TRL"; unitNumber = data["Trailer Number"] || "";
      }
    }

    // Build subject line
    var subjectLine = "";
    if (data["RC #?"]) {
      subjectLine += "RC" + data["RC #?"];
      if (data["Load Number"] && (data["Company"] === "Big M" || data["Company"] === "RE Garrison")) {
        subjectLine += "/LD" + data["Load Number"];
        if (data["Company"] === "RE Garrison" && data["Customer Name"]) subjectLine += " " + data["Customer Name"];
      }
      subjectLine += "  - ";
    }

    if (data["Company"]) {
      if (data["Company"] === "RE Garrison") {
        subjectLine += "RE Garrison";
        if (data["Truck Number"]) subjectLine += " TRK " + data["Truck Number"];
        if (data["Trailer Number"]) subjectLine += "/TRL " + data["Trailer Number"];
      } else {
        subjectLine += data["Company"];
        if (unitType) subjectLine += " " + unitType;
        if (unitNumber) subjectLine += " " + unitNumber;
      }
      subjectLine += " - ";
    }

    if (data["Complaint"]) subjectLine += data["Complaint"] + " - ";
    if (data["City"] && data["State"]) subjectLine += data["City"] + ", " + data["State"];

    // Date/Time
    var now = new Date();
    var monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    var dateString = monthNames[now.getMonth()] + " " + String(now.getDate()).padStart(2, "0");
    var hours24 = now.getHours(), ampm = hours24 >= 12 ? "PM" : "AM";
    var hours12 = hours24 % 12 || 12;
    var minutes = String(now.getMinutes()).padStart(2, "0");
    var timeString = hours12 + ":" + minutes + " " + ampm;

    // Build table
    var regHeaderAlert = "";
    if (data["Company"] === "RE Garrison") {
      regHeaderAlert = `
        <tr>
          <th colspan="2"
              style="border: 1px solid #000; padding: 8px;
                     background-color: #fff3cd;
                     color: #b10000; font-weight: 800; text-align: center;">
            Please Send All Invoices To
            <a href="mailto:Roadside@regarrison.com" style="color:#b10000; text-decoration: underline;">
              Roadside@regarrison.com
            </a>
          </th>
        </tr>
      `;
    }

    var tableHtml = `
      <table style="width:100%; border-collapse: collapse;">
        <thead style="background-color: #d3d3de; color: #000;">
          <tr><th colspan="2" style="border: 1px solid #000; padding: 8px; text-align: center;">${subjectLine}</th></tr>
          ${regHeaderAlert}
        </thead>
        <tbody>
          <tr>
            <td style="border: 1px solid #000; padding: 8px; width: 35%; white-space: nowrap;">Date / Time</td>
            <td style="border: 1px solid #000; padding: 8px; width: 65%; word-break: break-word;">${dateString} - ${timeString}</td>
          </tr>
    `;

    Object.keys(data).forEach(function (key) {
      var displayKey = key === "driverType" ? "Driver Type" : key;
      var value = data[key];
      if (value.trim() !== "") {
        tableHtml += `
          <tr>
            <td style="border: 1px solid #000; padding: 8px; width: 35%; white-space: nowrap;">${displayKey}</td>
            <td style="border: 1px solid #000; padding: 8px; width: 65%; word-break: break-word;">${value}</td>
          </tr>
        `;
      }
    });

    tableHtml += `</tbody></table>`;

    // Append buttons
    tableHtml += `
      <div class="d-flex justify-content-between mt-3 mb-5">
        <button id="backToForm" type="button" class="btn btn-primary">Back</button>
        <div>
          <button id="newForm" type="button" class="btn btn-primary me-2">New Form</button>
          <button id="editTable" type="button" class="btn btn-primary me-2">Edit Table</button>
          <button id="copyTable" type="button" class="btn btn-primary">Copy Table</button>
        </div>
      </div>
    `;

    // Show report
    document.getElementById("roadCallForm").style.display = "none";
    var reportContainer = document.getElementById("report");
    reportContainer.innerHTML = tableHtml;
    reportContainer.style.display = "block";
    reportContainer.scrollIntoView({ behavior: "smooth", block: "center" });

    document.getElementById("backToForm").addEventListener("click", function () {
      reportContainer.style.display = "none";
      document.getElementById("roadCallForm").style.display = "block";
      showStep(currentStep);
      updateBigMFlagBanner(); // re-show banner if applicable
    });

    document.getElementById("copyTable").addEventListener("click", function () {
      var tableElement = reportContainer.querySelector("table");
      if (tableElement) {
        var clonedTable = tableElement.cloneNode(true);
        clonedTable.style.width = "75%";
        clonedTable.style.margin = "0";
        const blob = new Blob([clonedTable.outerHTML], { type: "text/html" });
        const clipboardItem = new ClipboardItem({ "text/html": blob });
        navigator.clipboard.write([clipboardItem]).then(() => alert("Table copied to clipboard!"))
          .catch(err => alert("Error copying table: " + err));
      }
    });

    let isEditing = false;
    const editBtn = document.getElementById("editTable");
    const reportTbl = reportContainer.querySelector("table");
    editBtn.addEventListener("click", () => {
      isEditing = !isEditing;
      reportTbl.contentEditable = isEditing;
      editBtn.textContent = isEditing ? "Save Table" : "Edit Table";
      if (isEditing) reportTbl.focus();
    });

    document.getElementById("newForm").addEventListener("click", function () {
      var form = document.getElementById("roadCallForm");
      form.reset();
      fedexDetails.style.display = "none";
      loadNumberSection.style.display = "none";
      tireQuestions.style.display = "none";
      damageDetails.classList.add("d-none");
      driverTypeSection.style.display = "none";
      if (otherCompanyContainer) otherCompanyContainer.style.display = "none";
      bigMFlagBanner.classList.add("d-none");
      form.style.display = "block";
      reportContainer.style.display = "none";
      currentStep = 1;
      showStep(currentStep);
    });
  });
});
