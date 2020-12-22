const prompt = require('prompt');
const shell = require('shelljs');
const fs = require('fs');

prompt.message = '';

module.exports = (args, options, logger) => {
  const template = options.template || 'default';
  const templatePath = `${__dirname}/../templates/${template}`;
  const localPath = process.cwd();
  const variables = require(`${templatePath}/_variables`);
  const spPath = `${localPath}/src/Service Portal`;
  const spDir = ['Themes', 'Style Sheets', 'Widgets'];

  // copy service portal templates
  if (fs.existsSync(templatePath)) {
    logger.info('Copying src files…');
    shell.cp('-R', `${templatePath}/*`, localPath);
    logger.info('✔ The files have been copied!');
  } else {
    logger.error(`The requested template for ${template} wasn’t found.`)
    process.exit(1);
  }

  logger.info('Please enter service portal name');

  // prompt for service portal name
  prompt.start().get(variables, (err, result) => {
    const spName = result['name']; // service portal name

    fs.access(spPath, error => {
      if (error) {
        logger.info("Service Portal directory does not exists.");

      } else {
        spDir.forEach(dir => {
          shell.cd(`${spPath}/`+dir);
    
          if (dir === 'Widgets') {
            shell.ls().forEach(item => {
              shell.cd(item);
              shell.ls().forEach(file => {
                shell.mv(file, spName+' '+file);
              });
              shell.cd('../')
            });       
          }
    
          shell.ls().forEach(dir => {
            shell.mv(dir, spName+' '+dir);
          });   
        })
      }
      
      logger.info(`✔ ${template} created successfully!`);

      // cleanup
      if (fs.existsSync(`${localPath}/_variables.js`)) {
        shell.rm(`${localPath}/_variables.js`);
      }  
    
    });
  });
}