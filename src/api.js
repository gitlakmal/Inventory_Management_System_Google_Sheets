// src/api.js
export const API_URL = "https://script.google.com/macros/s/AKfycbzAlGI5nwG5JyD7CpCRdsPPykK94TjFpZZhlwDrTf5h0-BTG-grtLJyjwTlzvapQZzh/exec";

export const fetchSheetData = async (action, cat = 'inventory') => {
  try {
    const response = await fetch(`${API_URL}?action=${action}&cat=${cat}`);
    return await response.json();
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const postSheetData = async (action, payload) => {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      body: JSON.stringify({ action, payload }),
      headers: { "Content-Type": "text/plain;charset=utf-8" } 
    });
    return await response.json();
  } catch (error) {
    return { success: false, message: error.message };
  }
};