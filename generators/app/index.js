const Generator = require('yeoman-generator');
const yosay = require('yosay');
const urlJoin = require('url-join');
// const path = require('path');
// const mkdirp = require('mkdirp');

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);

    // Process argument
    this.props = {};

    console.log(yosay('Welcome to NodeJs Serverless generator!'));
  }

  propmting() {
    const done = this.async();
    const that = this;

    this.prompt([
      {
        type: 'input',
        name: 'name',
        message: 'What is your project name?',
        default: that.config.get('name') || 'node-sls',
        validate: value => value !== undefined && value !== ''
      },
      {
        type: 'input',
        name: 'awsregion',
        message: 'Your AWS region?',
        default: that.config.get('awsregion') || 'ap-southeast-1',
        validate: value => value !== undefined && value !== ''
      },
      {
        type: 'input',
        name: 'apibase',
        message: 'Your API base path?',
        default: that.config.get('apibase') || 'api',
        validate: value => value !== undefined && value !== ''
      },
      {
        type: 'input',
        name: 'apiversion',
        message: 'Your API version?',
        default: that.config.get('apiversion') || 'v1',
        validate: value => value !== undefined && value !== ''
      },
      {
        type: 'input',
        name: 'version',
        message: 'Version number',
        default: that.config.get('version') || '1.0.0',
        validate: value => value !== undefined && value !== ''
      },
      {
        type: 'input',
        name: 'description',
        message: 'Description',
        default: that.config.get('description') || 'This project generated using Astro Generator'
      },
      {
        type: 'input',
        name: 'author',
        message: `Author's name`,
        default: that.config.get('author') || 'Rahul Khanna'
      },
      {
        type: 'input',
        name: 'license',
        message: `License`,
        default: 'MIT'
      }
    ]).then((answers) => {
      this.props = answers;
      done();
    });
  }

  writing() {
    const { props } = this;
    const copy = this.fs.copy.bind(this.fs);
    const copyTpl = this.fs.copyTpl.bind(this.fs);
    const tPath = this.templatePath.bind(this);
    const dPath = this.destinationPath.bind(this);

    this.destinationRoot(props.name);
    props.src = 'src';
    props.root = 'src';
    props.apiPath = urlJoin(props.src, props.apibase);

    /**
     * Etc
     */
    copy(tPath('_.gitignore'), dPath('.gitignore'));
    copyTpl(tPath('_.eslintrc.ejs'), dPath('.eslintrc'), props);
    copyTpl(tPath('_README.md'), dPath('README.md'), props);
    copyTpl(tPath('jest.json'), dPath('jest.json'), props);
    copyTpl(tPath('jsconfig.json.ejs'), dPath('jsconfig.json'), props);
    copyTpl(tPath('jsconfig.json.ejs'), dPath('jsconfig.json'), props);

    /**
     * License
     */
    if (props.license === 'MIT') {
      copyTpl(tPath('_LICENSE'), dPath('LICENSE'), props);
    }

    /**
     * Serverless config
     */
    copyTpl(tPath('serverless.ejs'), dPath('serverless.yml'), props);

    /**
     * index.js
     */
    copyTpl(tPath('src/index.ejs'), dPath(urlJoin(props.src, 'index.js')), props);

    this.config.save();

    this.on('end', () => {
      this.config.set('name', props.name);
      this.config.set('apibase', props.apibase);
      this.config.set('apiversion', props.apiversion);
      this.config.set('version', props.version);
      this.config.set('description', props.description);
      this.config.set('author', props.author);
      this.config.set('src', props.src);
      this.config.set('client', props.client);
      this.config.set('kind', props.kind);
    });
  }

  install() {
    this.installDependencies({ bower: false });
  }
};
