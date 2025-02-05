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
      e.preventDefault(); // Prevent actual form submission
  
      // Create a FormData object to gather all values
      var formData = new FormData(this);
      
      // Build the table HTML
      var tableHtml = '<table class="table table-bordered">';
      tableHtml += '<thead><tr><th>Field</th><th>Answer</th></tr></thead>';
      tableHtml += '<tbody>';
      
      // Loop over the FormData entries and add rows for fields with values
      formData.forEach(function(value, key) {
        if (value.trim() !== "") {
          tableHtml += '<tr><td>' + key + '</td><td>' + value + '</td></tr>';
        }
      });
      
      tableHtml += '</tbody></table>';
      
      // Insert the table into the report container and make it visible
      var reportContainer = document.getElementById('report');
      reportContainer.innerHTML = tableHtml;
      reportContainer.style.display = 'block';
      
      // Optionally, scroll the report container into view
      reportContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  });
  