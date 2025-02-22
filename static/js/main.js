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
function updateTransactionList() {
    const transactionListEl = document.getElementById('transactionList');
    let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    transactions = transactions.reverse();

    transactionListEl.innerHTML = transactions.length === 0 ? 
        '<p>No transactions yet.</p>' : 
        transactions.map(transaction => `
            <div class="card">
                <div class="card-body">
                    <h5 class="card-title">${transaction.category}</h5>
                    <p class="card-text">$${transaction.amount.toFixed(2)}</p>
                    <p class="card-text">
                        <small class="text-muted">
                            ${new Date(transaction.date).toLocaleString()}
                        </small>
                    </p>
                </div>
            </div>
        `).join('');
}
