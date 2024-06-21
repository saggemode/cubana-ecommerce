'use server'

import * as z from 'zod'
import bcrypt from 'bcryptjs'

import prisma from '@/lib/prisma'
import { RegisterSchema } from '@/schemas'
import { getUserByEmail } from '@/data/user'
// import { sendVerificationEmail } from "@/lib/mail";
import { generateVerificationToken } from '@/lib/tokens'
import { compileActivationTemplate } from '@/lib/node-mails'
import { sendMail } from '@/lib/node-mails'

export const register = async (values: z.infer<typeof RegisterSchema>) => {
  const validatedFields = RegisterSchema.safeParse(values)

  if (!validatedFields.success) {
    return { error: 'Invalid fields!' }
  }

  const { email, password, name } = validatedFields.data
  const hashedPassword = await bcrypt.hash(password, 10)

  const existingUser = await getUserByEmail(email)

  if (existingUser) {
    return { error: 'Email already in use!' }
  }

  const userCount = await prisma.user.count()
  const isAdmin = userCount === 0

  await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: isAdmin ? 'ADMIN' : 'USER',
    },
  })

  // const verificationToken = await generateVerificationToken(email);
  // await sendVerificationEmail(
  //   verificationToken.email,
  //   verificationToken.token,
  // );

  const verificationToken = await generateVerificationToken(email)
  const confirmLink = `http://localhost:3000/auth/new-verification?token=${verificationToken.token}`

  const body = compileActivationTemplate(name, confirmLink)
  await sendMail({ to: email, subject: 'Activate your Account', body: body })

  return { success: 'Confirmation email sent!' }
}
