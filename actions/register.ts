'use server'

import config from '@/config/site'
import * as z from 'zod'
import bcrypt from 'bcryptjs'
import { render } from '@react-email/render'
import prisma from '@/lib/prisma'
import Mail from '@/emails/verify'
import { RegisterSchema } from '@/schemas'
import { getUserByEmail } from '@/data/user'
// import { sendVerificationEmail } from "@/lib/mail";
import { generateVerificationToken } from '@/lib/tokens'
// import { compileActivationTemplate } from '@/lib/node-mails'
import { sendMail } from '@/lib/node-mails'
import { env } from '@/schemas/env-schema'




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

  const verificationToken = await generateVerificationToken(email)
    const confirmLink = `${env.domain}/auth/new-verification?token=${verificationToken.token}`

  // const confirmLink = `http://localhost:3000/auth/new-verification?token=${verificationToken.token}`

  //const body = compileActivationTemplate(name, confirmLink)
  // await sendMail({ to: email, subject: 'Activate your Account', body: body })
  await sendMail({
    name: config.name,
    to: email,
    subject: 'Activate your Account',
    body: render(Mail({ code: confirmLink, name: config.name })),
  })
  return { success: 'Confirmation email sent!' }
}
