import React, { useState } from 'react';
import type { User } from '../types/api';

interface PostFormProps {
  onSubmit: (postData: { title: string; body: string; userId: number }) => void;
  users: User[];
  loading: boolean;
}

export const PostForm: React.FC<PostFormProps> = ({ onSubmit, users, loading }) => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [userId, setUserId] = useState<number>(1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() && body.trim() && userId) {
      onSubmit({ title: title.trim(), body: body.trim(), userId });
      setTitle('');
      setBody('');
      setUserId(1);
    }
  };

  return (
    <div className="post-form">
      <h2>Create New Post</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter post title"
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="body">Body:</label>
          <textarea
            id="body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Enter post content"
            rows={5}
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="userId">User:</label>
          <select
            id="userId"
            value={userId}
            onChange={(e) => setUserId(parseInt(e.target.value))}
            disabled={loading}
          >
            {users.length > 0 ? (
              users.map(user => (
                <option key={user.id} value={user.id}>
                  {user.name} ({user.email})
                </option>
              ))
            ) : (
              Array.from({ length: 10 }, (_, i) => i + 1).map(id => (
                <option key={id} value={id}>
                  User {id}
                </option>
              ))
            )}
          </select>
        </div>

        <button type="submit" disabled={loading || !title.trim() || !body.trim()}>
          {loading ? 'Creating...' : 'Create Post'}
        </button>
      </form>
    </div>
  );
}; 