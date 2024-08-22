import {
  Body,
  Button,
  Column,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
} from '@react-email/components'
import React from 'react'

interface VercelInviteUserEmailProps {
  name?: string
  code?: string
}

export default function Verification({
  name = 'My Project',
  code = '',
}: VercelInviteUserEmailProps) {
  const previewText = 'Verify your email and login code'

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="my-auto mx-auto w-full max-w-lg">
          <Container className="border border-solid border-neutral-500/25 rounded mx-auto p-6 bg-white">
            <Heading className=" font-semibold text-gray-800 mt-0 text-sm">
              {name}
            </Heading>
            <Text className="text-gray-600 mt-4">
              Let’s make sure this is the right address we should use for your
              account.
            </Text>
            <div className="w-3/4 bg-neutral-100 border border-solid border-neutral-400/25 rounded-lg px-6 py-4 mt-4">
              <pre className="text-xs font-mono text-gray-800">{code}</pre>
            </div>
            <Text className="text-gray-600 mt-4">
              Your confirmation code / verification link is above. Enter it in
              your open browser window, and we&aposll help you get signed in. If
              you didn’t try to log in, you can safely ignore this email.
            </Text>
            <Hr className="border border-solid border-neutral-300 my-6" />
            <Text className="text-xs text-center text-neutral-500">
              © {new Date().getFullYear()} {name}™. All Rights Reserved.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}
