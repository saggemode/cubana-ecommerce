import config from '@/config/site'
import Mail from '@/emails/verify'
import prisma from '@/lib/prisma'
import { generateSerial } from '@/lib/serial'
import { getErrorResponse } from '@/lib/utils'
import { Resend } from 'resend'
const resend = new Resend(process.env.RESEND_API_KEY)

import { render } from '@react-email/render'
import { NextRequest, NextResponse } from 'next/server'
import { ZodError } from 'zod'

export async function POST(req: NextRequest) {
  try {
    const OTP = generateSerial({})

    const { email } = await req.json()

    const isEmailValid = (email: any) => {
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return regex.test(email)
    }

    if (isEmailValid(email)) {
      await prisma.user.upsert({
        where: { email: email.toString().toLowerCase() },
        update: {
          OTP,
        },
        create: {
          email: email.toString().toLowerCase(),
          OTP,
        },
      })

      await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: email,
        subject: 'Reset your password',
        //html: `<p>Your 2FA code: ${OTP}</p>`,
        html: render(Mail({ code: OTP, name: config.name })),
      })

      return new NextResponse(
        JSON.stringify({
          status: 'success',
          email,
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    }

    if (!isEmailValid(email)) {
      return getErrorResponse(400, 'Incorrect Email')
    }
  } catch (error) {
    console.error(error)

    if (error instanceof ZodError) {
      return getErrorResponse(400, 'failed validations', error)
    }

    if (error instanceof Error) {
      return getErrorResponse(500, error.message)
    }

    return getErrorResponse(500, 'An unexpected error occurred')
  }
}
