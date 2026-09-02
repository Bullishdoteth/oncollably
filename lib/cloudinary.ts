import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export async function uploadToCloudinary(
  fileBuffer: Buffer,
  folder: string = "oncollably/avatars"
): Promise<string> {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (cloudName && apiKey && apiSecret) {
    try {
      const url = await new Promise<string>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder,
            resource_type: "auto",
            transformation: [{ width: 400, height: 400, crop: "limit", quality: "auto" }],
          },
          (error, result) => {
            if (error || !result) {
              console.warn("Cloudinary API returned error, falling back to base64:", error?.message || error);
              return reject(error || new Error("Cloudinary upload failed"));
            }
            resolve(result.secure_url);
          }
        );
        uploadStream.end(fileBuffer);
      });
      return url;
    } catch (err) {
      console.warn("Cloudinary upload stream failed or 403, using base64 fallback.");
    }
  }

  // Resilient fallback if Cloudinary credentials fail or are missing
  const base64Data = fileBuffer.toString("base64");
  return `data:image/png;base64,${base64Data}`;
}

export { cloudinary };
