import axios from "axios";
import qs from "qs";
import React, { useEffect, useState } from "react";

const AddPlaylist = () => {
  const [token, setToken] = useState("");
  const [playlistId, setPlaylistId] = useState("");
  useEffect(() => {
    // Your client id and client secret
    const client_id = "8b65773388ab41ae82ee9e3771df2ad8";
    const client_secret = "292ce2e1155142df89eaa8d83022625a";

    const getToken = async () => {
      try {
        const authOptions = {
          url: "https://accounts.spotify.com/api/token",
          headers: {
            Authorization: `Basic ${Buffer.from(
              `${client_id}:${client_secret}`
            ).toString("base64")}`,
          },
          data: {
            grant_type: "client_credentials",
          },
        };

        const response = await axios.post(
          authOptions.url,
          qs.stringify(authOptions.data),
          {
            headers: authOptions.headers,
          }
        );
        console.log(response.data.access_token);

        setToken(response.data.access_token);

        const expiresIn = response.data.expires_in || 3600;
        setTimeout(getToken, (expiresIn - 60) * 1000);
      } catch (error) {
        console.error(error);
      }
    };

    getToken();
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // TODO: Send request to Spotify API and save playlist to database

    // Make a GET request to the Spotify API to get the playlist data
    const playlistUrl = `https://api.spotify.com/v1/playlists/${playlistId}`;
    const options = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };
    try {
      const response = await axios.get(playlistUrl, options);
      if (response.status === 200) {
        // Parse the playlist data and extract the relevant fields
        const playlist = response.data;
        console.log(playlist);
        // TODO: Save the playlist to the database
        // TODO: Work on update feature and add link to user's name.
        const body = {
          name: playlist.name,
          description: playlist.description,
          image: playlist.images[0].url,
          creator: playlist.owner.display_name,
          url: playlist.external_urls.spotify,
          id: playlist.id,
        };

        await fetch(`/api/playlist/create`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        // Clear the playlist ID input field
        setPlaylistId("");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-full flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <img
          className="mx-auto h-12 w-auto"
          src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg"
          alt="Workflow"
        />
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Add a Spotify Playlist
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Playlist ID
              </label>
              <div className="flex flex-col gap-6">
                <div className="mt-1">
                  <input
                    id="playlist-id"
                    name="playlist-id"
                    type="text"
                    value={playlistId}
                    onChange={(event) => setPlaylistId(event.target.value)}
                    required
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>

                <div>
                  <button
                    type="submit"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Add Playlist
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddPlaylist;
