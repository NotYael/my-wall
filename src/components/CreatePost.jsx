import { useState, useRef } from "react";
import supabase from "../supabase-client";
import "./CreatePost.css";

function CreatePost() {
  const [postContent, setPostContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const fileInputRef = useRef(null);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
    }
  };

  async function handleCreatePost() {
    try {
      setIsSubmitting(true);
      let photoUrl = null;

      // Upload image to Supabase Storage if one is selected
      if (selectedImage) {
        const fileExt = selectedImage.name.split(".").pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("post-images")
          .upload(filePath, selectedImage);

        if (uploadError) {
          console.error("Upload error:", uploadError);
          alert("Failed to upload image. Please try again.");
          setIsSubmitting(false);
          return;
        }

        // Get public URL
        const { data: urlData } = supabase.storage
          .from("post-images")
          .getPublicUrl(filePath);

        photoUrl = urlData.publicUrl;
        // console.log("Image uploaded:", photoUrl);
      }

      // Create post with or without image
      const { data, error } = await supabase.from("posts").insert({
        name: "Danyael Dela Cruz",
        body: postContent.trim(),
        photo_url: photoUrl,
      });

      if (error) {
        console.error("Supabase error:", error);
        alert("Failed to create post. Please try again.");
      } else {
        setPostContent("");
        setSelectedImage(null);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="post">
      <div className="post-input-wrapper">
        <div className="post-textarea-container">
          <textarea
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
            placeholder="What's on your mind?"
            className="post-textarea"
            rows="4"
            maxLength={250}
            disabled={isSubmitting}
          />
          <span className="post-char-count">
            {postContent.length}/250 characters remaining
          </span>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          style={{ display: "none" }}
        />
        <button
          type="button"
          onClick={handleImageClick}
          className="post-action-btn post-action-btn-square"
        >
          <span> {selectedImage ? "✅" : "📷"}</span>
        </button>
      </div>

      <button
        className="post-share-btn"
        onClick={handleCreatePost}
        disabled={isSubmitting || !postContent.trim()}
      >
        {isSubmitting ? "Sharing..." : "Share"}
      </button>
    </div>
  );
}

export default CreatePost;
