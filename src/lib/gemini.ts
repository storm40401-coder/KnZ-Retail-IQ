export async function optimizeListing(productName: string, category: string, currentDescription: string) {
  try {
    const response = await fetch('/api/ai/optimize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productName, category, currentDescription })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Optimization failed');
    }

    return await response.json();
  } catch (error) {
    console.error("Gemini optimization proxy error:", error);
    throw error;
  }
}

export async function generateMarketReport(query: string) {
  try {
    const response = await fetch('/api/ai/market-report', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Market report failed');
    }

    return await response.json();
  } catch (error) {
    console.error("Gemini Market Report proxy error:", error);
    throw error;
  }
}
