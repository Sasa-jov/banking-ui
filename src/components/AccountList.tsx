import React from 'react';
import { Account } from '../types';

interface AccountListProps {
  accounts: Account[];
  onSelectAccount: (accountId: string) => void;
}

const AccountList: React.FC<AccountListProps> = ({ accounts, onSelectAccount }) => {
  return (
    <div className="card p-4 mb-4">
      <h3 className="mb-3">Accounts</h3>
      <div className="list-group">
        {accounts.map((account) => (
          <button
            key={account.id}
            className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
            onClick={() => onSelectAccount(account.id)}
          >
            <div>
              <h5 className="mb-1">{account.owner}</h5>
              <small>Account ID: {account.id}</small>
            </div>
            <span className="badge bg-primary rounded-pill">
              ${account.balance.toFixed(2)}
            </span>
          </button>
        ))}
      </div>
      {accounts.length === 0 && (
        <p className="text-center text-muted mt-3">No accounts found</p>
      )}
    </div>
  );
};

export default AccountList; 