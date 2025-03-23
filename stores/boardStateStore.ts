import { defineStore } from 'pinia'

export const useBoardStateStore = defineStore({
  id: 'boardStateStore',
  state: () => ({
    isOpenQr:false,
    description:'',
    bgColor:'',
    header:'',
    isOpenInputName:false,
    likeable:true,
    commentable:true
   }),
  actions: {
    setIsOpenQr(state:boolean){
      this.isOpenQr=state
    },
    setDescription(description:string){
      this.description=description
    },
    setBgColor(bgColor:string){
      this.bgColor = bgColor
    },
    setHeader(header:string){
      this.header=header
    },
    setISOpenInputName(state:boolean){
      this.isOpenInputName = state
    }
  }
})
