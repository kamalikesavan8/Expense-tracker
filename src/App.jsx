import { useReducer, useEffect,useState } from 'react';

import './index.css';

function App() {
  const reducer = (state, action) => {
    switch (action.type){
      case "ADD":
        return [...state,action.payload];
      case "DELETE":
        return state.filter(t => t.id !== action.payload);
      case "CLEAR":
        return [];
      default:
        return state;
    }

  };
  const[transactions, dispatch] = useReducer(reducer,[], ()=>{
    const saved = localStorage.getItem("transactions");
    return saved ? JSON.parse(saved) : [];
  });
  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(transactions));
  }, [transactions]);

  const[text, setText] = useState("");
  const[amount, setAmount] = useState("");
  const[category, setCategory] = useState("Food");
  const[filter,setFilter] = useState("All");

  const amounts = transactions.map(t=>t.amount);
  
  const balance = amounts.reduce((acc, item) => acc+item,0);

  const income = amounts.filter(item => item>0).reduce((acc, item) => acc+item,0);

  const expense = amounts.filter(item => item<0).reduce((acc, item) => acc+item,0);

  const handleAddTransaction = () => {
    if(!text.trim() || isNaN(amount) || +amount==0) {
      alert("Please enter valid text and amount");
      return;
    }
    const newTransaction = {
      id: Date.now(),
      text,
      amount: +amount,
      category
    };
    dispatch({type: "ADD", payload: newTransaction});
    setText("");
    setAmount("");
  };
  const handleDeleteTransaction = (id) => {
    dispatch({type: "DELETE", payload: id});
  }
  const filteredTransactions = transactions.filter((t)=>{
    if(filter === "All") return true;
    else if(filter === "Income") return t.amount > 0;
    else if(filter === "Expense") return t.amount < 0;
    return true;
  })
  const categoryIcons = {
  Food: "🍔",
  Salary: "💰",
  Travel: "✈️",
  Entertainment: "🎬",
  Shopping: "🛍️",
  Other: "📦"
};

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6">
        
        {/* Title */}
        <h1 className="text-2xl font-bold text-center mb-6">
          Expense Tracker
        </h1>

        {/* Balance */}
        <div className="bg-blue-500 text-white p-4 rounded-xl text-center mb-6">
          <p className="text-sm">Your Balance</p>
          <h2 className="text-2xl font-bold">₹{balance}</h2>
        </div>

        {/* Income & Expense */}
        <div className="flex justify-between gap-4 mb-6">
          <div className="flex-1 bg-green-100 p-4 rounded-xl text-center">
            <p className="text-sm text-gray-600">Income</p>
            <h3 className="text-green-600 font-bold">₹{income}</h3>
          </div>

          <div className="flex-1 bg-red-100 p-4 rounded-xl text-center">
            <p className="text-sm text-gray-600">Expense</p>
            <h3 className="text-red-600 font-bold">₹{Math.abs(expense)}</h3>
          </div>
        </div>

        {/* Form */}
        <div className="mb-6">
          <h3 className="font-semibold mb-2">Add Transaction</h3>

          <input
            type="text"
            placeholder="Enter description"
            className="w-full p-2 border rounded-lg mb-2"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />

          <input
            type="number"
            placeholder="Enter amount"
            className="w-full p-2 border rounded-lg mb-2"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />

          <select
            className="w-full p-2 border rounded-lg mb-2"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="Food">🍔 Food</option>
            <option value="Salary">💰 Salary</option>
            <option value="Travel">✈️ Travel</option>
            <option value="Entertainment">🎬 Entertainment</option>
            <option value="Shopping">🛍️ Shopping</option>
            <option value="Other">📦 Other</option>
          </select> 
          

          <button onClick={handleAddTransaction} className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600">
            Add Transaction
          </button>
        </div>
        
        {filteredTransactions.length === 0 && (
          <p className="text-center text-gray-500">No transactions yet.</p>
        )}

        <div className="flex justify-between mb-4">
          <button onClick={() => setFilter("All")} className={filter==="All"?"font-bold underline":""}>All</button>
          <button onClick={() => setFilter("Income")} className={filter==="Income"?"font-bold underline":""}>Income</button>
          <button onClick={() => setFilter("Expense")} className={filter==="Expense"?"font-bold underline":""}>Expense</button>
        </div>

        

        {/* Transaction List */}
        {filteredTransactions.map((t) => (
          <div key={t.id} className="flex justify-between bg-gray-100 p-2 rounded-lg mb-2 hover:scale-105 transition">
            <span>
              {categoryIcons[t.category]} {t.text} 
            </span>
            <div className ="flex gap-2 items-center">
            <span className={t.amount >0 ? "text-green-500" : "text-red-500"}>
              {t.amount > 0 ? "+" : "-"}₹{Math.abs(t.amount)}
            </span>
            <button onClick={() => handleDeleteTransaction(t.id)} className="text-red-500 font-bold">
              ✕
              </button>
              </div>
          </div>
            ))
            }
            <button onClick={() => dispatch({type: "CLEAR"})} className="w-full bg-red-500 text-white py-2 rounded-lg mt-4">
            Clear All Transactions
          </button> 

      </div>
    </div>
  );
}

export default App;

