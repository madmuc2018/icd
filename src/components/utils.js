export default {
  propercase: text => text.split('').map((item, index) => (index === 0 ? item.toUpperCase() : item)).join(''),
  taskDuration: duration => {
    const toSeconds = duration / 1000;
    const toMinutes = toSeconds / 60;
    const rounded = Math.round(toMinutes * 100) / 100;
    return rounded;
  },
  timeout: ms => new Promise(resolve => setTimeout(resolve, ms))
};
