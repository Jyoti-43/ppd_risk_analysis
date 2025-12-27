import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  getDocs,
  increment,
  limit,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore"

import { db } from "@/lib/firebaseConfig"

export type PostInput = {
  title: string
  content: string
  topics: string[]
  isAnonymous: boolean
  isSensitive: boolean
  author?: string
  userId?: string
  userEmail?: string
  imageUrl?: string | null
  status?: "draft" | "published"
}

function mapTopicsToTags(topics: string[]) {
  return topics.map((topic) => (topic.startsWith("#") ? topic : `#${topic}`))
}

export async function createPost(input: PostInput) {
  const payload = {
    title: input.title,
    content: input.content,
    tags: mapTopicsToTags(input.topics),
    topics: input.topics,
    isAnonymous: input.isAnonymous,
    isSensitive: input.isSensitive,
    author: input.author ?? "Unknown",
    userId: input.userId ?? "anonymous",
    userEmail: input.userEmail ?? "Unknown",
    imageUrl: input.imageUrl ?? null,
    status: input.status ?? "published",
    commentCount: 0,
    likes: [],
    views: 0,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  }

  const ref = await addDoc(collection(db, "posts"), payload)
  return ref.id
}

export async function saveDraft(input: Omit<PostInput, "status"> & { status?: "draft" }) {
  const payload = {
    title: input.title,
    content: input.content,
    tags: mapTopicsToTags(input.topics),
    topics: input.topics,
    isAnonymous: input.isAnonymous,
    isSensitive: input.isSensitive,
    author: input.author ?? "Unknown",
    userId: input.userId ?? "anonymous",
    userEmail: input.userEmail ?? "Unknown",
    imageUrl: input.imageUrl ?? null,
    status: "draft" as const,
    commentCount: 0,
    likes: [],
    views: 0,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  }

  const ref = await addDoc(collection(db, "posts"), payload)
  return ref.id
}

export async function fetchPosts(limitCount = 20) {
  try {
    const postsQuery = query(
      collection(db, "posts"),
      where("status", "==", "published"),
      orderBy("createdAt", "desc"),
      limit(limitCount)
    )
    const snapshot = await getDocs(postsQuery)
    return snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }))
  } catch (err: any) {
    // Fallback if composite index is missing: drop the where and filter client-side
    const fallbackQuery = query(collection(db, "posts"), orderBy("createdAt", "desc"), limit(limitCount))
    const snapshot = await getDocs(fallbackQuery)
    return snapshot.docs
      .map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }))
      .filter((p: any) => (p.status ?? "published") === "published")
  }
}

export type CommentInput = {
  author: string
  content: string
  isAnonymous?: boolean
}

export async function addComment(postId: string, comment: CommentInput) {
  const commentsCol = collection(db, "posts", postId, "comments")
  await addDoc(commentsCol, {
    ...comment,
    createdAt: serverTimestamp(),
  })
  await updateDoc(doc(db, "posts", postId), { commentCount: increment(1), updatedAt: serverTimestamp() })
}

export async function addLike(postId: string, userId: string) {
  await updateDoc(doc(db, "posts", postId), {
    likes: arrayUnion(userId),
    updatedAt: serverTimestamp(),
  })
}

export type GroupInput = {
  name: string
  description: string
  topics: string[]
  createdBy?: string
}

export async function createGroup(input: GroupInput) {
  const ref = await addDoc(collection(db, "groups"), {
    ...input,
    members: 0,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
  return ref.id
}

export async function fetchGroups(limitCount = 20) {
  const groupsQuery = query(collection(db, "groups"), orderBy("createdAt", "desc"), limit(limitCount))
  const snapshot = await getDocs(groupsQuery)
  return snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }))
}
