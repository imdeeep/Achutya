// Remove server-side SDK import
// import { v2 as cloudinary } from 'cloudinary';

// Remove server-side config
// cloudinary.config({
//   cloud_name: 'travelee',
//   api_key: '884793152861746',
//   api_secret: '-UjW9F9RS7Syyz6crou5_otGggg'
// });

export const uploadImage = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append('image', file);

    fetch(`http://localhost:3000/api/upload/image`, {
      method: 'POST',
      body: formData
    })
      .then(response => {
        if (!response.ok) {
          return response.json().then(err => {
            throw new Error(err.error || 'Upload failed');
          });
        }
        return response.json();
      })
      .then(data => {
        if (data.success && data.url) {
          resolve(data.url);
        } else {
          reject(new Error('Upload failed: No URL returned'));
        }
      })
      .catch(error => {
        console.error('Upload error:', error);
        reject(new Error(error.message || 'Failed to upload image. Please try again.'));
      });
  });
};