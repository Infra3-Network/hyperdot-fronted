export const TabManager = {
  getId: (prev: QE.TabArray) => {
    return prev.id;
  },

  add: (prev: QE.TabArray, tab: QE.TabProps) => {
    prev.id += 1;
    tab.id = prev.id;
    prev.tabs.push(tab);
    return prev;
  },

  remove: (prev: QE.TabArray, id: number) => {
    const newTabs = prev.tabs.filter((v: QE.TabProps) => v.id !== id);
    return {
      id: prev.id,
      tabs: newTabs,
    };
  },
  insertLastBefore: (prev: QE.TabArray, tab: QE.TabProps) => {
    if (prev.tabs.length === 0) {
      return TabManager.add(prev, tab);
    }

    prev.id += 1;
    tab.id = prev.id;
    const index = prev.tabs.length - 1;
    const newArray = [...prev.tabs];
    newArray.splice(index, 0, tab);
    prev.tabs = newArray;
    return prev;
  },

  insertIndexBefore: (prev: QE.TabArray, index: number, tab: QE.TabProps) => {
    prev.id += 1;
    tab.id = prev.id;
    const newArray = [...prev.tabs];
    newArray.splice(index, 0, tab);
    return {
      id: prev.id,
      tabs: newArray,
    };
  },

  findByName: (tabs: QE.TabArray, name: string) => {
    return tabs.tabs.find((v: QE.TabProps) => v.name === name);
  },

  findById: (tabs: QE.TabArray, id: number) => {
    return tabs.tabs.find((v: QE.TabProps) => v.id === id);
  },

  updateName: (prev: QE.TabArray, id: number, newName: string) => {
    const tab = TabManager.findById(prev, id);
    if (!tab) {
      return;
    }

    tab.name = newName;
    return prev;
  },

  updateConfig: (prev: QE.TabArray, id: number, newConfig: any) => {
    const tab = TabManager.findById(prev, id);
    if (!tab) {
      return;
    }

    tab.config = newConfig;
    return prev;
  },
};
