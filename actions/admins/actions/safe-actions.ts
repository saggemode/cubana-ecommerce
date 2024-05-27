import { createSafeActionClient } from "next-safe-action";
import { Role } from "@/constants/enum";
import { auth } from "@/auth";

export const action = createSafeActionClient();

export class ActionError extends Error {}

export const adminAction = createSafeActionClient({
  //@ts-expect-error - Return type is not correct
  handleReturnedServerError(e) {
    if (e instanceof ActionError) {
      return e.message;
    }

    return {
      serverError: "Something went wrong",
    };
  },

  async middleware() {
  
    const session = await auth();
    if (session?.user.role !== Role.ADMIN)
      throw new ActionError("You are not a admin");

    return {
      userId: session.user.id,
    };
  },
});

