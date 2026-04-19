// --- Navigation ---
function navigate(viewId) {
    document.querySelectorAll('.view').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.nav-links li').forEach(el => el.classList.remove('active'));
    
    document.getElementById(`view-${viewId}`).classList.add('active');
    
    const navItem = document.querySelector(`.nav-links li[data-view="${viewId}"]`);
    if(navItem) navItem.classList.add('active');
}

document.querySelectorAll('.nav-links li').forEach(li => {
    li.addEventListener('click', () => {
        navigate(li.getAttribute('data-view'));
    });
});

// --- Calculator Logic ---
let calcExpression = '';
const calcDisplay = document.getElementById('calc-display');

function calcAction(val) {
    if (val === 'clear') {
        calcExpression = '';
        calcDisplay.value = '0';
    } else if (val === 'back') {
        calcExpression = calcExpression.slice(0, -1);
        calcDisplay.value = calcExpression || '0';
    } else if (val === '=') {
        try {
            // Evaluates simple arithmetic
            calcExpression = eval(calcExpression).toString();
            calcDisplay.value = calcExpression;
        } catch {
            calcDisplay.value = 'Error';
            calcExpression = '';
        }
    } else {
        calcExpression += val;
        calcDisplay.value = calcExpression;
    }
}

// --- Timer Logic ---
let timerInterval;
let timerSeconds = 0;
const timerDisplay = document.getElementById('timer-display');
const timerInput = document.getElementById('timer-input');

