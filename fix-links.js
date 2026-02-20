const fs = require('fs');

const routesMap = {
  'Today': '/',
  'Routines': '/routine',
  'Insights': '/insights',
  'Successes': '/journal',
  'Wins': '/journal'
};

const pages = ['Dashboard.jsx', 'Routine.jsx', 'Insights.jsx', 'Journal.jsx'];

pages.forEach(page => {
  const filePath = `./src/pages/${page}`;
  let content = fs.readFileSync(filePath, 'utf8');

  // Replace <a href="#"> with <Link to="..."> for recognized labels
  content = content.replace(/<a([^>]+)href="#"([^>]*)>([\s\S]*?)<\/a>/g, (match, before, after, innerHtml) => {
    // Determine which route to use based on the text inside the link
    let to = '#';
    for (const [label, path] of Object.entries(routesMap)) {
      if (innerHtml.includes(label)) {
        to = path;
        break;
      }
    }
    return `<Link${before}to="${to}"${after}>${innerHtml}</Link>`;
  });

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Fixed links in ${page}`);
});
