import { connectToDatabase } from '~/utils/mongodb';
import { acceptTermsSchema } from '~/utils/user/acceptTerms';

export default defineEventHandler(async (event) => {
  try{
  const db = await connectToDatabase();
  const collection = db.collection('user');
  
  const body = await readBody(event);
  const { error, value } = acceptTermsSchema.validate(body);
  
  if (error) {
    throw createError({ statusCode: 400, message: error.details[0].message });
  }
  const result = await collection.findOneAndUpdate(
    {
      email:value.email
    },
    { $set: {acceptTermsAt: new Date()}},
    { 
        returnDocument: 'after',
        projection: { password: 0 }
      }
  );
   if (!result) {
      throw createError({ 
        statusCode: 404, 
        message: 'User not found' 
      });
    }
    
    return {
      success: true,
      user: {
        name: result.name,
        email: result.email,
        image: result.image,
        role: result.role,
        acceptTermsAt: result.acceptTermsAt.toISOString() 
      }
    };
}catch(error){
  console.log(error)
}
});
