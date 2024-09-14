import { hash } from "bcrypt";
import { sql } from "@vercel/postgres";


export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    const hashedPassword = await hash(password, 10);


    const checkUser = await sql`
        SELECT * FROM sm_user WHERE email = ${email}
        `;

    if (checkUser.rows.length > 0) {
      return new Response(JSON.stringify({ error: "Email already exists." }), {
        status: 409,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    const response = await sql`
        INSERT INTO sm_user (email, password)
        VALUES (${email}, ${hashedPassword});
        `;

        console.log('after pushing new users data', response)
  } catch (error) {
    console.log(error);
  }

  return new Response(JSON.stringify({ error: "" }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}




function validateEmail(email: string) {
  // Regular expression to match the email format
  const regex = /^\d+\.\w+@gmail\.com$/;
  return regex.test(email);
}