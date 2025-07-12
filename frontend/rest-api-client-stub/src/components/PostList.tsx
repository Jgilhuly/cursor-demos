import React from 'react';
import type { Post } from '../types/api';

interface PostListProps {
  posts: Post[];
  onDelete: (id: number) => void;
  onRefresh: () => void;
  loading: boolean;
}

export const PostList: React.FC<PostListProps> = ({ posts, onDelete, onRefresh, loading }) => {
  return (
    <div className="post-list">
      <div className="list-header">
        <h2>Posts ({posts.length})</h2>
        <button onClick={onRefresh} disabled={loading}>
          Refresh
        </button>
      </div>
      
      {posts.length === 0 && !loading && (
        <div className="empty-state">
          No posts found. Click refresh to load posts.
        </div>
      )}
      
      <div className="posts-grid">
        {posts.map(post => (
          <div key={post.id} className="post-card">
            <div className="post-header">
              <h3>#{post.id} - {post.title}</h3>
              <button 
                onClick={() => onDelete(post.id)}
                className="delete-btn"
                disabled={loading}
              >
                Delete
              </button>
            </div>
            <p className="post-body">{post.body}</p>
            <div className="post-meta">
              <span>User ID: {post.userId}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}; 