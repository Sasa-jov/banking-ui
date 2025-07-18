import React, { useState, useEffect } from 'react';
import { Account } from './types';
import AccountForm from './components/AccountForm';
import AccountList from './components/AccountList';
import TransactionForm from './components/TransactionForm';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

function App() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const response = await fetch(`${API_URL}/accounts`);
      const data = await response.json();
      setAccounts(data);
    } catch (error) {
      showMessage('Failed to fetch accounts', 'error');
    }
  };

  const showMessage = (text: string, type: 'success' | 'error') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleCreateAccount = async (owner: string, initialDeposit: number) => {
    try {
      const response = await fetch(`${API_URL}/accounts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ owner, initialDeposit }),
      });
      const newAccount = await response.json();
      if (response.ok) {
        setAccounts([...accounts, newAccount]);
        showMessage('Account created successfully', 'success');
      } else {
        showMessage(newAccount.error || 'Failed to create account', 'error');
      }
    } catch (error) {
      showMessage('Failed to create account', 'error');
    }
  };

  const handleDeposit = async (accountId: string, amount: number) => {
    try {
      const response = await fetch(`${API_URL}/accounts/${accountId}/deposit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount }),
      });
      const result = await response.json();
      if (response.ok && result.success) {
        await fetchAccounts(); // Refresh all accounts
        setSelectedAccount(prev => prev?.id === accountId ? { ...prev, balance: result.balance! } : prev);
        showMessage(result.message, 'success');
      } else {
        showMessage(result.error || result.message, 'error');
      }
    } catch (error) {
      showMessage('Failed to deposit', 'error');
    }
  };

  const handleWithdraw = async (accountId: string, amount: number) => {
    try {
      const response = await fetch(`${API_URL}/accounts/${accountId}/withdraw`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount }),
      });
      const result = await response.json();
      if (response.ok && result.success) {
        await fetchAccounts(); // Refresh all accounts
        setSelectedAccount(prev => prev?.id === accountId ? { ...prev, balance: result.balance! } : prev);
        showMessage(result.message, 'success');
      } else {
        showMessage(result.error || result.message, 'error');
      }
    } catch (error) {
      showMessage('Failed to withdraw', 'error');
    }
  };

  const handleTransfer = async (fromAccountId: string, toAccountId: string, amount: number) => {
    try {
      const response = await fetch(`${API_URL}/accounts/${fromAccountId}/transfer/${toAccountId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount }),
      });
      const result = await response.json();
      if (response.ok && result.success) {
        await fetchAccounts(); // Refresh all accounts
        setSelectedAccount(prev => prev?.id === fromAccountId ? { ...prev, balance: result.balance! } : prev);
        showMessage(result.message, 'success');
      } else {
        showMessage(result.error || result.message, 'error');
      }
    } catch (error) {
      showMessage('Failed to transfer', 'error');
    }
  };

  return (
    <div className="container py-4">
      <h1 className="text-center mb-4">Banking Application</h1>
      
      {message && (
        <div className={`alert alert-${message.type === 'success' ? 'success' : 'danger'} mb-4`}>
          {message.text}
        </div>
      )}

      <div className="row">
        <div className="col-md-6">
          <AccountForm onCreateAccount={handleCreateAccount} />
          <AccountList
            accounts={accounts}
            onSelectAccount={(id) => setSelectedAccount(accounts.find(acc => acc.id === id) || null)}
          />
        </div>
        <div className="col-md-6">
          <TransactionForm
            selectedAccount={selectedAccount}
            accounts={accounts}
            onDeposit={handleDeposit}
            onWithdraw={handleWithdraw}
            onTransfer={handleTransfer}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
