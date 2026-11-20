/**
 * Trích xuất publicId từ đường dẫn ảnh Cloudinary
 * Ví dụ: https://res.cloudinary.com/cloud/image/upload/v12345/cyclosa/avatars/abc123.jpg
 * => Trả về: "cyclosa/avatars/abc123"
 */
export function extractPublicIdFromCloudinaryUrl(url?: string | null): string | null {
  if (!url || typeof url !== "string") return null;

  try {
    // Kiểm tra có phải URL Cloudinary không
    if (!url.includes("cloudinary.com")) return null;

    // Tìm vị trí sau "/upload/"
    const uploadIndex = url.indexOf("/upload/");
    if (uploadIndex === -1) return null;

    let pathAfterUpload = url.substring(uploadIndex + "/upload/".length);

    // Bỏ qua version nếu có: "v1234567890/"
    if (/^v\d+\//.test(pathAfterUpload)) {
      pathAfterUpload = pathAfterUpload.replace(/^v\d+\//, "");
    }

    // Bỏ qua các transformation params nếu có (ví dụ: w_500,h_500,c_fill/)
    // Nhưng thông thường URL lưu trong DB là upload/v.../folder/name.ext

    // Loại bỏ phần mở rộng tệp tin: .jpg, .png, .webp...
    const lastDotIndex = pathAfterUpload.lastIndexOf(".");
    if (lastDotIndex !== -1) {
      pathAfterUpload = pathAfterUpload.substring(0, lastDotIndex);
    }

    return pathAfterUpload.trim() || null;
  } catch {
    return null;
  }
}

