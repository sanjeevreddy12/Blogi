import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authoptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          console.error("Missing credentials");
          return null;
        }

        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
              username: credentials.username,
              password: credentials.password,
            }),
          });

          const data = await res.json();
          console.log("datatatat",data);

          if (res.ok && data.access_token) {
            if (typeof window !== "undefined") {
              localStorage.setItem("accessToken", data.access_token);
              console.log("Saved token:", data.access_token);
            }
            return {
              id: data.access_token,
              name: credentials.username,
              accessToken: data.access_token  
            };
          }
          
          console.error("Authentication failed:", data);
          return null;
        } catch (error) {
          console.error("Authentication error:", error);
          return null;
        }
      },
    }),
  ],
 
  
   
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        //@ts-ignore
        token.accessToken = user.accessToken;
        token.username = user.name;
      }
      console.log("tokennnnnnnnnnnnnnnn",token)
      return token;
    },
    async session({ session, token }) {
      //@ts-ignore
      session.accessToken = token.accessToken as string;
      //@ts-ignore
      session.user.name = token.username;
      //@ts-ignore
      session.user.id =token.sub;
      console.log("sssssssssssssssss",session)
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  debug: true,
  session: {
    strategy: "jwt",
    //@ts-ignore
    maxAge: 1500 * 24 * 60 * 60, 
  },
  secret: process.env.NEXTAUTH_SECRET || "sanju",
};
