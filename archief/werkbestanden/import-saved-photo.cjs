// Restore the saved project that contains the photo requested for this export.
const fs=require('fs');
const source='/Users/openclawwillem/Downloads/Joel-project.json';
const target='outputs/Joel-telefoonformat.html';
const config=JSON.parse(fs.readFileSync(source,'utf8'));
if(!config.scenes[0].some(m=>m.photo?.src?.startsWith('data:image/')))throw Error('Saved photo missing');
const html=fs.readFileSync(target,'utf8');
const start=html.indexOf('const initial=');
const end=html.indexOf('\ninitial.photos',start);
if(start<0||end<0)throw Error('Initial config boundary missing');
fs.writeFileSync(target,html.slice(0,start)+'const initial='+JSON.stringify(config).replace(/</g,'\\u003c')+';'+html.slice(end));
fs.writeFileSync('outputs/Joel-project-met-foto.json',JSON.stringify(config,null,2));
console.log('Saved photo restored to the project and default scene.');
