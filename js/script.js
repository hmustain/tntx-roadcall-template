document.addEventListener('DOMContentLoaded', function () {
    // 1. Show/hide FedEx details based on company selection
    var companySelect = document.getElementById('company');
    var fedexDetails = document.getElementById('fedexDetails');
    companySelect.addEventListener('change', function () {
      if (this.value === 'fedex') {
        fedexDetails.style.display = 'block';
      } else {
        fedexDetails.style.display = 'none';
      }
    });
  
    // 2. Show/hide load number field if trailer is loaded
    var loadStatusSelect = document.getElementById('loadStatus');
    var loadNumberSection = document.getElementById('loadNumberSection');
    loadStatusSelect.addEventListener('change', function () {
      if (this.value === 'loaded') {
        loadNumberSection.style.display = 'block';
      } else {
        loadNumberSection.style.display = 'none';
      }
    });
  
    // 3. Show/hide tire-related questions
    var tireBreakdownSelect = document.getElementById('tireBreakdown');
    var tireQuestions = document.getElementById('tireQuestions');
    tireBreakdownSelect.addEventListener('change', function () {
      if (this.value === 'yes') {
        tireQuestions.style.display = 'block';
      } else {
        tireQuestions.style.display = 'none';
      }
    });
  
    // 4. Optionally, show damage details if damage is "yes"
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
  