fetch('https://konghq.com')
  .then(r => r.text())
  .then(html => {
    // Look for stylesheets
    const cssLinks = [...html.matchAll(/<link[^>]*rel=["']stylesheet["'][^>]*href=["']([^"']+)["']/gi)].map(m => m[1]);
    console.log('CSS links:', cssLinks);
    
    // Look for inline styles matching grid or background
    const inlineStyles = [...html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi)].map(m => m[1]).join('\n');
    console.log('Inline style length:', inlineStyles.length);
    const gridRules = inlineStyles.match(/[^{}]*grid[^{}]*\{[^{}]*\}/gi);
    console.log('Grid rules:', gridRules ? gridRules.slice(0, 5) : 'none');
  })
  .catch(err => console.error(err));
