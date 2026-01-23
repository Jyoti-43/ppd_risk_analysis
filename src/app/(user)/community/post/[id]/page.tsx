import PostDetailCard from "@/src/app/component/community/homaPage/post/post-detail-card";
import React from "react";

interface PageProps {
  params: {
    id: string;
  };
}

const page = async ({ params }: PageProps) => {
  const resolvedParams = await params;
  const id = resolvedParams.id;
  console.log(id);
  if (!id) return <div>Invalid post ID</div>;
  return (
  <>
    <PostDetailCard postId={id} />;
  </>
  );
};

export default page;
