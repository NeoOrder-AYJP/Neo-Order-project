// Configuration module with obfuscated API credentials
const apiKeyStr = 'sb_publishable_DBYnu-fuGsRW-vVj8mbKgQ_pBAT3mND';
const apiUrlStr = 'https://vhrpptqqzoltuzvjiiqn.supabase.co/rest/v1/';

const _k = Array.from(apiKeyStr).map(c => c.charCodeAt(0));
const _u = Array.from(apiUrlStr).map(c => c.charCodeAt(0));

export const API_KEY = String.fromCharCode(..._k);
export const API_URL = String.fromCharCode(..._u);
