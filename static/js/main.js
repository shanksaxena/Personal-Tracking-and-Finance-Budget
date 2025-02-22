// Initial JavaScript setup with localStorage functionality
document.addEventListener("DOMContentLoaded", function () {
    updateTransactionList();
    updateChart();

    document.getElementById('transactionForm').addEventListener('submit', function (e) {
        e.preventDefault();
        addTransaction();
    });
});

function addTransaction() {
    const amount = parseFloat(document.getElementById('amount').value);
    const category = document.getElementById('category').value;
    const date = new Date().toISOString();

    if (!isNaN(amount) && category) {
        const transaction = { amount, category, date };
        let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
        transactions.push(transaction);
        localStorage.setItem('transactions', JSON.stringify(transactions));

        document.getElementById('amount').value = '';
        document.getElementById('category').value = '';

        updateTransactionList();
        updateChart();
    }
}
