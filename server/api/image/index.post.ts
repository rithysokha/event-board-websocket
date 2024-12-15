import cloudinary from '~/utils/cloudinary';
import fs from 'fs/promises';
import path from 'path'; 
import os from 'os'; 

export default defineEventHandler(async (event) => {
  const files = await readMultipartFormData(event);

  if (!files?.length) {
    return { error: 'No file uploaded' };
  }

  try {
    const file = files[0]; 
    if (!file.filename) {
      return { error: 'File has no filename' };
    }
    const tempDir = os.tmpdir(); 
    const tempFilePath = path.join(tempDir, file.filename); 

    await fs.writeFile(tempFilePath, file.data);

    const result = await cloudinary.uploader.upload(tempFilePath);

    await fs.unlink(tempFilePath);

    return result;
  } catch (error) {
    console.error('Upload Error:', error);
    return { error: error };
  }
});
