import { v2 as cloudinary } from 'cloudinary';
import { GALLERIES, type Gallery } from './galleries';

export { GALLERIES, type Gallery };

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function getGalleryImages(gallery: Gallery): Promise<string[]> {
  const result = await cloudinary.search
    .expression(`folder:tc-photography/${gallery}`)
    .sort_by('public_id', 'asc')
    .max_results(100)
    .execute();

  return result.resources.map((resource: { secure_url: string }) => resource.secure_url);
}

export async function getGalleryImageDetails(
  gallery: Gallery
): Promise<{ public_id: string; secure_url: string }[]> {
  const result = await cloudinary.search
    .expression(`folder:tc-photography/${gallery}`)
    .sort_by('public_id', 'asc')
    .max_results(100)
    .execute();

  return result.resources.map((r: { public_id: string; secure_url: string }) => ({
    public_id: r.public_id,
    secure_url: r.secure_url,
  }));
}

export async function getAllGalleryImages(): Promise<Record<Gallery, string[]>> {
  const entries = await Promise.all(
    GALLERIES.map(async (gallery) => [gallery, await getGalleryImages(gallery)])
  );
  return Object.fromEntries(entries) as Record<Gallery, string[]>;
}

export { cloudinary };
