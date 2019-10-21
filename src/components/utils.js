export default {
  propercase: text => text.split('').map((item, index) => (index === 0 ? item.toUpperCase() : item)).join(''),
};
