"use client"
import { toast } from "sonner"
import { useEffect, useState } from "react"
import { MessageCircle, Send, MoreHorizontal, Check, X } from "lucide-react"
import { CommentsWithUser } from "@/lib/customtype"
import UserAvatar from "@/components/user-avatar"
import { DateTimeFormatter } from "@/lib/utils"
import { createComment, deleteComment, updateComment } from "@/lib/db/tanstack"
import { comments, NewComment } from "@/lib/db/schema"

export default function CommentSection(
  { clerkId, userId, taskId, editComment, allComments } : 
  { clerkId: string; userId: string; taskId: string; editComment: boolean; allComments: CommentsWithUser[]; }){

  // Hooks for input
  const [inputCreateComment, setInputCreateComment] = useState("");
  const [inputUpdateComment, setInputUpdateComment] = useState("");

  // Hooks for UI
  const [showCommentMenu, setShowCommentMenu] = useState<string | null>(null);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);

  // Mutation for operations
  const createCommentMutation = createComment(taskId);
	const updateCommentMutation = updateComment(taskId);
  const deleteCommentMutation = deleteComment(taskId);
  
  // Comments storage
  const [commentsList, setCommentsList] = useState<CommentsWithUser[]>(allComments);

  // Add comments to list
  useEffect(() => {
    setCommentsList(allComments);
  }, [allComments]);

  // Handle new comment
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate comment
    if(!inputCreateComment){
      toast.error("Comment cannot be empty.");
      return;
    }

    // Object of comment
    const newComment: NewComment = {
      taskId: taskId,
      userId: userId,
      content: inputCreateComment
    }

    // Create comment
    createCommentMutation.mutate(newComment, {
      onSuccess: () => {
        toast.success("Comment successfully posted.");
        setInputCreateComment("");
      },
      onError: () => {
        toast.error("Error posting comment.");
      }
    });
  }

  // Update comment
  function updateUserComment(id: string){
    // Validate comment
    if(!inputUpdateComment){
      toast.error("Comment cannot be empty.");
      return;
    }

    // Update the comment
    if(id){
      // Object of comment
      const updComment: Partial<typeof comments.$inferInsert> = { content: inputUpdateComment, updatedAt: new Date() };

      // Update comment
      updateCommentMutation.mutate({ commentId: id, updComment: updComment }, {
        onSuccess: () => {
          toast.success("Comment successfully updated.");
          setCommentsList(prev =>
            prev.map(c => (c.id === id ? { ...c, ...updComment } : c)));
          setEditingCommentId(null);
        },
        onError: () => {
          toast.error("Error updating comment.");
        }
      });
    }
  }

  // Delete comment
  function deleteUserComment(commentId: string){
    if(commentId){
      deleteCommentMutation.mutate(commentId, {
        onSuccess: () => {
          toast.success("Comment successfully deleted.");
        },
        onError: () => {
          toast.error("Error deleting comment.");
        }
      });
    }
  }

  return(
    <div className="mb-8 bg-white border border-gray-200 shadow-sm dark:bg-gray-800 dark:border-gray-700 rounded-2xl">
      <div className="p-6 lg:p-8">
        <h4 className="flex items-center mb-6 text-lg font-semibold text-gray-900 dark:text-white">
          <MessageCircle className="w-5 h-5 mr-2"/>
          {commentsList.length > 1 ? "Comments" : "Comment"} ({commentsList.length})
        </h4>
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="flex items-start space-x-4">
            <UserAvatar clerkId={clerkId}/>
            <div className="flex-1">
              <div className="flex space-x-3">
                <input
                  type="text" 
                  value={inputCreateComment} onChange={(e) => setInputCreateComment(e.target.value)}
                  placeholder="Add a comment..."
                  className="flex-1 px-4 py-3 text-gray-900 bg-white border border-gray-300 dark:text-white dark:bg-gray-700 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  type="submit"
                  disabled={createCommentMutation.isPending || updateCommentMutation.isPending || deleteCommentMutation.isPending}
                  className="flex items-center justify-center px-5 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-xl"
                >
                  <Send className="w-4 h-4"/>
                </button>
              </div>
            </div>
          </div>
        </form>
        <div className="space-y-6">
          {[...commentsList].sort((a, b) => {
            const aTime = new Date(a.updatedAt ?? 0).getTime();
            const bTime = new Date(b.updatedAt ?? 0).getTime();
            return bTime - aTime}).map((comment) => (
            <div key={comment.id} className="relative flex items-start space-x-4">
              <UserAvatar clerkId={comment.user.clerkId}/>
              <div className="flex-1">
                <div className="relative p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {comment.user.fname} {comment.user.lname}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {DateTimeFormatter(comment.createdAt ?? new Date())}
                      </span>
                    </div>
                    {(editComment || comment.user.id === userId) && (
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => setShowCommentMenu(showCommentMenu === comment.id ? null : comment.id)}
                          className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600"
                        >
                          <MoreHorizontal className="w-5 h-5 text-gray-500 dark:text-gray-400"/>
                        </button>
                        {showCommentMenu === comment.id && (
                          <div className="absolute right-0 z-10 w-32 mt-1 bg-white border border-gray-200 shadow-lg top-full dark:bg-gray-800 dark:border-gray-700 rounded-xl">
                            <button
                              type="button"
                              onClick={() => {
                                setInputUpdateComment(comment.content);
                                setEditingCommentId(comment.id);
                                setShowCommentMenu(null);
                              }}
                              className="w-full px-3 py-2 text-left text-gray-700 transition-colors dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 first:rounded-t-xl"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => deleteUserComment(comment.id)}
                              disabled={createCommentMutation.isPending || updateCommentMutation.isPending || deleteCommentMutation.isPending}
                              type="button"
                              className="w-full px-3 py-2 text-left text-red-600 transition-colors dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 last:rounded-b-xl"
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  {editingCommentId === comment.id ? (
                    <div className="flex items-center mt-2 space-x-2">
                      <input
                        type="text"
                        value={inputUpdateComment} onChange={(e) => setInputUpdateComment(e.target.value)}
                        className="flex-1 px-3 py-2 text-sm bg-white border rounded-xl dark:bg-gray-600 dark:text-white"
                      />
                      <button
                        type="button"
                        disabled={createCommentMutation.isPending || updateCommentMutation.isPending || deleteCommentMutation.isPending}
											  onClick={() => updateUserComment(comment.id)}
											  className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-800">
                        <Check className="w-4 h-4"/>
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingCommentId(null)}
                        className="p-2 text-gray-900 hover:bg-gray-200 dark:hover:bg-gray-600"
                      >
                        <X className="w-4 h-4"/>
                      </button>
                    </div>
                  ) : (
                    <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">{comment.content}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
          {commentsList.length === 0 && (
            <div className="py-12 text-center">
              <MessageCircle className="w-12 h-12 mx-auto mb-3 text-gray-300 dark:text-gray-600"/>
              <p className="text-gray-500 dark:text-gray-400">No comments yet. Start the conversation!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}