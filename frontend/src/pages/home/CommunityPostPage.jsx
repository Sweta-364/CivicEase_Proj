import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../api';
import { PostDetailSkeleton } from '../../components/Skeletons';

const static_card_style = 'rounded-xl bg-white p-6 shadow-sm ring-1 ring-black/5';

function CommentTree({ comments, onVote, onReply }) {
  return (
    <div className="space-y-3">
      {comments.map((comment) => (
        <div key={comment.id} className="rounded-xl bg-gray-50 p-4 ring-1 ring-gray-100">
          <p className="text-sm text-gray-700 leading-relaxed">{comment.body}</p>
          <div className="mt-3 flex gap-2 text-xs">
            <button
              className="rounded-lg bg-white ring-1 ring-gray-200 px-2.5 py-1 font-bold text-gray-700 transition-all hover:bg-sky-50 hover:ring-sky-200 active:scale-[0.95]"
              onClick={() => onVote(comment.id, 1)}
            >
              +
            </button>
            <button
              className="rounded-lg bg-white ring-1 ring-gray-200 px-2.5 py-1 font-bold text-gray-700 transition-all hover:bg-red-50 hover:ring-red-200 active:scale-[0.95]"
              onClick={() => onVote(comment.id, -1)}
            >
              -
            </button>
            <button
              className="rounded-lg bg-white ring-1 ring-gray-200 px-2.5 py-1 font-bold text-sky-700 transition-all hover:bg-sky-50 hover:ring-sky-200 active:scale-[0.95]"
              onClick={() => onReply(comment.id)}
            >
              Reply
            </button>
            <span className="flex items-center text-gray-400 font-medium uppercase tracking-wider">Score: {comment.score}</span>
          </div>
          {comment.replies?.length > 0 && (
            <div className="ml-4 mt-3 border-l-2 border-gray-200 pl-4">
              <CommentTree comments={comment.replies} onVote={onVote} onReply={onReply} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default function CommunityPostPage() {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [commentBody, setCommentBody] = useState('');
  const [parentCommentId, setParentCommentId] = useState(null);

  async function load() {
    const response = await api.get(`/v1/community/posts/${postId}`);
    setPost(response.data);
  }

  useEffect(() => {
    load().catch((error) => console.error(error));
  }, [postId]);

  async function addComment(event) {
    event.preventDefault();
    await api.post(`/v1/community/posts/${postId}/comments`, {
      body: commentBody,
      parent_comment_id: parentCommentId,
    });
    setCommentBody('');
    setParentCommentId(null);
    await load();
  }

  async function voteComment(commentId, value) {
    await api.post(`/v1/community/comments/${commentId}/vote`, { value });
    await load();
  }

  if (!post) return <PostDetailSkeleton />;

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">Community Post</p>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{post.title}</h1>
      </div>

      <div className={static_card_style}>
        <p className="text-sm text-gray-700 leading-relaxed">{post.body}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="rounded-full bg-gray-100 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-gray-600">
            Score: {post.score}
          </span>
          <span className="rounded-full bg-gray-100 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-gray-600">
            Comments: {post.comment_count}
          </span>
        </div>
      </div>

      <form onSubmit={addComment} className={`${static_card_style} space-y-3`}>
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
          {parentCommentId ? `Replying to comment #${parentCommentId}` : 'Add a Comment'}
        </p>
        <textarea
          className="h-24 w-full rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm transition-colors focus:border-sky-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20"
          value={commentBody}
          onChange={(e) => setCommentBody(e.target.value)}
          required
          placeholder="Write your comment..."
        />
        <button className="rounded-xl bg-gray-900 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-gray-800 active:scale-[0.98]">
          Add Comment
        </button>
      </form>

      <CommentTree comments={post.comments ?? []} onVote={voteComment} onReply={setParentCommentId} />
    </div>
  );
}
