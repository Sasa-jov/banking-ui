import React, { useState } from 'react';
import { Account } from '../types';

interface TransactionFormProps {
  selectedAccount: Account | null;
  accounts: Account[];
  onDeposit: (accountId: string, amount: number) => void;
  onWithdraw: (accountId: string, amount: number) => void;
  onTransfer: (fromAccountId: string, toAccountId: string, amount: number) => void;
}

const TransactionForm: React.FC<TransactionFormProps> = ({
  selectedAccount,
  accounts,
  onDeposit,
  onWithdraw,
  onTransfer,
}) => {
  const [amount, setAmount] = useState('');
  const [toAccountId, setToAccountId] = useState('');
  const [transactionType, setTransactionType] = useState<'deposit' | 'withdraw' | 'transfer'>('deposit');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAccount || !amount) return;

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) return;

    switch (transactionType) {
      case 'deposit':
        onDeposit(selectedAccount.id, numAmount);
        break;
      case 'withdraw':
        onWithdraw(selectedAccount.id, numAmount);
        break;
      case 'transfer':
        if (toAccountId) {
          onTransfer(selectedAccount.id, toAccountId, numAmount);
        }
        break;
    }

    setAmount('');
    setToAccountId('');
  };

  if (!selectedAccount) {
    return (
      <div className="card p-4 mb-4">
        <p className="text-center text-muted">Please select an account to perform transactions</p>
      </div>
    );
  }

  return (
    <div className="card p-4 mb-4">
      <h3 className="mb-3">Transaction</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Transaction Type:</label>
          <select
            className="form-select"
            value={transactionType}
            onChange={(e) => setTransactionType(e.target.value as 'deposit' | 'withdraw' | 'transfer')}
          >
            <option value="deposit">Deposit</option>
            <option value="withdraw">Withdraw</option>
            <option value="transfer">Transfer</option>
          </select>
        </div>

        {transactionType === 'transfer' && (
          <div className="mb-3">
            <label className="form-label">To Account:</label>
            <select
              className="form-select"
              value={toAccountId}
              onChange={(e) => setToAccountId(e.target.value)}
              required
            >
              <option value="">Select account...</option>
              {accounts
                .filter((acc) => acc.id !== selectedAccount.id)
                .map((account) => (
                  <option key={account.id} value={account.id}>
                    {account.owner} (${account.balance.toFixed(2)})
                  </option>
                ))}
            </select>
          </div>
        )}

        <div className="mb-3">
          <label className="form-label">Amount:</label>
          <input
            type="number"
            className="form-control"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min="0.01"
            step="0.01"
            required
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          disabled={transactionType === 'transfer' && !toAccountId}
        >
          Submit Transaction
        </button>
      </form>
    </div>
  );
};

export default TransactionForm; 