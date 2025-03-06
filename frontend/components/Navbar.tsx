'use client'

import { useEffect, useState } from "react";
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Menu, 
  MenuItem 
} from "@mui/material";
import { useSession, signOut  } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
export default function Navbar() {
  
  const router = useRouter();
  const { data: session, status , update} = useSession();
  useEffect(() => {
    
    const validateSession = async () => {
      if (status === "unauthenticated") {
        router.replace("/login");
      }
    };
    
    validateSession();
  }, [status, router]);
 

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    if (anchorEl) return; 
    setAnchorEl(event.currentTarget);
  };
  

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    handleProfileMenuClose();
   
    Cookies.remove("next-auth.session-token");
    Cookies.remove("next-auth.csrf-token");
    Cookies.remove("next-auth.callback-url");
    
    
    await signOut({ callbackUrl: "/login"});
    
   
    await update();
    
    
    router.replace("/login");
  };
  

  const handleProfile = () => {
    router.push("/profile");
    handleProfileMenuClose();
  };

  return (
    <AppBar position="static">
      <Toolbar className="flex justify-between">
        <Link href="/posts">
          <Typography variant="h6" className="text-white">
            Blogi
          </Typography>
        </Link>
        <div>
          {session ? (
            <>
              <Link href="/posts/create">
                <Button color="inherit" className="mr-2">
                  Create Post
                </Button>
              </Link>
              <Button 
                color="inherit" 
                onClick={handleProfileMenuOpen}
              >
                Profile
              </Button>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleProfileMenuClose}
              >
                <MenuItem onClick={handleProfile}>
                  My Profile
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                  Logout
                </MenuItem>
              </Menu>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button color="inherit">Login</Button>
              </Link>
              <Link href="/register">
                <Button color="inherit">Register</Button>
              </Link>
            </>
          )}
        </div>
      </Toolbar>
    </AppBar>
  );
}