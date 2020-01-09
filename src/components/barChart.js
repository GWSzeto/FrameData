import React, { useEffect, useRef } from 'react'
import { select } from 'd3-selection'
import { scaleLinear, scaleBand } from 'd3-scale'
import { max } from 'd3-array'
import { axisBottom, axisLeft } from 'd3-axis'
import responsivefy from '../utility/responsivefy'

const BarChart = ({ data }) => {
  const node = useRef(null)

  const createBarChart = () => {
    const margin = {top: 100, right: 0, bottom: 60, left: 25}
    const width = node.current.parentNode.offsetWidth - margin.left - margin.right
    const height = node.current.parentNode.offsetHeight - margin.top - margin.bottom
    const barPadding = 0.35
    const maxValue = max(data, ({ totalFrames }) => totalFrames)

    const xScale = scaleBand()
      .domain(data.map(d => d.action))
      .range([0, width])
      .padding(barPadding)
    const yScale = scaleLinear()
      .domain([0, maxValue])
      .range([height, 0])
    const xAxis = axisBottom(xScale)
    const yAxis = axisLeft(yScale)

    select(node.current)
      .append('g')
        .attr('fill', 'steelblue')
      .selectAll('rect')
      .data(data)
      .join('rect')
        .attr('x', d => xScale(d.action))
        .attr('y', d => yScale(d.totalFrames))
        .attr('width', xScale.bandwidth())
        .attr('height', d => height - yScale(d.totalFrames))
        .attr('transform', `translate(${margin.left}, 0)`)
    
    select(node.current)
      .call(() => responsivefy(node.current))

    select(node.current)
      .append('g')
      .attr('class', 'y axis')
      .attr('transform', `translate(${margin.left}, 0)`) // translate 25px to see y axis
      .call(yAxis)

    select(node.current)
      .append('g')
      .attr('class', 'x axis')
      .attr('transform', `translate(${margin.left}, ${height})`) // transform 25px to right and 400 px up to see x axis
      .call(xAxis)
      .selectAll('text') // doing all these fancy stuff so the names can fit
        .style('text-anchor', 'end')
        .attr('dx', '-0.25rem')
        .attr('dy', '0.25rem')
        .attr('transform', 'rotate(-64)')
  }

  useEffect(() => {
    createBarChart() 
  }, [data])

  return (
    <svg ref={node}/>
  )
}

export default BarChart