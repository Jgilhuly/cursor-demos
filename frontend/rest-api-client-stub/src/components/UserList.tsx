import React from 'react';
import type { User } from '../types/api';

interface UserListProps {
  users: User[];
  onRefresh: () => void;
  loading: boolean;
}

export const UserList: React.FC<UserListProps> = ({ users, onRefresh, loading }) => {
  return (
    <div className="user-list">
      <div className="list-header">
        <h2>Users ({users.length})</h2>
        <button onClick={onRefresh} disabled={loading}>
          Refresh
        </button>
      </div>
      
      {users.length === 0 && !loading && (
        <div className="empty-state">
          No users found. Click refresh to load users.
        </div>
      )}
      
      <div className="users-grid">
        {users.map(user => (
          <div key={user.id} className="user-card">
            <div className="user-header">
              <h3>#{user.id} - {user.name}</h3>
              <span className="username">@{user.username}</span>
            </div>
            <div className="user-contact">
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Phone:</strong> {user.phone}</p>
              <p><strong>Website:</strong> {user.website}</p>
            </div>
            <div className="user-address">
              <p><strong>Address:</strong></p>
              <p>{user.address.street}, {user.address.suite}</p>
              <p>{user.address.city}, {user.address.zipcode}</p>
            </div>
            <div className="user-company">
              <p><strong>Company:</strong> {user.company.name}</p>
              <p><em>"{user.company.catchPhrase}"</em></p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}; 