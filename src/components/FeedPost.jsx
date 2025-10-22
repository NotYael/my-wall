import React from "react";
import "./FeedPost.css";

export default function FeedPost({ post }) {
  return (
    <div className="feed-post">
      <div className="feed-post-header">
        <h3 className="feed-post-author">{post.name}</h3>
        <p className="feed-post-date">{post.date}</p>
      </div>
      <p className="feed-post-content">{post.content}</p>
      {post.photo_url && (
        <img
          src={post.photo_url}
          alt="Post attachment"
          className="feed-post-image"
        />
      )}
    </div>
  );
}
