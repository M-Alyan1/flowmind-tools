export function parseWebhookResponse(response: any): string {
  if (typeof response === 'string') {
    return response;
  }
  
  if (Array.isArray(response) && response.length > 0) {
    // Check first item in array
    const first = response[0];
    if (typeof first === 'string') return first;
    if (first && typeof first === 'object') {
      return first.result || first.output || first.data || first.message || first.text || JSON.stringify(first, null, 2);
    }
    return JSON.stringify(response, null, 2);
  }
  
  if (response && typeof response === 'object') {
    return response.result || response.output || response.data || response.message || response.text || JSON.stringify(response, null, 2);
  }

  return String(response);
}
