import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api';

const static_card_style = 'rounded-xl bg-white p-6 shadow-sm ring-1 ring-black/5';

export default function CommunityPage() {
  const [posts, setPosts] = useState([]);
  const [sort, setSort] = useState('hot');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [loading, setLoading] = useState(false);

  async function load(currentSort = sort) {
    const response = await api.get(`/v1/community/posts?sort=${currentSort}`);
    setPosts(response.data ?? []);
  }

  useEffect(() => {
    load(sort).catch((error) => console.error(error));
  }, [sort]);

  async function createPost(event) {
    event.preventDefault();
    setLoading(true);
    try {
      await api.post('/v1/community/posts', { title, body, image_keys: [] });
      setTitle('');
      setBody('');
      await load(sort);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function vote(postId, value) {
    try {
      await api.post(`/v1/community/posts/${postId}/vote`, { value });
      await load(sort);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">Discussions</p>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Community</h1>
        </div>
        <select
          className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 ring-1 ring-black/5 transition-colors focus:border-sky-300 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          <option value="hot">Hot</option>
          <option value="top">Top</option>
          <option value="new">New</option>
        </select>
      </div>

      <form onSubmit={createPost} className={`${static_card_style} space-y-4`}>
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">New Post</p>
        <input
          className="w-full rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm transition-colors focus:border-sky-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20"
          placeholder="Post title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          minLength={4}
        />
        <textarea
          className="h-28 w-full rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm transition-colors focus:border-sky-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20"
          placeholder="Post body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          required
        />
        <button
          disabled={loading}
          className="rounded-xl bg-gray-900 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-gray-800 disabled:opacity-50 active:scale-[0.98]"
        >
          {loading ? 'Posting...' : 'Create Post'}
        </button>
      </form>

      <div className="space-y-3">
        {posts.map((post) => (
          <div key={post.id} className={`${static_card_style} transition-all duration-200 hover:shadow-md`}>
            <Link className="text-base font-bold text-gray-900 tracking-tight hover:text-gray-700 transition-colors" to={`/home/community/${post.id}`}>
              {post.title}
            </Link>
            <p className="mt-2 text-sm text-gray-600 leading-relaxed line-clamp-2">{post.body}</p>
            <div className="mt-4 flex items-center gap-3 text-sm">
              <button
                className="rounded-lg bg-white ring-1 ring-gray-200 px-3 py-1.5 text-xs font-bold text-gray-700 transition-all hover:bg-sky-50 hover:ring-sky-200 active:scale-[0.95]"
                onClick={() => vote(post.id, 1)}
              >
                ↑ Upvote
              </button>
              <button
                className="rounded-lg bg-white ring-1 ring-gray-200 px-3 py-1.5 text-xs font-bold text-gray-700 transition-all hover:bg-red-50 hover:ring-red-200 active:scale-[0.95]"
                onClick={() => vote(post.id, -1)}
              >
                ↓ Downvote
              </button>
              <span className="text-xs font-medium uppercase tracking-wider text-gray-400">
                Score: {post.score} · Comments: {post.comment_count}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
