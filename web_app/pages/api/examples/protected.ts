// This is an example of to protect an API route
import type { NextApiRequest, NextApiResponse } from "next"

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  return res.send({
    content: "This content is now public. No sign-in required."
  })
}
