// static/js/main.js

(function () {
    // --- DOM Elements ---
    const transactionForm = document.getElementById('transactionForm');
    const amountInput = document.getElementById('amount');
    const categorySelect = document.getElementById('category');
    const customCategoryInput = document.getElementById('customCategory');
    const customCategoryContainer = document.getElementById('customCategoryContainer');
    const transactionList = document.getElementById('transactionList');
    const expenseChartCanvas = document.getElementById('expenseChart').getContext('2d');
    const alertMessage = document.getElementById('alertMessage');
  
    // --- Data ---
    let transactions = []; // Array to store transactions
    let expenseChart; // Chart instance
  
    // --- Functions ---
  
    // Function to display alerts
    function displayAlert(message, type = 'success') {
      alertMessage.textContent = message;
      alertMessage.classList.remove('d-none', 'alert-success', 'alert-danger');
      alertMessage.classList.add(`alert-${type}`);
      setTimeout(() => {
        alertMessage.classList.add('d-none');
      }, 3000);
    }
  
    // Function to format currency
    function formatCurrency(amount) {
      return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR'
      }).format(amount);
    }
  
    // Function to generate a unique ID
    function generateID() {
      return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }
  
    // Function to add a transaction
    function addTransaction(amount, category) {
      const transaction = {
        id: generateID(),
        amount: parseFloat(amount),
        category: category,
        date: new Date()
      };
      transactions.push(transaction);
      updateUI();
      displayAlert('Transaction added successfully', 'success');
    }
  
    // Function to delete a transaction
    function deleteTransaction(id) {
      transactions = transactions.filter(transaction => transaction.id !== id);
      updateUI();
      displayAlert('Transaction deleted successfully', 'success');
    }
  
    // Function to create transaction list item
    function createTransactionItem(transaction) {
      const listItem = document.createElement('div');
      listItem.classList.add('card', 'p-3', 'shadow-sm');
      listItem.innerHTML = `
            <div class="d-flex justify-content-between align-items-center">
                <div>
                    <h4 class="mb-1">${transaction.category}</h4>
                    <small class="text-muted">${transaction.date.toLocaleDateString()}</small>
                </div>
                <div class="d-flex align-items-center">
                    <span class="me-3">${formatCurrency(transaction.amount)}</span>
                    <button class="btn btn-sm btn-outline-danger delete-btn" data-id="${transaction.id}">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            </div>
        `;
      listItem.querySelector('.delete-btn').addEventListener('click', () => deleteTransaction(transaction.id));
      return listItem;
    }
  
    // Function to update the UI
    function updateUI() {
      // Clear transaction list
      transactionList.innerHTML = '';
  
      // Sort transactions by date (newest first)
      transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
  
      // Render transaction items
      transactions.forEach(transaction => {
        const item = createTransactionItem(transaction);
        transactionList.appendChild(item);
      });
  
      // Update expense chart
      updateExpenseChart();
    }
  
    // Function to prepare data for the expense chart
    function getExpenseData() {
      const categoryAmounts = {};
      transactions.forEach(transaction => {
        const category = transaction.category;
        categoryAmounts[category] = (categoryAmounts[category] || 0) + transaction.amount;
      });
  
      const labels = Object.keys(categoryAmounts);
      const data = Object.values(categoryAmounts);
      return {
        labels: labels,
        data: data
      };
    }
  
    // Function to update the expense chart
    function updateExpenseChart() {
      const expenseData = getExpenseData();
  
      // Destroy existing chart if it exists
      if (expenseChart) {
        expenseChart.destroy();
      }
  
      // Create new chart
      expenseChart = new Chart(expenseChartCanvas, {
        type: 'pie',
        data: {
          labels: expenseData.labels,
          datasets: [{
            data: expenseData.data,
            backgroundColor: [
              'rgba(255, 99, 132, 0.7)',
              'rgba(54, 162, 235, 0.7)',
              'rgba(255, 206, 86, 0.7)',
              'rgba(75, 192, 192, 0.7)',
              'rgba(153, 102, 255, 0.7)',
              'rgba(255, 159, 64, 0.7)'
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
            },
            title: {
              display: true,
              text: 'Expenses by Category'
            }
          }
        }
      });
    }
  
    // --- Event Listeners ---
  
    // Form submission
    transactionForm.addEventListener('submit', function (e) {
      e.preventDefault();
  
      // Validate form
      if (transactionForm.checkValidity() === false) {
        e.stopPropagation();
        transactionForm.classList.add('was-validated');
        return;
      }
  
      const amount = amountInput.value;
      let category = categorySelect.value;
  
      if (category === 'Custom') {
        category = customCategoryInput.value;
      }
  
      addTransaction(amount, category);
  
      // Clear form inputs
      amountInput.value = '';
      categorySelect.value = '';
      customCategoryInput.value = '';
      customCategoryContainer.classList.add('d-none');
      customCategoryInput.removeAttribute('required');
      transactionForm.classList.remove('was-validated');
    });
  
    // Category select change
    categorySelect.addEventListener('change', function () {
      if (this.value === 'Custom') {
        customCategoryContainer.classList.remove('d-none');
        customCategoryInput.setAttribute('required', 'required');
      } else {
        customCategoryContainer.classList.add('d-none');
        customCategoryInput.removeAttribute('required');
      }
    });
  
    // --- Initialization ---
    updateUI();
  })();
  