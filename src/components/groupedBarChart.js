import React, { useEffect, useRef } from 'react'
import { scaleLinear, scaleBand, scaleOrdinal } from 'd3-scale'
import { max } from 'd3-array'
import { select } from 'd3-selection'
import { transition } from 'd3-transition'
import { axisBottom, axisLeft } from 'd3-axis'
import responsivefy from '../utility/responsivefy'

const GroupedBarChart = ({data, colours}) => {
  const node = useRef()
  const actionNames = data[0].frameData.map(({ action }) => action)

  const createGroupedBarChart = () => {
    const margin = {top: 100, right: 0, bottom: 60, left: 25}
    const width = node.current.parentNode.offsetWidth - margin.left - margin.right
    const height = node.current.parentNode.offsetHeight - margin.top - margin.bottom
    const barPadding = 0.2
    const axisTicks = {qty: 5, outerSize: 0}
		const maxValue = max(data, ({ frameData }) => max(frameData.map(({ totalFrames }) => totalFrames)))

    // set up the color palette
    const colourPalette = scaleOrdinal()
      .domain(actionNames)
      .range(colours)
    // this is for all the characters in the roster, the domain is all the character names
    // and the range is split along the width of the container
    const characterScale = scaleBand()
      .domain(data.map(d => d.character))
      .range([0, width])
      .padding(barPadding)
    // this is for the variants we are measuring, the domain right now is fair and bair and
    // and the range is the width of the band of each character slot.
    const actionScale = scaleBand()
      .domain(actionNames)
      .range([0, characterScale.bandwidth()])
    const yScale = scaleLinear()
      .domain([0, maxValue])
      .range([height, 0])

    const xAxis = axisBottom(characterScale)
      .tickSizeOuter(axisTicks.outerSize)
    const yAxis = axisLeft(yScale)
      .ticks(axisTicks.qty)
      .tickSizeOuter(axisTicks.outerSize)

    select(node.current)
      .call(() => responsivefy(node.current))
    
    // sets up the x positioning of each character name along 
    // the width of the container with transitions
    const t = transition()
      .duration(750)

    const characters = select(node.current)
      .selectAll('.character_name')
      .data(data)
      .join('g')
        .attr('class', 'character_name')
        .attr('transform', d => `translate(${characterScale(d.character)}, 0)`)
    
    characters
      .selectAll('rect')
      // the data here is an extension from the data from above
      // which is why its doing a call back to destructure it
      .data(d => d.frameData) 
      .join(
        enter => enter
          .append('rect')
          .style('fill', d => colourPalette(d.action))
          .attr('x', d => actionScale(d.action))
          .attr('y', yScale(0))
          .attr('width', actionScale.bandwidth())
          .attr('height', height - yScale(0))
          .attr('transform', `translate(${margin.left}, ${margin.top})`)
          .call(enter => enter
            .transition(t)
            .attr('y', d => yScale(d.totalFrames))
            // so why it calculates it this way is because the y axis is flipped. So when looking
            // at the yScale domain and range, the larger the value in the input for domain, the smaller
            // the value will be in the output of the range
            .attr('height', d => height - yScale(d.totalFrames))
          ),
        update => update
          .call(update => update
            .transition(t)
            .attr('x', d => actionScale(d.action))
            .attr('y', d => yScale(d.totalFrames))
            .attr('width', actionScale.bandwidth())
            .attr('height', d => height - yScale(d.totalFrames))
          ),
        exit => exit
          .transition(t)
          .attr('y', yScale(0))
          .attr('height', height - yScale(0))
      )


    // set up the axes
    select(node.current)
      .append('g')
      .attr('class', 'y axis')
      .attr('transform', `translate(${margin.left}, ${margin.top})`)
      .call(yAxis)

    select(node.current)
      .append('g')
      .attr('class', 'x axis')
      .attr('transform', `translate(${margin.left}, ${height + margin.top})`)
      .call(xAxis)   
      .selectAll('text') // doing all these fancy stuff so the names can fit
        .style('text-anchor', 'end')
        .attr('dx', '-0.25rem')
        .attr('dy', '0.25rem')
				.attr('transform', 'rotate(-64)')

		select(node.current)
			.selectAll('.x')
			.transition()
			.call(xAxis)
		
		select(node.current)
			.selectAll('.y')
			.transition()
			.call(yAxis)
    
    // set up the legend
    select(node.current)
      .selectAll('.legend_square')
      .data(actionNames)
      .join('rect')
        .attr('class', 'legend_square')
        .style('fill', d => colourPalette(d))
        .attr('width', 15)
        .attr('height', 5)
        .attr('x', width - 100)
        .attr('y', (d, i) => (i * 20) + 15)
    
    select(node.current)
      .selectAll('.legend_text')
      .data(actionNames)
      .join('text')
        .attr('class', 'legend_text')
        .text(d => d)
        .style('fill', d => colourPalette(d))
        .style('text-anchor', 'left')
        .style('alignment-baseline', 'middle')
        .style('font-family', 'sans-serif')
        .attr('x', width - 80)
        .attr('y', (d, i) =>  (i * 20) + 18 )

  }

  useEffect(() => {
    createGroupedBarChart()
  }, [data])

  return (
    <svg ref={node} />
  )
}

export default GroupedBarChart
