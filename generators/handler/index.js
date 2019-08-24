const path = require('path');
// const mkdirp = require('mkdirp');
const urlJoin = require('url-join');
const Generator = require('yeoman-generator');
const camelize = require('underscore.string/camelize');
const underscored = require('underscore.string/underscored');

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);

    this.projectname = this.config.get('name');
    this.apiversion = this.config.get('apiversion');
  }

  prompting() {
    const done = this.async();
    const that = this;

    this.prompt([
      {
        type: 'input',
        name: 'name',
        message: 'What is your handler name?',
        default: this.config.get('last_endpoint') || 'handler',
        validate: value => value !== undefined && value !== ''
      },
      {
        type: 'input',
        name: 'apidesc',
        message: 'Please give handler description for documentation!',
        default: this.config.get('last_apidesc') || 'description'
      },
      {
        type: 'confirm',
        name: 'handlerType',
        message: 'Does your handler support HTTP Type? (y/N)',
        default: this.config.get('last_httpHandlerType') || 0
      },
      {
        type: 'confirm',
        name: 'requiresMiddleware',
        message: 'Does your handler requires default middleware? (y/N)',
        default: this.config.get('last_handlerrequire') || 0,
        when: answer => (answer.handlerType)
      },
      {
        type: 'list',
        name: 'method',
        message: 'Handler Method?',
        default: this.config.get('last_method') || 'post',
        choices: ['get', 'post', 'put', 'delete'],
        when: answer => (answer.handlerType)
      }
    ]).then((answers) => {
      that.props = answers;
      that.props.injectRoute = false;
      that.props.apibase = that.config.get('apibase') || 'api';
      that.props.apiversion = that.config.get('apiversion') || 'v1';
      that.props.endpoint = `${that.props.name}`;
      that.props.httpHandlerType = `${that.props.handlerType}`;
      that.props.requiresMiddleware = `${that.props.requiresMiddleware}`;
      that.props.filename = underscored(that.props.name).replace('_', '-');
      that.props.src = that.config.get('src') || 'src';
      that.props.apiPath = urlJoin(that.props.src, that.props.apibase);

      // Handle nested api path
      let { name } = that.props;

      // Dirname by default is the filename
      let dirname = that.props.filename;
      if (name.indexOf('/') > -1) {
        // Create dirname
        dirname = underscored(path.dirname(name)).replace('_', '-');
        // mkdirp.sync(path.join(this.destinationPath(), dirname));
        name = path.basename(name);

        // now filename only store the basename
        that.props.filename = underscored(name).replace('_', '-');
        // dirname should be full path
        dirname = urlJoin(dirname, that.props.filename);
      }
      that.props.dirname = dirname;
      that.props.name = camelize(name, true);

      if (!that.projectname || !that.apiversion) {
        console.log('Invalid Serverless project!, exiting');
        process.exit();
      }

      this.on('end', () => {
        this.config.set('last_endpoint', that.props.endpoint);
        this.config.set('last_apidesc', that.props.apidesc);
        this.config.set('last_method', that.props.method);
        this.config.set('apibase', that.props.apibase);
        this.config.set('apiversion', that.props.apiversion);
        this.config.set('last_handlerType', that.props.httpHandlerType);
        this.config.set('last_handlerrequire', that.props.requiresMiddleware);
      });

      done();
    });
  }

  writing() {
    const done = this.async();
    const { props } = this;
    const copyTpl = this.fs.copyTpl.bind(this.fs);
    const tPath = this.templatePath.bind(this);
    const dPath = this.destinationPath.bind(this);
    const controllerName = `${props.filename}.controller.js`;
    const validationName = `${props.filename}.validator.js`;
    const testName = `${props.filename}.spec.js`;
    const apiRootPath = urlJoin(props.apiPath, this.apiversion);
    const apiPath = `${apiRootPath}/${props.dirname}`;

    /**
     * Controller
     */
    if (!this.fs.exists(dPath(`${apiPath}/${controllerName}`))) {
      copyTpl(tPath('_controller.ejs'), dPath(`${apiPath}/${controllerName}`), props);
    }

    /**
     * Route
     */
    if (!this.fs.exists(dPath(`${apiPath}/index.js`))) {
      copyTpl(tPath('_index.ejs'), dPath(`${apiPath}/index.js`), props);
    }

    /**
     * Validation
     */
    if (this.props.httpHandlerType === 'true' && !this.fs.exists(dPath(`${apiPath}/${validationName}`))) { // eslint-disable-line
      // As of v3.0.1 We no longer use validation
      // copyTpl(tPath('_validation.ejs'), dPath(`${apiPath}/${validationName}`), props);
      copyTpl(tPath('_validator.ejs'), dPath(`${apiPath}/${validationName}`), props);
    }

    /**
     * Unit Test
     */
    if (!this.fs.exists(dPath(`${apiPath}/${testName}`))) {
      copyTpl(tPath('_spec.ejs'), dPath(`${apiPath}/${testName}`), props);
    }

    done();
  }
};
