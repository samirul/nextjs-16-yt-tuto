"use server";

import z from "zod";
import { postSchema } from "./schemas/blog";
import { fetchMutation, fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { redirect } from "next/navigation";
import { getToken } from "@/lib/auth-server";
import { revalidatePath, updateTag } from "next/cache";

export async function createBlogAction(values: z.infer<typeof postSchema>) {
  try {
    const parsed = postSchema.safeParse(values);

    if (!parsed.success) {
      throw new Error("Something went wrong");
    }

    const token = await getToken();
    //Get the upload url.
    const imageUrl = await fetchMutation(
      api.posts.generateImageUploadUrl,
      {},
      { token },
    );
    // Upload the image.
    const uploadResult = await fetch(imageUrl, {
      method: "POST",
      headers: {
        "Content-Type": parsed.data.image.type,
      },
      body: parsed.data.image,
    });
    if (!uploadResult.ok) {
      return {
        error: "Failed to upload image",
      };
    }
    // Get the storage id
    const { storageId } = await uploadResult.json();
    // Store the storage ID and everything else in the form in the database.
    await fetchMutation(
      api.posts.createPost,
      {
        body: parsed.data.content,
        title: parsed.data.title,
        imageStorageId: storageId,
      },
      { token },
    );
  } catch {
    return {
      error: "Failed to create posts.",
    };
  }
  
  //revalidatePath('/blog');
  updateTag("blog");
  return redirect("/blog");
}
