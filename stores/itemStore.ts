import { defineStore } from "pinia";

export const useItemStoreStore = defineStore({
  id: "itemStoreStore",
  state: () => ({
    mine: [{ background: "", name: "", _id: "", boardId: "" }],
    trash: [{ background: "", name: "", _id: "", boardId: "" }],
  }),
  actions: {
    addMine(background: string, name: string, _id: string, boardId: string) {
      this.mine.push({
        background: background,
        name: name,
        _id: _id,
        boardId: boardId,
      });
    },
    addTrash(background: string, name: string, _id: string, boardId: string) {
      this.trash.push({
        background: background,
        name: name,
        _id: _id,
        boardId: boardId,
      });
    },
    setMine(items: Array<{ background: string, name: string, _id: string, boardId: string }>) {
      this.mine = items;
    },
    
    setTrash(items: Array<{ background: string, name: string, _id: string, boardId: string }>) {
      this.trash = items;
    },
    removeMine(_id: string) {
      const index = this.mine.findIndex(item => item._id === _id);
      if (index !== -1) {
        this.mine.splice(index, 1);
      }
    },
    
    removeTrash(_id: string) {
      const index = this.trash.findIndex(item => item._id === _id);
      if (index !== -1) {
        this.trash.splice(index, 1);
      }
    },

  },
});