function formatTime(totalSeconds) {
    const h = Math.floor(totalSeconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
    const s = (totalSeconds % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
}

function startTimer() {
    if (timerInterval) clearInterval(timerInterval);
    if (timerSeconds <= 0) {
        timerSeconds = parseInt(timerInput.value || 0) * 60;
    }
    
    timerDisplay.textContent = formatTime(timerSeconds);
    
    timerInterval = setInterval(() => {
        if (timerSeconds > 0) {
            timerSeconds--;
            timerDisplay.textContent = formatTime(timerSeconds);
        } else {
            clearInterval(timerInterval);
            alert("Timer completed!");
        }
    }, 1000);
}

function pauseTimer() {
    clearInterval(timerInterval);
}

function resetTimer() {
    clearInterval(timerInterval);
    timerSeconds = 0;
    timerDisplay.textContent = "00:00:00";
}

// --- Notes Logic (Using LocalStorage) ---
let notes = JSON.parse(localStorage.getItem('offline-notes')) || [];

function renderNotes() {
    const list = document.getElementById('notes-list');
    list.innerHTML = '';
    
    notes.forEach((note, index) => {
        const div = document.createElement('div');
        div.className = 'note-item';
        div.innerHTML = `<h4>${note.title || 'Untitled'}</h4><p style="color:var(--muted); font-size:0.8rem; margin-top:4px;">${note.content.substring(0, 30)}...</p>`;
        div.onclick = () => loadNote(index);
        list.appendChild(div);
    });
}

function saveNote() {
    const title = document.getElementById('note-title').value;
    const content = document.getElementById('note-content').value;
    
    if(!content && !title) return;
    
    notes.unshift({ title, content, date: new Date().toISOString() });
    localStorage.setItem('offline-notes', JSON.stringify(notes));
    renderNotes();
    
    document.getElementById('note-title').value = '';
    document.getElementById('note-content').value = '';
}

function loadNote(index) {
    const note = notes[index];
    document.getElementById('note-title').value = note.title;
    document.getElementById('note-content').value = note.content;
    
    // Remove it from array to resave it on top when clicking save
    notes.splice(index, 1);
}

// Init
renderNotes();

// --- Budget Logic ---
let transactions = JSON.parse(localStorage.getItem('offline-budget')) || [];
let savingsGoal = parseFloat(localStorage.getItem('offline-budget-goal')) || 0;
let editingTransactionIndex = -1;

function renderTransactions() {
    const list = document.getElementById('transactions-list');
    if(!list) return;
    list.innerHTML = '';
    
    let balance = 0;
    let income = 0;
    let expense = 0;
    let categoryExpenses = {};
    
    transactions.forEach((t, index) => {
        if (t.type === 'income') {
            balance += t.amount;
            income += t.amount;
        } else {
            balance -= t.amount;
            expense += t.amount;
            
            // Track categories
            categoryExpenses[t.category] = (categoryExpenses[t.category] || 0) + t.amount;
        }
        
        const div = document.createElement('div');
        div.className = 'transaction-item';
        div.innerHTML = `
            <div style="flex:1;">
                <div class="desc">${t.desc} <span class="category">${t.category || 'Other'}</span></div>
                <div class="date">${new Date(t.date).toLocaleDateString()}</div>
            </div>
            <div class="amount ${t.type}" style="white-space: nowrap;">${t.type === 'income' ? '+' : '-'}₹${t.amount.toLocaleString('en-IN')}</div>
            <div class="transaction-actions" style="display:flex; flex-direction:column; gap:8px; margin-left:16px;">
                <button onclick="editTransaction(${index})" style="background:none; border:none; color:var(--primary); cursor:pointer; font-size:12px; font-weight:bold; text-align:right;">Edit</button>
                <button onclick="deleteTransaction(${index})" style="background:none; border:none; color:#f43f5e; cursor:pointer; font-size:12px; font-weight:bold; text-align:right;">Delete</button>
            </div>
        `;
        list.appendChild(div);
    });
    
    let savings = income - expense;
    
    // Update top dashboard
    document.getElementById('budget-balance').textContent = `₹${balance.toLocaleString('en-IN')}`;
    document.getElementById('budget-income').textContent = `+₹${income.toLocaleString('en-IN')}`;
    document.getElementById('budget-expense').textContent = `-₹${expense.toLocaleString('en-IN')}`;
    document.getElementById('budget-savings').textContent = `₹${savings.toLocaleString('en-IN')}`;
    
    // Update goals
    document.getElementById('goal-text').textContent = savingsGoal > 0 ? `Target: ₹${savingsGoal.toLocaleString('en-IN')}` : 'No Goal Set';
    if(savingsGoal > 0) {
        let percent = Math.min(100, Math.max(0, (savings / savingsGoal) * 100));
        document.getElementById('goal-percent').textContent = `${percent.toFixed(1)}%`;
        document.getElementById('goal-progress-fill').style.width = `${percent}%`;
    } else {
        document.getElementById('goal-percent').textContent = `0%`;
        document.getElementById('goal-progress-fill').style.width = `0%`;
    }
    
    // Update top category
    let topCat = "No data yet";
    let maxExp = 0;
    for(const cat in categoryExpenses) {
        if(categoryExpenses[cat] > maxExp) {
            maxExp = categoryExpenses[cat];
            topCat = `${cat}: ₹${maxExp.toLocaleString('en-IN')}`;
        }
    }
    document.getElementById('top-category').textContent = topCat;
}

function addTransaction() {
    const desc = document.getElementById('trans-desc').value;
    const amount = parseFloat(document.getElementById('trans-amount').value);
    const type = document.getElementById('trans-type').value;
    const category = document.getElementById('trans-category').value;
    
    if(!desc || !amount || isNaN(amount)) return;
    
    if (editingTransactionIndex > -1) {
        transactions[editingTransactionIndex] = { desc, amount, type, category, date: transactions[editingTransactionIndex].date };
        editingTransactionIndex = -1;
        document.getElementById('btn-add-trans').innerText = "Add Transaction";
    } else {
        transactions.unshift({ desc, amount, type, category, date: new Date().toISOString() });
    }
    
    localStorage.setItem('offline-budget', JSON.stringify(transactions));
    
    document.getElementById('trans-desc').value = '';
    document.getElementById('trans-amount').value = '';
    
    renderTransactions();
}

function editTransaction(index) {
    const t = transactions[index];
    document.getElementById('trans-desc').value = t.desc;
    document.getElementById('trans-amount').value = t.amount;
    document.getElementById('trans-type').value = t.type;
    document.getElementById('trans-category').value = t.category || "Other";
    
    editingTransactionIndex = index;
    document.getElementById('btn-add-trans').innerText = "Update Transaction";
    document.getElementById('trans-desc').focus();
}

function deleteTransaction(index) {
    if(confirm("Are you sure you want to delete this transaction?")) {
        transactions.splice(index, 1);
        localStorage.setItem('offline-budget', JSON.stringify(transactions));
        renderTransactions();
    }
}

function setGoal() {
    const goal = prompt("Enter your new savings goal in ₹:");
    if(goal !== null && !isNaN(parseFloat(goal))) {
        savingsGoal = parseFloat(goal);
        localStorage.setItem('offline-budget-goal', savingsGoal);
        renderTransactions();
    }
}

renderTransactions();

// --- Tasks Logic ---
let tasks = JSON.parse(localStorage.getItem('offline-tasks')) || [];

function renderTasks() {
    const list = document.getElementById('task-list');
    if(!list) return;
    list.innerHTML = '';
    
    tasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.className = `task-item ${task.completed ? 'completed' : ''}`;
        li.innerHTML = `
            <div class="task-actions">
                <input type="checkbox" ${task.completed ? 'checked' : ''} onchange="toggleTask(${index})">
                <span>${task.text}</span>
            </div>
            <button class="delete-btn" onclick="deleteTask(${index})">×</button>
        `;
        list.appendChild(li);
    });
}

function addTask() {
    const input = document.getElementById('task-input');
    const text = input.value.trim();
    if(!text) return;
    
    tasks.push({ text, completed: false });
    saveTasks();
    input.value = '';
}

function toggleTask(index) {
    tasks[index].completed = !tasks[index].completed;
    saveTasks();
}

function deleteTask(index) {
    tasks.splice(index, 1);
    saveTasks();
}

function saveTasks() {
    localStorage.setItem('offline-tasks', JSON.stringify(tasks));
    renderTasks();
}

// --- Password Generator Logic ---
function generatePassword() {
    const length = document.getElementById('pw-length').value;
    const useUpper = document.getElementById('pw-uppercase').checked;
    const useNumbers = document.getElementById('pw-numbers').checked;
    const useSymbols = document.getElementById('pw-symbols').checked;
    
    let chars = "abcdefghijklmnopqrstuvwxyz";
    if(useUpper) chars += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if(useNumbers) chars += "0123456789";
    if(useSymbols) chars += "!@#$%^&*()_+~`|}{[]:;?><,./-=";
    
    let password = "";
    for(let i = 0; i < length; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    document.getElementById('generated-password').innerText = password;
}

function copyPassword() {
    const pw = document.getElementById('generated-password').innerText;
    if(pw === "Click Generate") return;
    
    navigator.clipboard.writeText(pw).then(() => {
        alert("Password copied to clipboard!");
    });
}

// Init calls
renderTasks();
