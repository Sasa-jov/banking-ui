import React, { useState } from 'react';

interface AccountFormProps {
  onCreateAccount: (owner: string, initialDeposit: number) => void;
}

const AccountForm: React.FC<AccountFormProps> = ({ onCreateAccount }) => {
  const [owner, setOwner] = useState('');
  const [initialDeposit, setInitialDeposit] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (owner && initialDeposit) {
      onCreateAccount(owner, parseFloat(initialDeposit));
      setOwner('');
      setInitialDeposit('');
    }
  };

  return (
    <div className="card p-4 mb-4">
      <h3 className="mb-3">Create New Account</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="owner" className="form-label">Owner Name:</label>
          <input
            type="text"
            className="form-control"
            id="owner"
            value={owner}
            onChange={(e) => setOwner(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="initialDeposit" className="form-label">Initial Deposit:</label>
          <input
            type="number"
            className="form-control"
            id="initialDeposit"
            value={initialDeposit}
            onChange={(e) => setInitialDeposit(e.target.value)}
            min="0"
            step="0.01"
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Create Account</button>
      </form>
    </div>
  );
};

export default AccountForm; 