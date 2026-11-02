fetch('https://konghq.com')
  .then(r => r.text())
  .then(html => {
    // Check all script contents for keywords like webgl, three, perspective, grid, canvas, spline
    const allMatches = html.match(/(?:webgl|three\.js|perspective|wireframe|shader|mesh|particles|grid)/gi);
    console.log('Script keywords:', [...new Set(allMatches)]);
    
    // Check svg elements
    const svgs = html.match(/<svg[^>]*class=["'][^"']*grid[^"']*["'][^>]*>/gi);
    console.log('SVG grid classes:', svgs);
  })
  .catch(console.error);

