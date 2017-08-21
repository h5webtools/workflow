/**
 * context
 */

const EventEmitter = require('events');
const co = require('co');
const ora = require('ora');
const stringifyObject = require('stringify-object');
const core = require('./core');
const constant = require('./constant');
const getModule = require('./util/get_module');
const utilLog = require('./util/log');
const _ = require('./util');

const { PRESET_PREFIX } = constant;

class ContextBuild extends EventEmitter {
  constructor(env) {
    super();
    // 运行环境
    this.env = env || 'watch';
    // 默认preset为common
    this.preset = 'common';
    // 存储用户的设置
    this.configuration = {};
    // 打包配置，preset里面设置才会有
    this.packConfig = {};
    // block
    this.blocks = [];
  }

  setPreset(preset) {
    if (!preset || !_.isString(preset) || !_.isFunction(preset.run)) {
      throw new Error('Preset name not be empty and must be string or object which have a run function.');
    }

    this.preset = preset;
  }

  setConfig(cfg) {
    if (!_.isObject(cfg)) {
      throw new Error('Config must be object.');
    }

    this.configuration = cfg;
  }

  addBlock(block) {
    this.blocks.push(block);
  }

  createConfig(initialContext, configSetters) {
    configSetters = configSetters.concat(this.blocks);
    this.packConfig = core.createConfig(initialContext, configSetters);
    this.emit('created', stringifyObject(this.packConfig, {
      indent: '  ',
      singleQuotes: false
    }));
    utilLog.info('entry：');
    utilLog.info(JSON.stringify(this.packConfig.entry, null, 2));
    return this.packConfig;
  }

  start() {
    const preset = this.preset;

    if (preset && _.isString(preset)) {
      const resources = PRESET_PREFIX.map(p => `${p}${preset}`);
      this.runPreset(getModule(resources));
    } else {
      this.runPreset(preset);
    }
  }

  runPreset(preset) {
    const that = this;

    if (preset && _.isFunction(preset.run)) {
      co(function* () {
        try {
          const spinner = ora('Build start\n').start();
          // emit before event
          that.emit('before');
          spinner.text = 'Run preset...';
          // preset run
          yield preset.run(core, that);
          // emit after event
          that.emit('after');
          spinner.stop();
        } catch (e) {
          that.emit('error', e);
        }
      });
    } else {
      utilLog.error('Preset must export run function.');
    }
  }
}

module.exports = ContextBuild;
