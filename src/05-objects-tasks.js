/* ************************************************************************************************
 *                                                                                                *
 * Please read the following tutorial before implementing tasks:                                   *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object        *
 *                                                                                                *
 ************************************************************************************************ */


/**
 * Returns the rectangle object with width and height parameters and getArea() method
 *
 * @param {number} width
 * @param {number} height
 * @return {Object}
 *
 * @example
 *    const r = new Rectangle(10,20);
 *    console.log(r.width);       // => 10
 *    console.log(r.height);      // => 20
 *    console.log(r.getArea());   // => 200
 */
function Rectangle(width, height) {
  this.width = width;
  this.height = height;

  this.getArea = function multiply() {
    return this.width * this.height;
  };
}


/**
 * Returns the JSON representation of specified object
 *
 * @param {object} obj
 * @return {string}
 *
 * @example
 *    [1,2,3]   =>  '[1,2,3]'
 *    { width: 10, height : 20 } => '{"height":10,"width":20}'
 */
function getJSON(obj) {
  return JSON.stringify(obj);
}


/**
 * Returns the object of specified type from JSON representation
 *
 * @param {Object} proto
 * @param {string} json
 * @return {object}
 *
 * @example
 *    const r = fromJSON(Circle.prototype, '{"radius":10}');
 *
 */
function fromJSON(proto, json) {
  const parsedJSON = JSON.parse(json);

  return Object.assign(Object.create(proto), parsedJSON);
}


/**
 * Css selectors builder
 *
 * Each complex selector can consists of type, id, class, attribute, pseudo-class
 * and pseudo-element selectors:
 *
 *    element#id.class[attr]:pseudoClass::pseudoElement
 *              \----/\----/\----------/
 *              Can be several occurrences
 *
 * All types of selectors can be combined using the combination ' ','+','~','>' .
 *
 * The task is to design a single class, independent classes or classes hierarchy
 * and implement the functionality to build the css selectors using the provided cssSelectorBuilder.
 * Each selector should have the stringify() method to output the string representation
 * according to css specification.
 *
 * Provided cssSelectorBuilder should be used as facade only to create your own classes,
 * for example the first method of cssSelectorBuilder can be like this:
 *   element: function(value) {
 *       return new MySuperBaseElementSelector(...)...
 *   },
 *
 * The design of class(es) is totally up to you, but try to make it as simple,
 * clear and readable as possible.
 *
 * @example
 *
 *  const builder = cssSelectorBuilder;
 *
 *  builder.id('main').class('container').class('editable').stringify()
 *    => '#main.container.editable'
 *
 *  builder.element('a').attr('href$=".png"').pseudoClass('focus').stringify()
 *    => 'a[href$=".png"]:focus'
 *
 *  builder.combine(
 *      builder.element('div').id('main').class('container').class('draggable'),
 *      '+',
 *      builder.combine(
 *          builder.element('table').id('data'),
 *          '~',
 *           builder.combine(
 *               builder.element('tr').pseudoClass('nth-of-type(even)'),
 *               ' ',
 *               builder.element('td').pseudoClass('nth-of-type(even)')
 *           )
 *      )
 *  ).stringify()
 *    => 'div#main.container.draggable + table#data ~ tr:nth-of-type(even)   td:nth-of-type(even)'
 *
 *  For more examples see unit tests.
 */
class Builder {
  constructor() {
    this.elementDOM = '';
    this.idDOM = '';
    this.classDOM = [];
    this.attrDOM = [];
    this.pseudoClassDOM = [];
    this.pseudoElementDOM = '';
    this.combineSelectors = '';
    this.error1 = 'Element, id and pseudo-element should not occur more then one time inside the selector';
    this.error2 = 'Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element';
  }

  element(value) {
    if (this.elementDOM) throw new Error(this.error1);
    if (
      this.idDOM
      || this.classDOM.length
      || this.attrDOM.length
      || this.pseudoClassDOM.length
      || this.pseudoElementDOM
    ) throw new Error(this.error2);
    this.elementDOM = value;

    return this;
  }

  id(value) {
    if (this.idDOM) throw new Error(this.error1);
    if (
      this.classDOM.length
      || this.attrDOM.length
      || this.pseudoClassDOM.length
      || this.pseudoElementDOM
    ) throw new Error(this.error2);
    this.idDOM = value;

    return this;
  }

  class(value) {
    if (
      this.attrDOM.length
      || this.pseudoClassDOM.length
      || this.pseudoElementDOM
    ) throw new Error(this.error2);
    this.classDOM.push(value);

    return this;
  }

  attr(value) {
    if (this.pseudoClassDOM.length || this.pseudoElementDOM) throw new Error(this.error2);
    this.attrDOM.push(value);

    return this;
  }

  pseudoClass(value) {
    if (this.pseudoElementDOM) throw new Error(this.error2);
    this.pseudoClassDOM.push(value);

    return this;
  }

  pseudoElement(value) {
    if (this.pseudoElementDOM) throw new Error(this.error1);
    this.pseudoElementDOM = value;

    return this;
  }

  combine(selector1, combinator, selector2) {
    this.combineSelectors = `${selector1.stringify()} ${combinator} ${selector2.stringify()}`;

    return this;
  }

  stringify() {
    let res = '';
    if (this.combineSelectors) return this.combineSelectors;
    if (this.elementDOM) res += this.elementDOM;
    if (this.idDOM) res += `#${this.idDOM}`;
    if (this.classDOM.length) res += [...this.classDOM].map((el) => `.${el}`).join('');
    if (this.attrDOM.length) res += `[${[...this.attrDOM]}]`.split(',').join('][');
    if (this.pseudoClassDOM) res += [...this.pseudoClassDOM].map((el) => `:${el}`).join('');
    if (this.pseudoElementDOM) res += `::${this.pseudoElementDOM}`;

    return res;
  }
}

const cssSelectorBuilder = {
  element(value) {
    return new Builder().element(value);
  },

  id(value) {
    return new Builder().id(value);
  },

  class(value) {
    return new Builder().class(value);
  },

  attr(value) {
    return new Builder().attr(value);
  },

  pseudoClass(value) {
    return new Builder().pseudoClass(value);
  },

  pseudoElement(value) {
    return new Builder().pseudoElement(value);
  },

  combine(selector1, combinator, selector2) {
    return new Builder().combine(selector1, combinator, selector2);
  },
};


module.exports = {
  Rectangle,
  getJSON,
  fromJSON,
  cssSelectorBuilder,
};
