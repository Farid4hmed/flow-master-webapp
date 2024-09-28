import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const authOptions: AuthOptions = {
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        try {
          // Send POST request to the sign-in API
          const apiResponse = await fetch('https://fab-team-services.xyz:8089/signIn', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: credentials?.email,
              password: credentials?.password,
            }),
          });
          
          const data = await apiResponse.json();
          if (apiResponse.status === 200) {
            // Return an object that conforms to the extended User type
            const user: any = {
              email: credentials?.email || "",
              userId: `${data.body.user_id}` || "0", // Adjust based on actual response
              projects: data.body.projects || [], // Adjust based on actual response
            };

            return user; // The returned object now matches the expected User type
          }

          // If sign-in fails
          console.log("Sign-in failed");
          return null;
        } catch (error) {
          console.error("Error during sign-in:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.userId = user.userId;
        token.email = user.email;
        token.projects = user.projects || [];
      }
      return token;
    },
    async session({ session, token }: any) {
      if (token) {
        session.userId = token.userId;
        session.user.email = token.email;
        session.projects = token.projects || [];
      }
      return session;
    },
  },
};

export { authOptions };