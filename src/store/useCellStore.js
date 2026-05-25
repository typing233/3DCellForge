import { create } from 'zustand'

const useCellStore = create((set) => ({
  selectedOrganelleId: null,
  cameraPosition: [0, 0, 8],
  selectOrganelle: (id) => set({ selectedOrganelleId: id }),
  clearSelection: () => set({ selectedOrganelleId: null }),
  setCameraPosition: (position) => set({ cameraPosition: position }),
}))

export default useCellStore
