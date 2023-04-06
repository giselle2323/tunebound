import { useState, useEffect } from "react";

type Post = {
  id: string;
  title: string;
  url: string;
};

type RedditResponse = {
  data: {
    after: string;
    children: {
      data: Post;
    }[];
  };
};

const SearchPlaylists = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [after, setAfter] = useState<string | null>(null);
  const [count, setCount] = useState<number>(0);
  const limit = 10;
  const [loading, setLoading] = useState<boolean>(false);

  const fetchPosts = async () => {
    try {
      const res = await fetch(
        `https://www.reddit.com/r/spotify.json?limit=${limit}&count=${count}&after=${after}`
      );
      const json: RedditResponse = await res.json();
      setPosts((prev) => [
        ...prev,
        ...json.data.children
          .map((child) => child.data)
          .filter((post) => {
            return post.url;
          }),
      ]);
      setAfter(json.data.after);
      setCount((prev) => prev + limit);
      //setLoading(false);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    //setLoading(true);

    //fetchPosts();
  }, [after, count]);

  const handleLoadMore = () => {
    fetchPosts();
  };
  return (
    <div className="text-white">
      <h1>Search Spotify Playlists</h1>
      <ul>
        {posts.map((post) => (
          <li key={post.id}>
            <a href={post.url} target="_blank" rel="noopener noreferrer">
              {post.title}
            </a>
          </li>
        ))}
      </ul>
      <button onClick={handleLoadMore}>Load More</button>
    </div>
  );
};

export default SearchPlaylists;
