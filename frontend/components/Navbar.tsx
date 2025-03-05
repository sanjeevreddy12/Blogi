
'use client';

import { useState } from "react";
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Menu, 
  MenuItem 
} from "@mui/material";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { data: session } = useSession();
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    if (anchorEl) return; // Prevent re-opening on re-renders
    setAnchorEl(event.currentTarget);
  };
  

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleProfileMenuClose();
    signOut({ redirect: false });
    router.push("/login");
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