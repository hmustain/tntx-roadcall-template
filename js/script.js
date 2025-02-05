// Helper function: Show a dynamic section and (optionally) scroll it into view
function showSection(sectionElement) {
    sectionElement.style.display = 'block';
    sectionElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  
  document.addEventListener("DOMContentLoaded", function () {
    // Multi-step navigation variables
    var currentStep = 1;
    var steps = document.querySelectorAll(".form-step");
    var totalSteps = steps.length;
  
    // Function to show a given step and scroll it into view (centered)
    function showStep(step) {
      steps.forEach(function (el) {
        el.style.display = 'none';
      });
      var stepElement = document.getElementById('step-' + step);
      stepElement.style.display = 'block';
      stepElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
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
  
    // Dynamic section: FedEx details (Step 1)
    var companySelect = document.getElementById("company");
    var fedexDetails = document.getElementById("fedexDetails");
  
    companySelect.addEventListener("change", function () {
      if (this.value === "fedex") {
        showSection(fedexDetails);
      } else {
        fedexDetails.style.display = "none";
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
      
      // Build the table HTML using Bootstrap markup
      var tableHtml = `
        <table class="table">
          <thead>
            <tr>
              <th scope="col">Field</th>
              <th scope="col">Answer</th>
            </tr>
          </thead>
          <tbody>
      `;
      
      // Loop through the FormData entries
      formData.forEach(function(value, key) {
        if (value.trim() !== "") {
          tableHtml += `
            <tr>
              <td>${key}</td>
              <td>${value}</td>
            </tr>
          `;
        }
      });
      
      tableHtml += `
          </tbody>
        </table>
      `;
      
      // Append buttons for "New Form" and "Copy Table"
      tableHtml += `
        <div class="d-flex justify-content-end mt-3">
          <button id="newForm" type="button" class="btn btn-secondary me-2">New Form</button>
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
      
      // Attach event listener to the "Copy Table" button
      document.getElementById('copyTable').addEventListener('click', function() {
        var reportContainer = document.getElementById('report');
        var tableElement = reportContainer.querySelector('table');
        if (tableElement) {
          // Build a plain-text version of the table
          var plainText = '';
          var rows = tableElement.querySelectorAll('tr');
          rows.forEach(function(row) {
            var cells = row.querySelectorAll('th, td');
            var rowText = Array.from(cells)
                               .map(function(cell) {
                                 return cell.innerText.trim();
                               })
                               .join('\t');
            plainText += rowText + '\n';
          });
          
          navigator.clipboard.writeText(plainText)
            .then(function() {
              alert("Table copied to clipboard as plain text!");
            })
            .catch(function(err) {
              alert("Error copying table: " + err);
            });
        }
      });
      
      
      // Attach event listener to the "New Form" button
      document.getElementById('newForm').addEventListener('click', function() {
        // Reset the form
        document.getElementById('roadCallForm').reset();
        // Show the form and hide the report container
        document.getElementById('roadCallForm').style.display = 'block';
        reportContainer.style.display = 'none';
        // Reset the multi-step navigation: set currentStep to 1 and show step 1
        currentStep = 1;
        showStep(currentStep);
      });
    });
    
      
  });
  