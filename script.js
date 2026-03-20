let entries = {};

const qtyInput = document.getElementById('qty');
const rateInput = document.getElementById('rate');

// 1. Jump back to Qty if Backspace is pressed in an empty Rate field
rateInput.addEventListener('keydown', function(e) {
    if (e.key === 'Backspace' && rateInput.value === '') {
        qtyInput.focus();
    }
});

// 2. Process "Enter" to add to table
[qtyInput, rateInput].forEach(input => {
    input.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            const q = parseFloat(qtyInput.value);
            const r = parseFloat(rateInput.value);

            if (!isNaN(q) && !isNaN(r)) {
                if (entries[r]) {
                    entries[r].qty += q;
                } else {
                    entries[r] = { qty: q, isChecked: false };
                }
                // Reset and go back to Qty for next item
                qtyInput.value = '';
                rateInput.value = '';
                qtyInput.focus();
                render();
            }
        }
    });
});

function toggleCheck(rate) {
    entries[rate].isChecked = !entries[rate].isChecked;
    render();
}

function removeEntry(rate) {
    delete entries[rate];
    render();
}

function clearAll() {
    if(confirm("Clear everything?")) {
        entries = {};
        qtyInput.value = '';
        rateInput.value = '';
        render();
    }
}

function render() {
    const tableBody = document.getElementById('tableBody');
    const grandTotalDisplay = document.getElementById('grandTotal');
    const grandQtyDisplay = document.getElementById('grandQty');

    tableBody.innerHTML = '';
    let totalPrice = 0;
    let totalQty = 0;

    for (let r in entries) {
        const item = entries[r];
        const rowTotal = item.qty * parseFloat(r);
        totalPrice += rowTotal;
        totalQty += item.qty;

        const row = document.createElement('tr');
        if (item.isChecked) row.className = 'checked-row';

        row.innerHTML = `
            <td>${item.qty}</td>
            <td>${r}</td>
            <td>${rowTotal.toFixed(2)}</td>
            <td><div class="check-box" onclick="toggleCheck('${r}')"></div></td>
            <td><button class="del-btn" onclick="removeEntry('${r}')">Del</button></td>
        `;
        tableBody.appendChild(row);
    }

    grandQtyDisplay.innerText = totalQty;
    grandTotalDisplay.innerText = totalPrice.toFixed(2);
}