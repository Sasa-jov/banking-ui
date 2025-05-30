import React, { useState, useEffect } from 'react';
import { Account } from './types';
import AccountForm from './components/AccountForm';
import AccountList from './components/AccountList';
import TransactionForm from './components/TransactionForm';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// Backend API URL for all server requests
const API_URL = 'http://localhost:3001/api';

/**
 * Main App component that manages the banking application
 * Handles state management and API communication
 */
function App() {
  // State for managing list of all accounts
  const [accounts, setAccounts] = useState<Account[]>([]);
  // State for currently selected account for transactions
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  // State for displaying success/error messages
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Fetch all accounts when component mounts
  useEffect(() => {
    fetchAccounts();
  }, []);

  /**
   * Fetches all accounts from the backend
   * Updates the accounts state with the response
   */
  const fetchAccounts = async () => {
    try {
      const response = await fetch(`${API_URL}/accounts`);
      const data = await response.json();
      setAccounts(data);
    } catch (error) {
      showMessage('Failed to fetch accounts', 'error');
    }
  };

  /**
   * Displays a message to the user
   * @param text - Message to display
   * @param type - Type of message (success/error)
   */
  const showMessage = (text: string, type: 'success' | 'error') => {
    setMessage({ text, type });
    // Auto-hide message after 3 seconds
    setTimeout(() => setMessage(null), 3000);
  };

  /**
   * Creates a new bank account
   * @param owner - Name of the account owner
   * @param initialDeposit - Initial deposit amount
   */
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

  /**
   * Deposits money into an account
   * @param accountId - ID of the target account
   * @param amount - Amount to deposit
   */
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
        // Update selected account with new balance
        setSelectedAccount(prev => prev?.id === accountId ? { ...prev, balance: result.balance! } : prev);
        showMessage(result.message, 'success');
      } else {
        showMessage(result.error || result.message, 'error');
      }
    } catch (error) {
      showMessage('Failed to deposit', 'error');
    }
  };

  /**
   * Withdraws money from an account
   * @param accountId - ID of the source account
   * @param amount - Amount to withdraw
   */
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
        // Update selected account with new balance
        setSelectedAccount(prev => prev?.id === accountId ? { ...prev, balance: result.balance! } : prev);
        showMessage(result.message, 'success');
      } else {
        showMessage(result.error || result.message, 'error');
      }
    } catch (error) {
      showMessage('Failed to withdraw', 'error');
    }
  };

  /**
   * Transfers money between accounts
   * @param fromAccountId - ID of the source account
   * @param toAccountId - ID of the destination account
   * @param amount - Amount to transfer
   */
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
        // Update selected account with new balance
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
      
      {/* Display success/error messages */}
      {message && (
        <div className={`alert alert-${message.type === 'success' ? 'success' : 'danger'} mb-4`}>
          {message.text}
        </div>
      )}

      <div className="row">
        {/* Left column: Account creation and list */}
        <div className="col-md-6">
          <AccountForm onCreateAccount={handleCreateAccount} />
          <AccountList
            accounts={accounts}
            onSelectAccount={(id) => setSelectedAccount(accounts.find(acc => acc.id === id) || null)}
          />
        </div>
        {/* Right column: Transaction form */}
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
