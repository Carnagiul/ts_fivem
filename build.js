const esbuild = require('esbuild');
const fs = require('fs');
const path = require('path'); // Ajout de l'importation du module path

const production = process.argv.findIndex(argItem => argItem === '--mode=production') >= 0;

const onRebuild = (context) => {
  return async (err, res) => {
    if (err) {
      return console.error(`[${context}]: Rebuild failed`, err);
    }

    console.log(`[${context}]: Rebuild succeeded, warnings:`, res.warnings);
  }
}

const buildInDirectory = (directory, context, type) => {
  fs.readdirSync(directory).forEach((filename) => {
    const entryPoint = path.join(directory, filename);
    if (fs.lstatSync(entryPoint).isDirectory())
      buildInDirectory(entryPoint, context + '/' + filename, type);
    else if (filename.endsWith('.ts')) {
      const outfile = path.join('dist', context, filename.replace('.ts', '.js'));

      esbuild.build({
        bundle: true,
        entryPoints: [entryPoint],
        outfile: outfile,
        watch: production ? false : {
          onRebuild: onRebuild(context),
        },
        ...(context === 'client' ? client : server),
      }).then(() => console.log(`[${type}]: Built ${outfile} successfully!`)).catch(() => process.exit(1));
    }
  });
};

const server = {
  platform: 'node',
  target: ['node16'],
  format: 'cjs',
};

const client = {
  platform: 'browser',
  target: ['chrome93'],
  format: 'iife',
};



for (const context of ['client', 'server']) {
  const contextDirectory = path.join(__dirname, context);

  buildInDirectory(contextDirectory, context, context);
}