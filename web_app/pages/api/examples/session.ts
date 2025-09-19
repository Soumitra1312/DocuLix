// This endpoint is now public and does not return session info
import type { NextApiRequest, NextApiResponse } from "next"

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  res.send(JSON.stringify({ message: "Session info removed. Public endpoint." }, null, 2))
}
