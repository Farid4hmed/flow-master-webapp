import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcrypt";
import { sql } from "@vercel/postgres";

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
          console.log("Connecting to database...");
          const response = await sql`
            SELECT * FROM sm_user WHERE email = ${credentials?.email}
          `;
          const user = response.rows[0];

          if (!user) {
            console.log("User not found");
            return null;
          }
          console.log("User found:", user.id);

          const passwordCorrect = await compare(
            credentials?.password || "",
            user.password
          );

          if (passwordCorrect) {
            const projectsResp = await sql `SELECT * from sm_project where user_id = ${user.id}`;
            const projects = projectsResp.rows;
            return { id: user.id, userId: user.id, email: user.email, projects: projects };
          }

          return null;
        } catch (error) {
          console.error("Error connecting to database:", error);
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
        token.projects = user.projects
      }
      return token;
    },
    async session({ session, token }: any) {
      if (token) {
        session.userId = token.userId;
        session.user.email = token.email;
        session.projects = token.projects
      }
      return session;
    },
  },
};

export { authOptions };