"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Container, Typography, Card, CardContent, CircularProgress } from "@mui/material";
import { useSession } from "next-auth/react";

interface Post {
  id: number;
  title: string;
  content: string;
  image_url?: string;
  created_at: string;
  user: {
    username: string;
  };
}

export default function PostDetailPage() {
  const { id } = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/posts/${id}`);
        if (!res.ok) throw new Error("Failed to fetch post");
        const data = await res.json();
        setPost(data);
      } catch (error) {
        console.error("Error fetching post:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  if (loading) return <CircularProgress className="block mx-auto mt-10" />;
  if (!post) return <Typography className="text-center mt-10">Post not found.</Typography>;

  const getFullImageUrl = (imageUrl?: string) => {
    if (!imageUrl) return null;
    return `${process.env.NEXT_PUBLIC_URL}/${imageUrl.startsWith('/') ? imageUrl.substring(1) : imageUrl}`;
  };

  return (
    <Container maxWidth="md" className="mt-10">
      <Card>
        {post.image_url && (
          <img src={getFullImageUrl(post.image_url) || undefined} alt={post.title} className="w-full h-64 object-cover" />
        )}
        <CardContent>
          <Typography variant="h4">{post.title}</Typography>
          <Typography variant="subtitle2" color="text.secondary">
            By {post.user.username} on {new Date(post.created_at).toLocaleDateString()}
          </Typography>
          <Typography variant="body1" className="mt-4">{post.content}</Typography>
        </CardContent>
      </Card>
    </Container>
  );
}
