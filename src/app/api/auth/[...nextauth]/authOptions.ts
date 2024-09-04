import NextAuth, { AuthOptions } from "next-auth";
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
          console.log("User found:", user);

          const passwordCorrect = await compare(
            credentials?.password || "",
            user.password
          );

          console.log({ passwordCorrect: passwordCorrect });

          if (passwordCorrect) {
            return { id: user.id, email: user.email };
          }

          return null;
        } catch (error) {
          console.error("Error connecting to database:", error);
          return null;
        }
      },
    }),
  ],
};


export { authOptions };
