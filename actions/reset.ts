'use server'

import * as z from 'zod'

import { ResetSchema } from '@/schemas'
import { getUserByEmail } from '@/data/user'
//import { sendPasswordResetEmail } from "@/lib/mail";
import { compileResetPassTemplate } from '@/lib/node-mails'
import { sendMail } from '@/lib/node-mails'
import { generatePasswordResetToken } from '@/lib/tokens'
import { env } from '@/schemas/env-schema'

export const reset = async (values: z.infer<typeof ResetSchema>) => {
  const validatedFields = ResetSchema.safeParse(values)

  if (!validatedFields.success) {
    return { error: 'Invalid emaiL!' }
  }

  const { email } = validatedFields.data

  const existingUser = await getUserByEmail(email)

  if (!existingUser) {
    return { error: 'Email not found!' }
  }

  // const passwordResetToken = await generatePasswordResetToken(email);
  // await sendPasswordResetEmail(
  //   passwordResetToken.email,
  //   passwordResetToken.token,
  // );

  const passwordResetToken = await generatePasswordResetToken(email)
  const resetLink = `${env.domain}/auth/new-password?token=${passwordResetToken.token}`

  const body = compileResetPassTemplate(email, resetLink)
  await sendMail({ 
    to: email, 
    subject: 'Password reset code', 
    body: body })

  return { success: 'Reset email sent!' }
}
