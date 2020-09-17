import _ from 'lodash';

const formatObj = (obj, space) => {
  const increaseSpace = 4;
  const formattedObj = Object.entries(obj)
    .map(([key, value]) => (`${' '.repeat(space + increaseSpace)}${key}: ${value}\n`));
  return `{\n${formattedObj.join('\n')}${' '.repeat(space)}}`;
};

const addPrefix = (indent, symbol = '', prefix = '') => `${' '.repeat(indent)}${symbol}${prefix}`;

const formatValue = (value, space) => (_.isObject(value) ? formatObj(value, space) : value);

const formatToStylish = (tree) => {
  const iter = (data, depth) => {
    const indent = 2;
    const space = depth === 1 ? depth * indent : depth * indent + indent;
    const formattedTree = data
      .map((node) => {
        const {
          name, type, value, oldValue, newValue, children,
        } = node;
        switch (type) {
          case 'deleted':
            return `${addPrefix(space, '-')} ${name}: ${formatValue(value, space + indent)}`;
          case 'added':
            return `${addPrefix(space, '+')} ${name}: ${formatValue(value, space + indent)}`;
          case 'modified':
            return `${addPrefix(space, '-')} ${name}: ${formatValue(oldValue, space + indent)}\n${addPrefix(space, '+')} ${name}: ${formatValue(newValue, space + indent)}`;
          case 'unmodified':
            return `${addPrefix(space)}  ${name}: ${formatValue(value, space + indent)}`;
          case 'nested':
            return `${addPrefix(space)}  ${name}: ${iter(children, depth + 1)}`;
          default:
            throw new Error(`unexpected type: ${type}`);
        }
      });
    return `{\n${formattedTree.join('\n')}\n${' '.repeat(space - indent)}}`;
  };
  return iter(tree, 1);
};

export default formatToStylish;
