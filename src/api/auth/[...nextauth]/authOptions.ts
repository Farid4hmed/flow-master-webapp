import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcrypt";
import { sql } from "@vercel/postgres";

const notAStudent = {
  id: 2,
  name: 'Unregistered Student',
  registration_number: '2041001037',
  branch: '-',
  batch: '-',
  section: '-',
  cgpa: '-',
  email: 'testUserEmail',
  phone: '-'
}

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
            SELECT * FROM students WHERE email = ${credentials?.email}
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
            const registration_number = credentials?.email === 'admin@soa.ac.in' ? 0 : user.email.split('.')[0]
            const response = await sql`
            SELECT * FROM collegeStudentDetails WHERE registration_number = ${registration_number}
          `;
            const userData = response.rows[0] || notAStudent;


            let isAdmin = false;
            if (user.email === 'admin@soa.ac.in') isAdmin = true;
            return { id: user.id, email: user.email, isAdmin: isAdmin, name: userData.name, registration: user.registration_number, branch: userData.branch, batch: userData.batch, section: userData.section, cgpa: userData.cgpa, phone: userData.phone };
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
      console.log("USER", user)
      if (user) {
        token.isAdmin = user?.isAdmin || false;
        token.registration = user?.registration;
        token.branch = user?.branch || "test";
        token.batch = user?.batch || "test";
        token.name = user?.name || "test";
        token.section = user?.section || "test";
        token.cgpa = user?.cgpa || "test";
        token.phone = user?.phone || "test";
      }
      return token;
    },
    async session({ session, token }: any) {
      if (token) {
        session.user.isAdmin = token?.isAdmin;
        session.name = token?.name || "test";
        session.registration = token?.registration;
        session.branch = token?.branch || "test";
        session.batch = token?.batch || "test";
        session.section = token?.section || "test";
        session.cgpa = token?.cgpa || "test";
        session.phone = token?.phone || "test";
      }
      return session;
    },
  },
};


export { authOptions };
