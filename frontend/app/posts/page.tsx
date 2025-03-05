"use client";  
import { useState, useEffect } from "react"; 
import {    
    Card,
    CardContent,
    Typography,
    Button,
    Container,
    Grid,
    Pagination  ,
    Dialog,
    DialogContent,
    TextField,
    InputAdornment,
    IconButton
} from "@mui/material"; 
import { Search } from "@mui/icons-material";
import { useSession } from "next-auth/react"; 
import { useRouter } from "next/navigation";  

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

export default function PostsPage() {   
    const [posts, setPosts] = useState<Post[]>([]);   
    const [page, setPage] = useState(1);   
    const [totalPages, setTotalPages] = useState(1);   
    const { data: session } = useSession();   
    const router = useRouter();    
    const [selected,setselected]=useState<string | null>(null)
    const [search,setsearch]=useState("");


    useEffect(() => {     
        if (!session) {       
            router.push("/login");       
            return;     
        }  
         

        const fetchPosts = async () => {       
            try {         
                const res = await fetch(           
                    `${process.env.NEXT_PUBLIC_URL}/posts?skip=${(page - 1) * 10}&limit=10`,           
                    {             
                        headers: {                 
                            //@ts-ignore               
                            Authorization: `Bearer ${session.accessToken}`,             
                        },           
                    }         
                );         
                const data = await res.json();         
                setPosts(data);         
                // Assuming total count can be fetched or estimated         
                setTotalPages(Math.ceil(data.length / 10));       
            } catch (error) {         
                console.error("Failed to fetch posts", error);       
            }     
        };      

        fetchPosts();   
    }, [page, session]);    
    const handleSearch = async () => {
      try {
          const res = await fetch(
              `${process.env.NEXT_PUBLIC_URL}/posts/search/?query=${search}`,
              {
                  headers: {
                      //@ts-ignore
                      Authorization: `Bearer ${session.accessToken}`,
                  },
              }
          );
          const data = await res.json();
          setPosts(data);
      } catch (error) {
          console.error("Failed to fetch search results", error);
      }
  };  

    const truncateContent = (content: string, maxLength = 200) => {     
        if (content.length <= maxLength) return content;     
        return content.substring(0, maxLength) + "...";   
    };    

    const handleReadMore = (postId: number) => {     
        router.push(`/posts/${postId}`);   
    };    

    // Helper function to construct full image URL   
    const getFullImageUrl = (imageUrl?: string) => {     
        if (!imageUrl) return null;          
        // Remove leading slash if present     
        const cleanImageUrl = imageUrl.startsWith('/') ? imageUrl.substring(1) : imageUrl;          
        // Construct full URL     
        console.log("images" ,cleanImageUrl);    
        return `${process.env.NEXT_PUBLIC_URL}/${cleanImageUrl}`;   
    };    

    return (     
        <Container maxWidth="md" >    
         <div className="flex justify-center my-4">
                <TextField
                    fullWidth
                    label="Search Posts"
                    variant="outlined"
                    value={search}
                    onChange={(e:any) => setsearch(e.target.value)}
                    onKeyPress={(e:any) => e.key === 'Enter' && handleSearch()}
                    className="mb-4 shadow-md rounded-lg"
                    InputProps={{
                        style: { backgroundColor: "#fff", borderRadius: "8px" },
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton onClick={handleSearch}>
                                    <Search />
                                </IconButton>
                            </InputAdornment>
                        )
                    }}
                />
            </div>         
            <Grid 
                container 
                spacing={3} 
                padding={2}
                direction="column" 
                alignItems="center"
                justifyContent="center"
            >
                {posts.map((post) => (           
                    <Grid item xs={12} md={8} key={post.id} className="w-full">             
                        <Card className="w-full">               
                            {post.image_url && (                 
                                <img                    
                                    src={getFullImageUrl(post.image_url) || undefined}                    
                                    alt={post.title}                    
                                    className="w-70 h-45 object-cover"  
                                    onClick={() => setselected(getFullImageUrl(post.image_url))}                 
                                    onError={(e) => {                     
                                        console.error('Image load error:', post.image_url);                     
                                        (e.target as HTMLImageElement).style.display = 'none';                   
                                    }}                 
                                />               
                            )}               
                            <CardContent>                 
                                <Typography variant="h5">{post.title}</Typography>                 
                                <Typography variant="subtitle2" color="text.secondary">                   
                                    By {post.user.username} on {new Date(post.created_at).toLocaleDateString()}                 
                                </Typography>                 
                                <Typography variant="body2" className="mt-2">                   
                                    {truncateContent(post.content)}                 
                                </Typography>                 
                                <Button                    
                                    onClick={() => handleReadMore(post.id)}                   
                                    color="primary"                    
                                    className="mt-2"                 
                                >                   
                                    Read More                 
                                </Button>               
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

            <div className="flex justify-center mt-6">         
                <Pagination            
                    count={totalPages}            
                    page={page}            
                    onChange={(_, value) => setPage(value)}            
                    color="primary"         
                />       
            </div>     
        </Container>   
    ); 
}