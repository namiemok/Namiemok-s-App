import { DreamRecord } from "../types";

const STORAGE_KEY = 'dream_insight_history';

export const getHistory = (): DreamRecord[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    console.error("Failed to load history", e);
    return [];
  }
};

export const saveRecord = (record: DreamRecord): DreamRecord[] => {
  const history = getHistory();
  const updated = [record, ...history]; // Prepend new record
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error("Failed to save record", e);
  }
  return updated;
};

export const updateRecord = (updatedRecord: DreamRecord): DreamRecord[] => {
  const history = getHistory();
  const updated = history.map(rec => rec.id === updatedRecord.id ? updatedRecord : rec);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error("Failed to update record", e);
  }
  return updated;
};

export const deleteRecord = (id: string): DreamRecord[] => {
  const history = getHistory();
  const updated = history.filter(rec => rec.id !== id);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error("Failed to delete record", e);
  }
  return updated;
};

export const clearHistory = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};