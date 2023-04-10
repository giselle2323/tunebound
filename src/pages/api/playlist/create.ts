import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../lib/prisma";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { name, description, image, url, creator, id } = req.body;
    
    const existingPlaylist = await prisma.playlist.findFirst({
      where: {
        OR: [
          { id: id },
          { name: name },
        ],
      },
    });

    if (existingPlaylist) {
      return res.status(409).json({ message: "Playlist already exists" });
    }

    const playlist = await prisma.playlist.create({
      data: {
        name,
        description,
        image,
        url,
        creator,
        id
      },
    });

    res.json(playlist);
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
