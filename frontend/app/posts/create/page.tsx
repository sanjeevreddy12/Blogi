"use client";
import { useState } from "react";
import { 
  TextField, 
  Button, 
  Container, 
  Typography, 
  Switch, 
  FormControlLabel 
} from "@mui/material";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function CreatePostPage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [published, setPublished] = useState(true);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: session } = useSession();
  const router = useRouter();

  const handleImageUpload = async (imageFile: File) => {
    const formData = new FormData();
    formData.append("file", imageFile);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/uploads/`, {
        method: "POST",
        headers: {
            //@ts-ignore
          Authorization: `Bearer ${session?.accessToken}`,
        },
        body: formData,
      });
      const data = await res.json();
      return data.file_url;
    } catch (error) {
      console.error("Image upload failed", error);
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    if (!session) {
      setError("You must be logged in to create a post");
      setIsSubmitting(false);
      return;
    }

    try {
      let imageUrl = null;
      if (image) {
        imageUrl = await handleImageUpload(image);
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/posts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          //@ts-ignore
          Authorization: `Bearer ${session.accessToken}`,
        },
        body: JSON.stringify({
          title,
          content,
          image_url: imageUrl,
          published,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        setError(errorData.detail || "Failed to create post");
        setIsSubmitting(false);
        return;
      }

      // Redirect to posts page
      router.push("/posts");
    } catch (error) {
      console.error("Post creation failed", error);
      setError("An unexpected error occurred");
      setIsSubmitting(false);
    }
  };

  return (
    <Container maxWidth="md" className="mt-10">
      <Typography variant="h4" className="mb-6 text-center">
        Create New Post
      </Typography>
      <form onSubmit={handleSubmit} className="space-y-4">
        <TextField
          fullWidth
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          disabled={isSubmitting}
        />
        <TextField
          fullWidth
          multiline
          rows={6}
          label="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          disabled={isSubmitting}
        />
        <input 
          type="file" 
          accept="image/*"
          onChange={(e) => setImage(e.target.files?.[0] || null)}
          className="mb-4"
          disabled={isSubmitting}
        />
        <FormControlLabel
          control={
            <Switch
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
              disabled={isSubmitting}
            />
          }
          label="Publish Post"
        />
        {error && (
          <Typography color="error" className="text-center">
            {error}
          </Typography>
        )}
        <Button 
          type="submit" 
          variant="contained" 
          color="primary" 
          fullWidth
          disabled={isSubmitting}
        >
          {isSubmitting ? "Creating Post..." : "Publish Post"}
        </Button>
      </form>
    </Container>
  );
}