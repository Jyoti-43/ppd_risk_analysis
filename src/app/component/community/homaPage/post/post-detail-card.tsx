"use client";
import React, { useState } from "react";
import { Heart, Share2, MessageCircle, MoreHorizontal } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Input } from "@/components/ui/input";
import { useGetPostQuery } from "@/src/app/redux/services/communityPostApi";
import { timeAgo } from "@/utills/timeAgo";

interface PostDetailCardProps {
  postId: string;
}

const PostDetailCard: React.FC<PostDetailCardProps> = ({ postId }) => {
  const [isHelpful, setIsHelpful] = useState(false);
  const [helpfulCount, setHelpfulCount] = useState(24);
  const { data: posts, isLoading, isError } = useGetPostQuery();

  const toggleHelpful = () => {
    setIsHelpful(!isHelpful);
    setHelpfulCount(isHelpful ? helpfulCount - 1 : helpfulCount + 1);
  };

  if (isLoading) return <div>Loading...</div>
  if (isError || !posts) return <div>Post not found.</div>

  const post = posts.find((p) => p.id === postId);

  if (!post) return <div>Post not found.</div>

  const paragraphs = post.body.split("\n").filter(Boolean);

  return (
    <div className=" relative flex min-h-screen flex-col  bg-background py-16">
      {/* Header */}

      {/* Main Content */}
      <div className="max-w-4xl mx-auto my-5 px-6 ">
        {/* Tags */}
        <div className="flex gap-2 mb-6">
          <span className="px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-sm"></span>
          {post.tags &&
            post.tags.map((tag, idx) => (
              <span
                key={tag + idx}
                className="px-1 py-1 bg-pink-100 text-primary rounded-full text-sm"
              >
                #{tag}
              </span>
            ))}
          {/* <span className="px-1 py-1 bg-pink-100 text-pink-700 rounded-full text-sm">
            #firstTimeMom
          </span> */}
        </div>

        {/* post Title */}
        <h1 className="text-4xl font-bold text-gray-900 mb-6">
          4{post.title}
          {/* Finding Light in the Darkness */}
        </h1>

        {/* Meta Info  or user information */}
        <div className="flex items-center gap-4 mb-8 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-400 to-pink-600"></div>
            <span className="font-medium">
              {post.user.name}
              {/* Anonymous Mother */}
            </span>
          </div>
          <span>•</span>
          <span>{timeAgo(post.postedTime)}3 hours ago</span>
          <span>•</span>
          <div className="flex items-center gap-1">
            {/* <MessageCircle className="w-4 h-4" /> */}
            {/* <span>2 min read</span> */}
          </div>
        </div>

        {/* Article Content */}
        <article className="prose prose-lg max-w-none">
          {/* {paragraphs.map((para, idx) => (
            <p key={idx} className="text-gray-800 leading-relaxed mb-4">
              {para}
            </p>
          ))} */}

          {paragraphs.map((para, idx) => {
            // Remove leading/trailing whitespace
            const trimmed = para.trim();
            // Check for markdown blockquote (one or more >)
            if (/^>+\s?/.test(trimmed)) {
              return (
                <div
                  key={idx}
                  className="border-l-4 border-primary pl-6 my-6 italic text-gray-700 bg-pink-50 py-4"
                >
                  {trimmed.replace(/^>+\s?/, "")}
                </div>
              );
            }
            return (
              <p key={idx} className="text-gray-800 leading-relaxed mb-4">
                {para}
              </p>
            );
          })}

          {/* <p className="text-gray-800 leading-relaxed mb-4">
            I never thought it would feel this way after having my beautiful
            baby girl. The nights seem so long and the anxiety, this, the waves
            that feel impossible to surf. Everyone told me about the "baby
            blues," but this isn't honeyed, like a fog that wouldn't lift even
            when the sun was shining directly on my face.
          </p> */}

          {/* <p className="text-gray-800 leading-relaxed mb-4">
            For the first three weeks, I cried every time she cried. It felt
            like I was failing her because I couldn't immediately soothe her
            with my body second of being born. And solving the drive, I started
            noticing every facial every nap, every diaper change, hoping that
            control would bring me peace. It didn't.
          </p> */}

          {/* <div className="border-l-4 border-primary pl-6 my-6 italic text-gray-700 bg-pink-50 py-4">
            "I started tracking every latest, every nap, every diaper change,
            hoping that control would bring me peace. It didn't."
          </div> */}

          {/* <p className="text-gray-800 leading-relaxed mb-4">
            But then I reached out to a local support group. Just saying the
            words "I am not okay" out loud was like the first crack in the dark.
            The other mothers nodded. They didn't judge. One of them held my
            hand while I wept. It wasn't a magical fix, but it was a start.
          </p> */}

          {/* <p className="text-gray-800 leading-relaxed mb-6">
            Today, I managed to take a shower and drink a hot coffee. It sounds
            small, but it feels like a victory. To anyone reading this who feels
            like they are drowning: please reach out. You don't have to do this
            alone. There is light, even if it's just a flicker right now.
          </p> */}
        </article>

        {/* Actions */}
        <div className="flex items-center justify-between py-6 border-t border-b border-gray-200 my-8">
          <button
            onClick={toggleHelpful}
            className={`flex items-center gap-2 ${
              isHelpful ? "text-pink-600" : "text-gray-600"
            } hover:text-pink-600 transition`}
          >
            <Heart className={`w-5 h-5 ${isHelpful ? "fill-pink-600" : ""}`} />
            <span className="font-medium">{helpfulCount} Found Helpful</span>
          </button>
          {/* <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
            <Share2 className="w-5 h-5" />
            <span className="font-medium">Share</span>
          </button>
          <button className="px-4 py-2 text-pink-600 hover:bg-pink-50 rounded font-medium">
            Report
          </button> */}
        </div>

        {/* Comments Section */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Supportive Comments (3)
            </h2>
            {/* <button className="text-pink-600 hover:text-pink-700 font-medium flex items-center gap-1">
              <Heart className="w-4 h-4" />
              Hide and Show
            </button> */}
          </div>

          {/* Comment Input */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
            <div className="flex gap-3">
              <div className="flex gap-4 items-center justify-between w-full ">
                <div className="w-16 p-2 rounded-full shrink-0  ">
                  <Avatar>
                    <AvatarImage
                      src="https://github.com/shadcn.png"
                      className="rounded-3xl"
                    />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </div>

                <div className="flex-1 ">
                  <Input
                    type="text"
                    placeholder="Share your thoughts about the post..."
                    className="w-full bg-secondary  text-foreground placeholder-muted-foreground rounded-lg px-2 py-4 border border-primary focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
                    //   onClick={() => setIsModalOpen(true)}
                    // readOnly
                  />
                </div>
                <button className="px-5 py-2 bg-pink-600 text-primary rounded-full font-medium hover:bg-pink-700">
                  Post Comment
                </button>
              </div>
            </div>
          </div>

          {/* Comment 1
          <div className="bg-white rounded-lg p-4 mb-4 border border-gray-100">
            <div className="flex gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex-shrink-0"></div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-semibold text-gray-900">
                    Jessica M.
                  </span>
                  <span className="text-sm text-gray-500">1 hour ago</span>
                </div>
                <p className="text-gray-700 leading-relaxed mb-3">
                  Thank you so much for sharing this. I felt the exact same way
                  with my firstborn. The guilt is so heavy, but we are right—it
                  does get better. Sending you so much love.
                </p>
                <div className="flex items-center gap-4">
                  <button className="flex items-center gap-1 text-sm text-gray-600 hover:text-pink-600">
                    <Heart className="w-4 h-4" />
                    <span>12 Like</span>
                  </button>
                  <button className="text-sm text-gray-600 hover:text-gray-900">
                    Reply
                  </button>
                </div>
              </div>
            </div>
          </div> */}

          {/* Comment 2 */}
          <div className="bg-white rounded-lg p-4 mb-4 border border-gray-100">
            <div className="flex gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex-shrink-0"></div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-semibold text-gray-900">Sarah K.</span>
                  <span className="text-sm text-gray-500">45 mins ago</span>
                </div>
                <p className="text-gray-700 leading-relaxed mb-3">
                  "The fog that wouldn't lift" is exactly how I described it to
                  my doctor. You are so brave for reaching out. That support
                  group sounds wonderful! Keep being those small victories.
                </p>
                <div className="flex items-center gap-4 mb-3">
                  <button className="flex items-center gap-1 text-sm text-gray-600 hover:text-pink-600">
                    <Heart className="w-4 h-4" />
                    <span>8 Like</span>
                  </button>
                  <button className="text-sm text-gray-600 hover:text-gray-900">
                    Reply
                  </button>
                </div>

                {/* Nested Reply */}
                <div className="ml-8 mt-3 pt-3 border-t border-gray-100">
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-400 to-pink-600 flex-shrink-0"></div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-semibold text-gray-900">
                          Anonymous Mother
                        </span>
                        <span className="px-2 py-0.5 bg-pink-100 text-pink-700 text-xs rounded-full">
                          AUTHOR
                        </span>
                      </div>
                      <p className="text-gray-700 text-sm leading-relaxed">
                        Thank you Sarah ❤️ Helps knowing I'm not the only one
                        who used those words.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Load More */}
          <div className="text-center mt-6">
            <button className="text-pink-600 hover:text-pink-700 font-medium">
              Load more comments
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default PostDetailCard;
