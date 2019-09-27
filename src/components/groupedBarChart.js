import React, { useEffect, useRef } from 'react'
import { scaleLinear, scaleBand, scaleOrdinal } from 'd3-scale'
import { max } from 'd3-array'
import { select } from 'd3-selection'
import { axisBottom, axisLeft } from 'd3-axis'
import responsivefy from '../utility/responsivefy'

const GroupedBarChart = ({data, colours}) => {
  const node = useRef()
  const actionNames = Object.keys(data[0])
    .filter(actionName => actionName !== 'character')

  const createBarChart = () => {
    const margin = {top: 100, right: 0, bottom: 60, left: 25}
    const width = node.current.parentNode.offsetWidth - margin.left - margin.right
    const height = node.current.parentNode.offsetHeight - margin.top - margin.bottom
    const barPadding = 0.2
    const axisTicks = {qty: 5, outerSize: 0}
    const maxValue = max(data, ({character, ...actions}) => max(Object.values(actions)))

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
    
    // sets up the x positioning of each character name along the width of the container
    const characters = select(node.current)
      .selectAll('.character_name')
      .data(data)
      .join('g')
        .attr('class', 'character_name')
        .attr('transform', d =>  `translate(${characterScale(d.character)}, 0)`)
    
    // sets ups the x positioning of each action
    actionNames.map((actionName, index) => 
      characters
        .selectAll(`.bar.${actionName}`)
        // the data here is an extension from the data from above (line 48)
        // which is why its doing a call back to destructure it
        .data(d => [d]) 
        .join('rect')
          .attr('class', `bar ${actionName}`)
          .style('fill', colourPalette(actionName))
          .attr('x', d => actionScale(actionName))
          .attr('y', d => yScale(d[actionName]))
          .attr('width', actionScale.bandwidth())
          .attr('height', d => height - yScale(d[actionName]))
          .attr('transform', `translate(${margin.left}, ${margin.top})`)
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
    createBarChart()
  }, [data])

  return (
    <svg ref={node} />
  )
}

export default GroupedBarChart
