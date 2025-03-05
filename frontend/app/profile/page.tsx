"use client";

import { useState, useEffect } from "react";
import { 
  Container, 
  Typography, 
  Card, 
  CardContent, 
  Grid, 
  Button, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions 
} from "@mui/material";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface Post {
  id: number;
  title: string;
  content: string;
  image_url?: string;
  published: boolean;
  created_at: string;
}

export default function ProfilePage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<{id: number} | null>(null);
  const { data: session } = useSession();
  const router = useRouter();
  const [selected,setselected]=useState<string | null>(null)
  useEffect(() => {
    const fetchUserData = async () => {
      if (!session) return;
  
      try {
        const userResponse = await fetch(`${process.env.NEXT_PUBLIC_URL}/users/me`, {
          headers: {
            //@ts-ignore
            Authorization: `Bearer ${session.accessToken}`,
          },
        });
  
        const userData = await userResponse.json();
        console.log("User Data:", userData); // Debugging
  
        if (!userData.id) {
          console.error("User ID not found.");
          router.push('/login');
        }
        setCurrentUser(userData);
  
        const postsResponse = await fetch(`${process.env.NEXT_PUBLIC_URL}/users/${userData.id}/posts`, {
          headers: {
            //@ts-ignore
            Authorization: `Bearer ${session.accessToken}`,
          },
        });
  
        const postsData = await postsResponse.json();
        console.log("Posts Data:", postsData);
  
        if (Array.isArray(postsData)) {
          setPosts(postsData);
        } else {
          console.error("Invalid posts response:", postsData);
          setPosts([]); 
        }
      } catch (error) {
        console.error("Failed to fetch user data or posts", error);
        setPosts([]);
      }
    };
  
    fetchUserData();
  }, [session]);
  
  const handleEditPost = (post: Post) => {
    router.push(`/posts/${post.id}/edit`);
  };

  const handleDeletePost = async () => {
    if (!selectedPost || !session) return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_URL}/posts/${selectedPost.id}`, 
        {
          method: "DELETE",
          headers: {
            //@ts-ignore
            Authorization: `Bearer ${session.accessToken}`,
          },
        }
      );

      if (res.ok) {
        
        setPosts(posts.filter(p => p.id !== selectedPost.id));
        setDeleteDialogOpen(false);
        setSelectedPost(null);
      }
    } catch (error) {
      console.error("Failed to delete post", error);
    }
  };

  const openDeleteDialog = (post: Post) => {
    setSelectedPost(post);
    setDeleteDialogOpen(true);
  };
  const getFullImageUrl = (imageUrl?: string) => {     
    if (!imageUrl) return null;          
    // Remove leading slash if present     
    const cleanImageUrl = imageUrl.startsWith('/') ? imageUrl.substring(1) : imageUrl;          
    // Construct full URL     
    console.log("images" ,cleanImageUrl)     
    return `${process.env.NEXT_PUBLIC_URL}/${cleanImageUrl}`;   
}; 

  return (
    <Container>
     
      <Grid container spacing={3} padding={2}>
        {Array.isArray(posts) && posts.map((post) => (
          <Grid item xs={12} md={6} key={post.id}>
            <Card>
              {post.image_url && (
                <img 
                  src={getFullImageUrl(post.image_url) || undefined}  
                  alt={post.title} 
                  className="w-full h-48 object-cover"
                  onClick={() => setselected(getFullImageUrl(post.image_url))}
                />
              )}
              <CardContent>
                <Typography variant="h5">{post.title}</Typography>
                <Typography 
                  variant="body2" 
                  color={post.published ? "text.primary" : "text.secondary"}
                >
                  {post.published ? "Published" : "Draft"}
                </Typography>
                <Typography variant="body2" className="mt-2">
                  {post.content.substring(0, 200)}...
                </Typography>
                <div className="flex justify-between mt-4">
                  <Button 
                    variant="contained" 
                    color="primary"
                    onClick={() => handleEditPost(post)}
                  >
                    Edit
                  </Button>
                  <Button 
                    variant="contained" 
                    color="error"
                    onClick={() => openDeleteDialog(post)}
                  >
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Dialog open={!!selected} onClose={() => setselected(null)}>
        <DialogContent>
          <img src={selected || "null"} alt="Full View" className="w-full h-auto" />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Post</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this post?
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setDeleteDialogOpen(false)} 
            color="primary"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleDeletePost} 
            color="error"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}