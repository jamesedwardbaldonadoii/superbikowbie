const { Writable } = require('stream');
const { expect } = require('chai');
const { validator } = require('../lib');

describe('validator', function () {
  describe('validator.isDefined', () => {
    it('it should return true', () => {
      expect(validator.isDefined('')).to.be.true;
      expect(validator.isDefined('hello')).to.be.true;
      expect(validator.isDefined(true)).to.be.true;
      expect(validator.isDefined(false)).to.be.true;
      expect(validator.isDefined(null)).to.be.true;
      expect(validator.isDefined(NaN)).to.be.true;
      expect(validator.isDefined(0)).to.be.true;
      expect(validator.isDefined({})).to.be.true;
      expect(validator.isDefined([])).to.be.true;
    });
    it('it should return false', () => {
      expect(validator.isDefined(undefined)).to.be.false;
    });
  });

  describe('validator.isInstanceOf', () => {
    it('it should return true', () => {
      expect(validator.isInstanceOf(new Date(), Date)).to.be.true;
    });
    it('it should return false', () => {
      expect(validator.isInstanceOf('hello', Date)).to.be.false;
    });
  });

  describe('validator.isArray', () => {
    it('it should return true', () => {
      expect(validator.isArray([])).to.be.true;
    });
    it('it should return false', () => {
      expect(validator.isArray(undefined)).to.be.false;
      expect(validator.isArray({})).to.be.false;
    });
  });

  describe('validator.isArrayNotEmpty', () => {
    it('it should return true', () => {
      expect(validator.isArrayNotEmpty([1])).to.be.true;
    });
    it('it should return false', () => {
      expect(validator.isArrayNotEmpty([])).to.be.false;
      expect(validator.isArrayNotEmpty({})).to.be.false;
      expect(validator.isArrayNotEmpty(undefined)).to.be.false;
    });
  });

  describe('validator.isArrayOf', () => {
    it('it should return true', () => {
      expect(validator.isArrayOf([], [Number])).to.be.true;
      expect(validator.isArrayOf([{}], [Object])).to.be.true;
    });
    it('it should return false', () => {
      expect(validator.isArrayOf(undefined, [Object])).to.be.false;
      expect(validator.isArrayOf({}, [Object])).to.be.false;
      expect(validator.isArrayOf([1], [String])).to.be.false;
    });
  });

  describe('validator.isObject', () => {
    it('it should return true', () => {
      expect(validator.isObject({})).to.be.true;
    });
    it('it should return false', () => {
      expect(validator.isObject([])).to.be.false;
    });
  });

  describe('validator.isNumber', () => {
    it('it should return true', () => {
      expect(validator.isNumber(0)).to.be.true;
      expect(validator.isNumber(1)).to.be.true;
      expect(validator.isNumber(1.1)).to.be.true;
      expect(validator.isNumber(-1)).to.be.true;
      expect(validator.isNumber(-1.1)).to.be.true;
    });
    it('it should return false', () => {
      expect(validator.isNumber('1')).to.be.false;
      expect(validator.isNumber([])).to.be.false;
      expect(validator.isNumber(NaN)).to.be.false;
    });
  });

  describe('validator.isInt', () => {
    it('it should return true', () => {
      expect(validator.isInt(0)).to.be.true;
      expect(validator.isInt(1)).to.be.true;
    });
    it('it should return false', () => {
      expect(validator.isInt([])).to.be.false;
      expect(validator.isInt(NaN)).to.be.false;
      expect(validator.isInt('10')).to.be.false;
      expect(validator.isInt('10.1')).to.be.false;
      expect(validator.isInt(1.1)).to.be.false;
      expect(validator.isInt(-1.1)).to.be.false;
    });
  });

  describe('validator.isUint', () => {
    it('it should return true', () => {
      expect(validator.isUint(0)).to.be.true;
      expect(validator.isUint(1)).to.be.true;
    });
    it('it should return false', () => {
      expect(validator.isUint([])).to.be.false;
      expect(validator.isUint(NaN)).to.be.false;
      expect(validator.isUint('-10')).to.be.false;
      expect(validator.isUint('10')).to.be.false;
      expect(validator.isUint('10.1')).to.be.false;
      expect(validator.isUint(-10)).to.be.false;
      expect(validator.isUint(1.1)).to.be.false;
      expect(validator.isUint(-1.1)).to.be.false;
    });
  });

  describe('validator.isString', () => {
    it('it should return true', () => {
      expect(validator.isString('hello')).to.be.true;
    });
    it('it should return false', () => {
      expect(validator.isString(100)).to.be.false;
    });
  });

  describe('validator.isBoolean', () => {
    it('it should return true', () => {
      expect(validator.isBoolean(true)).to.be.true;
      expect(validator.isBoolean(false)).to.be.true;
    });
    it('it should return false', () => {
      expect(validator.isString(100)).to.be.false;
    });
  });

  describe('validator.isBuffer', () => {
    const buffer = Buffer.from([1, 2, 3]);
    const emptyBuffer = Buffer.from('');

    it('it should return true', () => {
      expect(validator.isBuffer(buffer)).to.be.true;
      expect(validator.isBuffer(emptyBuffer)).to.be.true;
    });
    it('it should return false', () => {
      expect(validator.isBuffer(100)).to.be.false;
    });
  });

  describe('validator.isDate', () => {
    it('it should return true', () => {
      expect(validator.isDate(new Date())).to.be.true;
    });
    it('it should return false', () => {
      expect(validator.isDate(100)).to.be.false;
    });
  });

  describe('validator.isFunc', () => {
    it('it should return true', () => {
      expect(validator.isFunc(() => {})).to.be.true;
    });
    it('it should return false', () => {
      expect(validator.isFunc(100)).to.be.false;
    });
  });

  describe('validator.isStream', () => {
    it('it should return true', () => {
      expect(validator.isStream(new Writable())).to.be.true;
    });
    it('it should return false', () => {
      expect(validator.isStream(100)).to.be.false;
    });
  });

  describe('validator.isId', () => {
    it('it should return true', () => {
      expect(validator.isId('5fb000f9c42f3a6bf417ba32')).to.be.true;
    });
    it('it should return false', () => {
      expect(validator.isUuid('58fd9f49-825e-4f20-880d')).to.be.false;
    });
  });

  describe('validator.isUuid', () => {
    it('it should return true', () => {
      expect(validator.isUuid('c4e3720a-6b3c-4ab4-8f6c-d3ce6e65dea6')).to.be.true;
    });
    it('it should return false', () => {
      expect(validator.isUuid('5fb000f9c42f3a6bf417ba32')).to.be.false;
    });
  });

  describe('validator.isUrl', () => {
    it('it should return true', () => {
      expect(validator.isUrl('http://google.com/')).to.be.true;
      expect(validator.isUrl('http://go')).to.be.true;
      expect(validator.isUrl('http://localhost')).to.be.true;
      expect(validator.isUrl('http://192.168.0.1')).to.be.true;
      expect(validator.isUrl('https://google.com/')).to.be.true;
      expect(validator.isUrl('ftp://google.com/')).to.be.true;
      expect(validator.isUrl('ftps://google.com/')).to.be.true;
    });
    it('it should return false', () => {
      expect(validator.isUrl({})).to.be.false;
      expect(validator.isUrl('')).to.be.false;
      expect(validator.isUrl('h')).to.be.false;
      expect(validator.isUrl('https')).to.be.false;
      expect(validator.isUrl('https://')).to.be.false;
    });
  });

  describe('validator.isIP', () => {
    it('it should return true', () => {
      expect(validator.isIP('128.0.0.1')).to.be.true;
      expect(validator.isIP('192.168.1.1')).to.be.true;
      expect(validator.isIP('192.168.1.255')).to.be.true;
      expect(validator.isIP('255.255.255.255')).to.be.true;
      expect(validator.isIP('0.0.0.0')).to.be.true;
      expect(validator.isIP('1.1.1.01')).to.be.true;
    });
    it('it should return false', () => {
      expect(validator.isIP('https://192.168.1.255')).to.be.false;
      expect(validator.isIP('192.168.1.256')).to.be.false;
      expect(validator.isIP('255.255.255.256')).to.be.false;
      expect(validator.isIP('0.0.0.256')).to.be.false;
    });
  });
});
