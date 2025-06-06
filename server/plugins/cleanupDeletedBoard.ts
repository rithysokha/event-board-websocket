import { defineNitroPlugin } from 'nitropack/runtime'
import { connectToDatabase } from '~/utils/mongodb'

export default defineNitroPlugin(async () => {
  if (process.env.NODE_ENV === 'production') {
    const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000
    
    setTimeout(() => {
      cleanupDeletedBoards()
    }, 60000)
    setInterval(cleanupDeletedBoards, TWENTY_FOUR_HOURS)
  } else {
    console.log('Scheduled cleanup tasks disabled in development mode')
  }
})

async function cleanupDeletedBoards() {
  try {
    console.log('Running scheduled cleanup of deleted boards | ', new Date())
    const db = await connectToDatabase()
    const boardCollection = db.collection('board')
    const postCollection = db.collection('post')
    const recentCollection = db.collection('recent')
    
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    
    const oldDeletedBoards = await boardCollection.find({
      deletedAt: { $lt: thirtyDaysAgo }
    }).toArray()
    
    for (const board of oldDeletedBoards) {
      const boardId = board._id.toString()
        await postCollection.deleteMany({ boardId: boardId })
        await recentCollection.deleteMany({ boardId: boardId })
        await boardCollection.deleteOne({ _id: board._id })
    }
    console.log('Cleanup completed successfully')
  } catch (error) {
    console.error('Error during cleanup task:', error)
  }
}