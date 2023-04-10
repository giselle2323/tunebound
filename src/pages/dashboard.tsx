import React, { useState, useEffect } from "react";
import { GetServerSideProps } from "next";
import { Playlist } from "@/types/playlist";
import prisma from "../../lib/prisma";

type Props = {
  playlists: Playlist[];
};

const Fetchplaylists: React.FC<Props> = (props) => {
  return (
    <ul
      role="list"
      className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8"
    >
      {props.playlists.map((playlist) => (
       <li key={playlist.id} className="relative">
          <div className="group block w-full aspect-w-10 aspect-h-7 rounded-lg bg-gray-100 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-gray-100 focus-within:ring-indigo-500 overflow-hidden">
            <img
              src={playlist.image}
              alt=""
              className="object-cover pointer-events-none group-hover:opacity-75"
            />
            <button
              type="button"
              className="absolute inset-0 focus:outline-none"
            >
              <span className="sr-only">View details for {playlist.url}</span>
            </button>
          </div>
          <p className="mt-2 block text-sm font-medium text-gray-900 truncate pointer-events-none">
            {playlist.name}
          </p>
          <p className="block text-sm font-medium text-gray-500 pointer-events-none">
            {playlist.creator}
          </p>
        </li> 
      ))}
    </ul>
  );
};
export const getServerSideProps: GetServerSideProps = async () => {
  const playlists = await prisma.playlist.findMany();
  const serializedPlaylists = playlists.map((playlist) => {
    return {
      ...playlist,
      createdAt: playlist.createdAt.toString(),
      updatedAt: playlist.createdAt.toString(),
    };
  });
  return {
    props: { playlists: serializedPlaylists },
  };
};

export default Fetchplaylists;
