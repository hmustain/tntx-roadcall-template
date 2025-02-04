document.addEventListener('DOMContentLoaded', function () {
    // Multi-step navigation
    var currentStep = 1;
    var steps = document.querySelectorAll('.form-step');
    var totalSteps = steps.length;
  
    function showStep(step) {
      steps.forEach(function (el) {
        el.style.display = 'none';
      });
      document.getElementById('step-' + step).style.display = 'block';
    }
  
    document.querySelectorAll('.next-step').forEach(function (button) {
      button.addEventListener('click', function () {
        if (currentStep < totalSteps) {
          currentStep++;
          showStep(currentStep);
        }
      });
    });
  
    document.querySelectorAll('.prev-step').forEach(function (button) {
      button.addEventListener('click', function () {
        if (currentStep > 1) {
          currentStep--;
          showStep(currentStep);
        }
      });
    });
  
    // Initially display the first step
    showStep(currentStep);
  
    // Dynamic section: FedEx details (Step 1)
    var companySelect = document.getElementById('company');
    var fedexDetails = document.getElementById('fedexDetails');
    companySelect.addEventListener('change', function () {
      if (this.value === 'fedex') {
        fedexDetails.style.display = 'block';
      } else {
        fedexDetails.style.display = 'none';
      }
    });
  
    // Dynamic section: Load number if trailer is loaded (Step 5)
    var loadStatusSelect = document.getElementById('loadStatus');
    var loadNumberSection = document.getElementById('loadNumberSection');
    loadStatusSelect.addEventListener('change', function () {
      if (this.value === 'loaded') {
        loadNumberSection.style.display = 'block';
      } else {
        loadNumberSection.style.display = 'none';
      }
    });
  
    // Dynamic section: Tire-related questions (Step 7)
    var tireBreakdownSelect = document.getElementById('tireBreakdown');
    var tireQuestions = document.getElementById('tireQuestions');
    tireBreakdownSelect.addEventListener('change', function () {
      if (this.value === 'yes') {
        tireQuestions.style.display = 'block';
      } else {
        tireQuestions.style.display = 'none';
      }
    });
  
    // Dynamic section: Damage details (inside tire questions)
    var damageSelect = document.getElementById('damage');
    var damageDetails = document.getElementById('damageDetails');
    damageSelect.addEventListener('change', function () {
      if (this.value === 'yes') {
        damageDetails.classList.remove('d-none');
      } else {
        damageDetails.classList.add('d-none');
      }
    });
  });
  