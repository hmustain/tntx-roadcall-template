// Helper function: Show a dynamic section and (optionally) scroll it into view
function showSection(sectionElement) {
  sectionElement.style.display = "block";
  sectionElement.scrollIntoView({ behavior: "smooth", block: "start" });
}

document.addEventListener("DOMContentLoaded", function () {
  // Multi-step navigation variables
  var currentStep = 1;
  var steps = document.querySelectorAll(".form-step");
  var totalSteps = steps.length;

  // Function to show a given step and scroll it into view (centered)
  function showStep(step) {
    steps.forEach(function (el) {
      el.style.display = "none";
    });
    var stepElement = document.getElementById("step-" + step);
    stepElement.style.display = "block";
    stepElement.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  // Next-step buttons
  document.querySelectorAll(".next-step").forEach(function (button) {
    button.addEventListener("click", function () {
      if (currentStep < totalSteps) {
        currentStep++;
        showStep(currentStep);
      }
    });
  });

  // Previous-step buttons
  document.querySelectorAll(".prev-step").forEach(function (button) {
    button.addEventListener("click", function () {
      if (currentStep > 1) {
        currentStep--;
        showStep(currentStep);
      }
    });
  });

  // Initially display the first step
  showStep(currentStep);

  // Dynamic section: FedEx/Other Company details (Step 1)
  var companySelect = document.getElementById("company");
  var fedexDetails = document.getElementById("fedexDetails");
  var otherCompanyContainer = document.getElementById("otherCompanyContainer");

  companySelect.addEventListener("change", function () {
    if (this.value === "FedEx") {
      showSection(fedexDetails);
    } else if (this.value === "Other") {
      showSection(otherCompanyContainer);
    }
  });

  // Dynamic section: Load number if trailer is loaded (Step 5)
  var loadStatusSelect = document.getElementById("loadStatus");
  var loadNumberSection = document.getElementById("loadNumberSection");

  loadStatusSelect.addEventListener("change", function () {
    if (this.value === "loaded") {
      showSection(loadNumberSection);
    } else {
      loadNumberSection.style.display = "none";
    }
  });

  // Dynamic section: Tire-related questions (Step 7)
  var tireBreakdownSelect = document.getElementById("tireBreakdown");
  var tireQuestions = document.getElementById("tireQuestions");

  tireBreakdownSelect.addEventListener("change", function () {
    if (this.value === "yes") {
      showSection(tireQuestions);
    } else {
      tireQuestions.style.display = "none";
    }
  });

  // Dynamic section: Damage details (inside tire questions)
  var damageSelect = document.getElementById("damage");
  var damageDetails = document.getElementById("damageDetails");

  damageSelect.addEventListener("change", function () {
    if (this.value === "yes") {
      damageDetails.classList.remove("d-none");
    } else {
      damageDetails.classList.add("d-none");
    }
  });

  // NEW: Generate Report on form submission
  document.getElementById('roadCallForm').addEventListener('submit', function(e) {
    e.preventDefault(); // Prevent actual submission

    // Gather form data
    var formData = new FormData(this);

    // Convert FormData to an object for easier manipulation
    var data = {};
    formData.forEach(function(value, key) {
      data[key] = value;
    });

    // If the user selected "Other" for Company, replace it with the value entered in "Other Company"
    if (data["Company"] === "Other") {
      data["Company"] = data["Other Company"] || "Other";
      // Optionally remove the "Other Company" field so it doesn't show up as its own row
      delete data["Other Company"];
    }

    // Get the current date and time (formatted as before)
    var now = new Date();
    var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var monthAbbrev = monthNames[now.getMonth()];
    var day = String(now.getDate()).padStart(2, '0');
    var hours24 = now.getHours();
    var ampm = hours24 >= 12 ? 'PM' : 'AM';
    var hours12 = hours24 % 12;
    if (hours12 === 0) { 
      hours12 = 12; 
    }
    var minutes = String(now.getMinutes()).padStart(2, '0');
    var dateString = monthAbbrev + " " + day;
    var timeString = hours12 + ":" + minutes + " " + ampm;

    // Build the table HTML with inline styles for formatting
    var tableHtml = `
      <table style="width:100%; border-collapse: collapse;">
        <thead style="background-color: #343a40; color: #fff;">
          <tr>
            <th scope="col" style="border: 1px solid #000; padding: 8px;">Field</th>
            <th scope="col" style="border: 1px solid #000; padding: 8px;">Answer</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="border: 1px solid #000; padding: 8px;">Date / Time</td>
            <td style="border: 1px solid #000; padding: 8px;">${dateString} - ${timeString}</td>
          </tr>
    `;

    // Loop through the data object and add rows for each field
    Object.keys(data).forEach(function(key) {
      var value = data[key];
      if (value.trim() !== "") {
        tableHtml += `
          <tr>
            <td style="border: 1px solid #000; padding: 8px;">${key}</td>
            <td style="border: 1px solid #000; padding: 8px;">${value}</td>
          </tr>
        `;
      }
    });

    tableHtml += `
        </tbody>
      </table>
    `;

    // Append the buttons for "New Form" and "Copy Table"
    tableHtml += `
      <div class="d-flex justify-content-end mt-3">
        <button id="newForm" type="button" class="btn btn-primary me-2">New Form</button>
        <button id="copyTable" type="button" class="btn btn-primary">Copy Table</button>
      </div>
    `;

    // Hide the form
    document.getElementById('roadCallForm').style.display = 'none';

    // Insert the table (with buttons) into the report container and display it
    var reportContainer = document.getElementById('report');
    reportContainer.innerHTML = tableHtml;
    reportContainer.style.display = 'block';

    // Optionally scroll the report container into view
    reportContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });

    document.getElementById('copyTable').addEventListener('click', function() {
      var reportContainer = document.getElementById('report');
      var tableElement = reportContainer.querySelector('table');
      if (tableElement) {
        // Clone the table so we don't modify the original displayed table
        var clonedTable = tableElement.cloneNode(true);
        // Update the inline style for the cloned table to have a width of 50% and center it
        clonedTable.style.width = '75%';
        clonedTable.style.margin = '0';
        
        // Copy the cloned table's outerHTML as HTML using the Clipboard API
        const blob = new Blob([clonedTable.outerHTML], { type: 'text/html' });
        const clipboardItem = new ClipboardItem({ 'text/html': blob });
        navigator.clipboard.write([clipboardItem])
          .then(() => {
            alert("Table copied to clipboard!");
          })
          .catch(err => {
            alert("Error copying table: " + err);
          });
      }
    });    

    // Attach event listener to the "New Form" button (only here)
    document.getElementById('newForm').addEventListener('click', function() {
      var form = document.getElementById('roadCallForm');

      // Reset all form fields.
      form.reset();

      // Hide dynamic sections.
      document.getElementById('fedexDetails').style.display = 'none';
      document.getElementById('loadNumberSection').style.display = 'none';
      document.getElementById('tireQuestions').style.display = 'none';
      document.getElementById('damageDetails').classList.add('d-none');

      // Hide the "Other Company" container.
      var otherCompanyContainer = document.getElementById('otherCompanyContainer');
      if (otherCompanyContainer) {
        otherCompanyContainer.style.display = 'none';
      }

      // Show the form and hide the report container.
      form.style.display = 'block';
      reportContainer.style.display = 'none';

      // Reset the multi-step navigation: set currentStep to 1 and show step 1.
      currentStep = 1;
      showStep(currentStep);
    });
  });
});
