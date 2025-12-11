import { v2 as cloudinary } from "cloudinary";

export async function imageUpload(image) {
  // Configuration
  cloudinary.config({
    cloud_name: "dtfdnuinn",
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET, // Click 'View API Keys' above to copy your API secret
  });

  // Upload an image
  const uploadResult = await cloudinary.uploader
    .upload(image, { folder: "cabins" })
    .catch((error) => {
      console.log(error);
    });

  const url = cloudinary.url(uploadResult.public_id, {
    transformation: [
      {
        quality: "auto",
        fetch_format: "auto",
        gravity: "auto",
      },
    ],
  });
  return url;
}
