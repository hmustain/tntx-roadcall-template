// Helper function: Show a dynamic section and (optionally) scroll it into view
function showSection(sectionElement) {
  sectionElement.style.display = "block";
  // sectionElement.scrollIntoView({ behavior: "smooth", block: "start" });
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
      // Ensure the Other Company container is hidden
      otherCompanyContainer.style.display = "none";
    } else if (this.value === "Other") {
      showSection(otherCompanyContainer);
      // Ensure the FedEx details are hidden
      fedexDetails.style.display = "none";
    } else {
      // For any other company, hide both extra sections
      fedexDetails.style.display = "none";
      otherCompanyContainer.style.display = "none";
    }
  });

  // Dynamic section: Load number and weight if trailer is loaded (Step 5)
  var loadStatusSelect = document.getElementById("loadStatus");
  var loadNumberSection = document.getElementById("loadNumberSection");
  var weightSection = document.getElementById("weightSection");

  loadStatusSelect.addEventListener("change", function () {
    if (this.value === "loaded") {
      showSection(loadNumberSection);
      showSection(weightSection);
    } else {
      loadNumberSection.style.display = "none";
      weightSection.style.display = "none";
    }
  });

  // Event Listener for rewrite with AI Button to call on OpenAI API
  document
    .getElementById("rewriteBtn")
    .addEventListener("click", async function () {
      const descriptionField = document.getElementById("breakdownDesc");
      const originalText = descriptionField.value.trim();

      if (!originalText) {
        alert("Please enter a description first.");
        return;
      }

      // Disable the button and show loading state
      this.disabled = true;
      const originalButtonHTML = this.innerHTML; // fixed variable name
      this.innerHTML = "Rewriting...";

      try {
        const response = await fetch("/rewrite", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text: originalText }),
        });
        if (response.ok) {
          const data = await response.json();
          descriptionField.value = data.rewrittenText;
        } else {
          const errorText = await response.text();
          console.error("Error Response:", errorText);
          alert("Error rewriting text: " + response.statusText);
        }
      } catch (error) {
        console.error("Error calling /rewrite endpoint:", error);
        alert("An error occurred while rewriting the text.");
      } finally {
        this.disabled = false;
        this.innerHTML = originalButtonHTML;
      }
    });

  // Dynamic section: Tire-related questions (Step 8)
  var tireBreakdownSelect = document.getElementById("tireBreakdown");
  var tireQuestions = document.getElementById("tireQuestions");

  tireBreakdownSelect.addEventListener("change", function () {
    if (this.value === "yes") {
      showSection(tireQuestions);
      // After showing the tire-related questions, scroll Step 8 so its bottom is visible.
      setTimeout(function () {
        document
          .getElementById("step-8")
          .scrollIntoView({ behavior: "smooth", block: "end" });
      }, 100);
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
  document
    .getElementById("roadCallForm")
    .addEventListener("submit", function (e) {
      e.preventDefault(); // Prevent actual submission

      // Gather form data
      var formData = new FormData(this);

      // Convert FormData to an object for easier manipulation
      var data = {};
      formData.forEach(function (value, key) {
        data[key] = value;
      });

      // Handle the "Other" company case (if applicable)
      if (data["Company"] === "Other") {
        data["Company"] = data["Other Company"] || "Other";
        delete data["Other Company"];
      }

      // Determine unit type and unit number based on Unit Affected
      var unitType = "";
      var unitNumber = "";
      if (data["Unit Affected"]) {
        if (data["Unit Affected"].toLowerCase() === "tractor") {
          unitType = "TRK";
          unitNumber = data["Truck Number"] || "";
        } else if (data["Unit Affected"].toLowerCase() === "trailer") {
          unitType = "TRL";
          unitNumber = data["Trailer Number"] || "";
        }
      }

      // Build the subject line using keys:
      // "RC# Company UnitType UnitNumber Complaint City, State"
      var subjectLine = "";
      if (data["RC #?"]) {
        subjectLine += "RC" + data["RC #?"] + " - ";
      }
      if (data["Company"]) {
        subjectLine += data["Company"];
        if (unitType) {
          subjectLine += " " + unitType;
        }
        if (unitNumber) {
          subjectLine += " " + unitNumber;
        }
        subjectLine += " - ";
      }
      if (data["Complaint"]) {
        subjectLine += data["Complaint"] + " - ";
      }
      if (data["City"] && data["State"]) {
        subjectLine += data["City"] + ", " + data["State"];
      }

      // Get the current date and time (formatted as before)
      var now = new Date();
      var monthNames = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      var monthAbbrev = monthNames[now.getMonth()];
      var day = String(now.getDate()).padStart(2, "0");
      var hours24 = now.getHours();
      var ampm = hours24 >= 12 ? "PM" : "AM";
      var hours12 = hours24 % 12;
      if (hours12 === 0) {
        hours12 = 12;
      }
      var minutes = String(now.getMinutes()).padStart(2, "0");
      var dateString = monthAbbrev + " " + day;
      var timeString = hours12 + ":" + minutes + " " + ampm;

      // Build the table HTML with inline styles for formatting.
      // Here, we merge the header cell (colspan="2") to display the subject line.
      var tableHtml = `
      <table style="width:100%; border-collapse: collapse;">
        <thead style="background-color: #d3d3de; color: #000;">
          <tr>
            <th colspan="2" style="border: 1px solid #000; padding: 8px; text-align: center;">
              ${subjectLine}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="border: 1px solid #000; padding: 8px; width: 35%; white-space: nowrap;">Date / Time</td>
            <td style="border: 1px solid #000; padding: 8px; width: 65%; white-space: normal; word-break: break-word;">${dateString} - ${timeString}</td>
          </tr>
    `;

      // Loop through the data object and add rows for each field with proper styling
      Object.keys(data).forEach(function (key) {
        var value = data[key];
        if (value.trim() !== "") {
          tableHtml += `
          <tr>
            <td style="border: 1px solid #000; padding: 8px; width: 35%; white-space: nowrap;">${key}</td>
            <td style="border: 1px solid #000; padding: 8px; width: 65%; white-space: normal; word-break: break-word;">${value}</td>
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
      <div class="d-flex justify-content-end mt-3 mb-5">
        <button id="newForm" type="button" class="btn btn-primary me-2">New Form</button>
        <button id="copyTable" type="button" class="btn btn-primary">Copy Table</button>
      </div>
    `;

      // Hide the form and display the report
      document.getElementById("roadCallForm").style.display = "none";
      var reportContainer = document.getElementById("report");
      reportContainer.innerHTML = tableHtml;
      reportContainer.style.display = "block";
      reportContainer.scrollIntoView({ behavior: "smooth", block: "center" });

      // Attach event listener to the "Copy Table" button
      document
        .getElementById("copyTable")
        .addEventListener("click", function () {
          var tableElement = reportContainer.querySelector("table");
          if (tableElement) {
            // Clone the table to modify its style without affecting the original
            var clonedTable = tableElement.cloneNode(true);
            // Set the width to 75% (instead of 100%) for the copied version
            clonedTable.style.width = "75%";
            // Optionally, if you want it left-justified, ensure margin is 0 (or adjust as needed)
            clonedTable.style.margin = "0";

            // Create a Blob with the cloned table's outerHTML
            const blob = new Blob([clonedTable.outerHTML], {
              type: "text/html",
            });
            const clipboardItem = new ClipboardItem({ "text/html": blob });

            navigator.clipboard
              .write([clipboardItem])
              .then(() => {
                alert("Table copied to clipboard!");
              })
              .catch((err) => {
                alert("Error copying table: " + err);
              });
          }
        });

      // Attach event listener to the "New Form" button (inside the submission handler)
      document.getElementById("newForm").addEventListener("click", function () {
        var form = document.getElementById("roadCallForm");
        form.reset();
        document.getElementById("fedexDetails").style.display = "none";
        document.getElementById("loadNumberSection").style.display = "none";
        document.getElementById("tireQuestions").style.display = "none";
        document.getElementById("damageDetails").classList.add("d-none");
        if (otherCompanyContainer) {
          otherCompanyContainer.style.display = "none";
        }
        form.style.display = "block";
        reportContainer.style.display = "none";
        currentStep = 1;
        showStep(currentStep);
      });
    });
});
