import { NextResponse } from "next/server";
import { uploadToCloudinary } from "@/lib/cloudinary";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Validate size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File size exceeds 5MB limit" },
        { status: 400 }
      );
    }

    // Convert file to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to Cloudinary
    const cloudinaryUrl = await uploadToCloudinary(buffer, "oncollably/avatars");

    return NextResponse.json({
      success: true,
      url: cloudinaryUrl,
    });
  } catch (error: any) {
    console.error("Image Upload Error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to upload image to Cloudinary" },
      { status: 500 }
    );
  }
}
