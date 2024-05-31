// import { useSession } from "next-auth/react";

// export const useCurrentUser = () => {
//   const session = useSession();

//   return session.data?.user;
// };


import { useSession } from 'next-auth/react'

export const useCurrentUser = () => {
  const { data: session } = useSession()

  return session?.user
}