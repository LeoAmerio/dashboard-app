"use server";

import { sql } from "@vercel/postgres";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";

const formSchema = z.object({
  id: z.string(),
  customerId: z.string({
    invalid_type_error: "Please select a customer.",
  }),
  amount: z.coerce
    .number()
    .gt(0, { message: "Amount must be greater than $0." }), //TODO Change this line for a public repository error.
  status: z.enum(["pending", "paid"], {
    invalid_type_error: "Please select a status.",
  }),
  date: z.string(),
});

const CreateInvoice = formSchema.omit({ id: true, date: true });

export type State = {
  errors?: {
    customerId?: string[];
    amount?: string[];
    status?: string[];
  };
  message?: string | null;
};

export async function createInvoice(prevState: State, formData: FormData) {
  const validateFileds = CreateInvoice.safeParse({
    customerId: formData.get("customerId"),
    amount: formData.get("amount"),
    status: formData.get("status"),

    //? Old way to parse the form data
    // const { customerId, amount, status } = CreateInvoice.parse({
    //   customerId: formData.get('customerId'),
    //   amount: formData.get('amount'),
    //   status: formData.get('status')
    // entries: Object.fromEntries(formData.entries())
  });

  if (!validateFileds.success) {
    return {
      errors: validateFileds.error.flatten().fieldErrors,
      message: "Missing fields.",
    }
  }
  
  console.log("Fields: ", validateFileds);
  const { customerId, amount, status } = validateFileds.data;
  const amountInCents = amount * 100;
  const date = new Date().toISOString().split("T")[0];

  try {
    await sql`
      INSERT INTO invoices (customer_id, amount, status, date)
      VALUES (${validateFileds.data.customerId}, ${validateFileds.data.amount}, ${validateFileds.data.status}, ${date})
    `;
  } catch (error) {
    return {
      message: "Database Error: Failed to create an invoice.",
    }; //TODO Refactor this to a toast
  }

  revalidatePath("/dashboard/invoices");
  redirect("/dashboard/invoices");

  //   const rawTest = Object.fromEntries(formData.entries())
  //   console.log(rawFormData)
  //   console.log(rawTest);
}

const UpdateInvoice = formSchema.omit({ id: true, date: true });

export async function updateInvoice(id: string, prevState: State, formData: FormData) {
  const validateFields = UpdateInvoice.safeParse({
    customerId: formData.get("customerId"),
    amount: formData.get("amount"),
    status: formData.get("status"),
  });

  if (!validateFields.success) {
    return {
      errors: validateFields.error.flatten().fieldErrors,
      message: "Missing fields.",
    };
  }

  const { customerId, amount, status } = validateFields.data;
  const amountInCents = amount * 100;

  try {
    await sql`
        UPDATE invoices
        SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
        WHERE id = ${id}
      `;
  } catch (error) {
    return { message: "Database Error: Failed to Update Invoice." };
  }

  revalidatePath("/dashboard/invoices");
  redirect("/dashboard/invoices");
}

export async function deleteInvoice(id: string) {
  try {
    await sql`DELETE FROM invoices WHERE id = ${id}`;
    revalidatePath("/dashboard/invoices");
    return { message: "Deleted Invoice." };
  } catch (error) {
    return { message: "Database Error: Failed to Delete Invoice." };
  }
}

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn('credentials', formData)
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }
}