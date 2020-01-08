import { select } from 'd3-selection'

export default svg => {
  // container will be the DOM element
  // that the svg is appended to
  // we then measure the container
  // and find its aspect ratio
  const node = select(svg)
  const container = svg.parentNode
  const width = container.offsetWidth
  const height = container.offsetHeight
  const aspect = width/height

  // set viewBox attribute to the initial size
  // control scaling with preserveAspectRatio
  // resize svg on inital page load
  node
    .attr('viewBox', `0 0 ${width} ${height}`)
    .attr('preserveAspectRatio', 'xMinYMid')
    .call(resize);

  // add a listener so the chart will be resized
  // when the window resizes
  // multiple listeners for the same event type
  // requires a namespace, i.e., 'click.foo'
  // api docs: https://goo.gl/F3ZCFr
  select(window).on(
      'resize.' + select(container).attr('class'), 
      resize
  );

  // this is the code that resizes the chart
  // it will be called on load
  // and in response to window resizes
  // gets the width of the container
  // and resizes the svg to fill it
  // while maintaining a consistent aspect ratio
  function resize() {
      const w = parseInt(container.offsetWidth);
      node.attr('width', w);
      node.attr('height', Math.round(w / aspect));
  }
}