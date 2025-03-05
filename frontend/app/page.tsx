import { Typography, Container, Button, Box, Grid } from "@mui/material";
import Link from "next/link";
import { Waves, Sparkle, Notebook } from "lucide-react";

export default function Home() {
  return (
    <Container maxWidth="md" className="min-h-screen flex items-center justify-center">
      <Box className="text-center">
        <Grid container spacing={3} direction="column" alignItems="center">
          <Grid item>
            <Typography 
              variant="h2" 
              className="font-bold text-4xl md:text-5xl mb-4 text-blue-800 flex items-center justify-center"
            >
              <Notebook className="mr-4 text-blue-600" size={48} />
              Blogi
            </Typography>
          </Grid>
          
          <Grid item>
            <Typography 
              variant="h5" 
              className="text-xl md:text-2xl mb-8 text-gray-600 max-w-2xl"
            >
              Craft, Share, and Inspire: Your Personal Blogging Journey Starts Here
            </Typography>
          </Grid>
          
          <Grid item>
            <Box className="space-x-4">
              <Link href="/login" passHref>
                <Button 
                  variant="contained" 
                  color="primary" 
                  size="large"
                  startIcon={<Waves />}
                  className="shadow-lg hover:shadow-xl transition-all"
                >
                  Login
                </Button>
              </Link>
              
              <Link href="/register" passHref>
                <Button 
                  variant="outlined" 
                  color="primary" 
                  size="large"
                  startIcon={<Sparkle />}
                  className="border-2 hover:border-blue-700 transition-all"
                >
                  Register
                </Button>
              </Link>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}