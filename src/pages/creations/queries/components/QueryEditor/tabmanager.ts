/**
 * Utility object for managing tabs.
 */
export const TabManager = {
  /**
   * Get the ID of the TabArray.
   * @function
   * @param {QE.TabArray} prev - Previous TabArray.
   * @returns {number} - ID of the TabArray.
   */
  getId: (prev: QE.TabArray) => {
    return prev.id;
  },

  /**
   * Add a new tab to the TabArray.
   * @function
   * @param {QE.TabArray} prev - Previous TabArray.
   * @param {QE.TabProps} tab - Tab to be added.
   * @returns {QE.TabArray} - Updated TabArray.
   */
  add: (prev: QE.TabArray, tab: QE.TabProps) => {
    prev.id += 1;
    tab.id = prev.id;
    prev.tabs.push(tab);
    return prev;
  },

  /**
   * Remove a tab from the TabArray by ID.
   * @function
   * @param {QE.TabArray} prev - Previous TabArray.
   * @param {number} id - ID of the tab to be removed.
   * @returns {QE.TabArray} - Updated TabArray.
   */
  remove: (prev: QE.TabArray, id: number) => {
    const newTabs = prev.tabs.filter((v: QE.TabProps) => v.id !== id);
    return {
      id: prev.id,
      tabs: newTabs,
    };
  },

  /**
   * Insert a new tab at the last position before the New Query tab.
   * @function
   * @param {QE.TabArray} prev - Previous TabArray.
   * @param {QE.TabProps} tab - Tab to be inserted.
   * @returns {QE.TabArray} - Updated TabArray.
   */
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

  /**
   * Insert a new tab at a specific index before the New Query tab.
   * @function
   * @param {QE.TabArray} prev - Previous TabArray.
   * @param {number} index - Index at which the tab will be inserted.
   * @param {QE.TabProps} tab - Tab to be inserted.
   * @returns {QE.TabArray} - Updated TabArray.
   */
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

  /**
   * Find a tab by its name in the TabArray.
   * @function
   * @param {QE.TabArray} tabs - TabArray to search.
   * @param {string} name - Name of the tab to find.
   * @returns {QE.TabProps | undefined} - Found tab or undefined if not found.
   */
  findByName: (tabs: QE.TabArray, name: string) => {
    return tabs.tabs.find((v: QE.TabProps) => v.name === name);
  },

  /**
   * Find a tab by its ID in the TabArray.
   * @function
   * @param {QE.TabArray} tabs - TabArray to search.
   * @param {number} id - ID of the tab to find.
   * @returns {QE.TabProps | undefined} - Found tab or undefined if not found.
   */
  findById: (tabs: QE.TabArray, id: number) => {
    return tabs.tabs.find((v: QE.TabProps) => v.id === id);
  },

  /**
   * Update the name of a tab in the TabArray.
   * @function
   * @param {QE.TabArray} prev - Previous TabArray.
   * @param {number} id - ID of the tab to be updated.
   * @param {string} newName - New name for the tab.
   * @returns {QE.TabArray | undefined} - Updated TabArray or undefined if tab not found.
   */
  updateName: (prev: QE.TabArray, id: number, newName: string) => {
    const tab = TabManager.findById(prev, id);
    if (!tab) {
      return;
    }

    tab.name = newName;
    return prev;
  },

  /**
   * Update the configuration of a tab in the TabArray.
   * @function
   * @param {QE.TabArray} prev - Previous TabArray.
   * @param {number} id - ID of the tab to be updated.
   * @param {any} newConfig - New configuration for the tab.
   * @returns {QE.TabArray | undefined} - Updated TabArray or undefined if tab not found.
   */
  updateConfig: (prev: QE.TabArray, id: number, newConfig: any) => {
    const tab = TabManager.findById(prev, id);
    if (!tab) {
      return;
    }

    tab.config = newConfig;
    return prev;
  },
};
