import React from "react";
import FeedPost from "./FeedPost";
import { useState, useEffect } from "react";
import supabase from "../supabase-client";
import "./Feed.css";

export default function Feed() {
  const [posts, setPosts] = useState([]);

  // Temporary mock posts
  const mockPosts = [
    {
      id: 1,
      name: "Alex Rivera",
      date: "October 21, 2025",
      content:
        "Had a great time collaborating on the group project today. Learned a lot about backend routing, API design, and database optimization. Working with a team really opens your eyes to different approaches and perspectives. We managed to implement some really cool features that I didn't think were possible at first. Feeling grateful for such supportive teammates who are always willing to help each other grow.",
    },
    {
      id: 2,
      name: "Jamie Santos",
      date: "October 20, 2025",
      content:
        "Finally wrapped up my portfolio redesign — feeling accomplished! After weeks of tweaking colors, layouts, and animations, I think I've landed on something I'm really proud of. The process taught me so much about design principles, user experience, and attention to detail. It's amazing how much difference small changes can make in the overall feel of a site. Now time to start applying to opportunities!",
    },
    {
      id: 3,
      name: "Morgan Chen",
      date: "October 19, 2025",
      content:
        "Just finished a deep dive into TypeScript and I'm blown away by how much more confident I feel about my code now. Type safety is a game changer! The initial learning curve was steep, but now I can't imagine going back to plain JavaScript for larger projects. Highly recommend to anyone on the fence about learning it.",
    },
  ];

  const getPosts = async () => {
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .order("created_at", { ascending: false });

    // console.log("Data from Supabase:", data);
    // console.log("Error from Supabase:", error);

    if (error) {
      console.error("Supabase error:", error);
      // Just show mock posts if there's an error
      setPosts(mockPosts);
    } else if (data && data.length > 0) {
      // Transform Supabase posts to match mock post format
      const transformedPosts = data.map((post) => ({
        id: post.id,
        name: post.name || "Anonymous",
        date: new Date(post.created_at).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        content: post.body,
        photo_url: post.photo_url,
      }));
      setPosts([...transformedPosts, ...mockPosts]);
    } else {
      setPosts(mockPosts);
    }
  };

  useEffect(() => {
    getPosts();

    // Subscribe to realtime changes
    const channel = supabase
      .channel("posts-changes")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "posts" },
        (payload) => {
          console.log("✅ New post detected:", payload);
          // Refresh posts when any change happens
          getPosts();
        }
      )
      .subscribe();

    // Cleanup subscription on unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="feed">
      {posts.map((post) => (
        <FeedPost key={post.id} post={post} />
      ))}
    </div>
  );
}
