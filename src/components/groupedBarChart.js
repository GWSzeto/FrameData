import React, { useEffect, useRef } from 'react'
import { scaleLinear, scaleBand } from 'd3-scale'
import { max } from 'd3-array'
import { select } from 'd3-selection'
import { axisBottom, axisLeft } from 'd3-axis'
import responsivefy from '../utility/responsivefy'

const GroupedBarChart = ({data}) => {
  const node = useRef()

  const createBarChart = () => {
    const margin = {top: 0, right: 0, bottom: 50, left: 25}
    const width = node.current.parentNode.offsetWidth - margin.left - margin.right
    const height = node.current.parentNode.offsetHeight - margin.top - margin.bottom
    const barPadding = 0.2
    const axisTicks = {qty: 5, outerSize: 0}
    const maxValue = max(data, d => d.fair > d.bair ? d.fair : d.bair)

    const xScale0 = scaleBand()
      .domain(data.map(d => d.characterName))
      .range([0, width])
      .padding(barPadding)
    const xScale1 = scaleBand()
      .domain(['fair', 'bair'])
      .range([0, xScale0.bandwidth()])
    const yScale = scaleLinear()
      .domain([0, maxValue])
      .range([height, 0])
    const xAxis = axisBottom(xScale0)
      .tickSizeOuter(axisTicks.outerSize)
    const yAxis = axisLeft(yScale)
      .ticks(axisTicks.qty)
      .tickSizeOuter(axisTicks.outerSize)

    select(node.current)
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .call(() => responsivefy(node.current))
    
    const characterNames = select(node.current)
      .selectAll('.character_name')
      .data(data)
      .enter()
      .append('g')
      .attr('class', 'character_name')
      .attr('transform', d =>  `translate(${xScale0(d.characterName)}, 0)`)
    
    characterNames
      .selectAll('.bar.fair')
      .data(d => [d])
      .enter()
      .append('rect')
      .attr('class', 'bar fair')
      .style('fill', 'blue')
        .attr('x', d => xScale1('fair'))
        .attr('y', d => yScale(d.fair))
        .attr('width', xScale1.bandwidth())
        .attr('height', d => height - yScale(d.fair))
        .attr('transform', `translate(${margin.left}, 0)`)
    
    characterNames
      .selectAll('.bar.bair')
      .data(d => [d])
      .enter()
      .append('rect')
      .attr('class', 'bar bair')
      .style('fill', 'red')
        .attr('x', d => xScale1('bair'))
        .attr('y', d => yScale(d.bair))
        .attr('width', xScale1.bandwidth())
        .attr('height', d => height - yScale(d.bair))
        .attr('transform', `translate(${margin.left}, 0)`)
    
    select(node.current)
      .append('g')
      .attr('class', 'y axis')
      .attr('transform', `translate(${margin.left}, 0)`)
      .call(yAxis)

    select(node.current)
      .append('g')
      .attr('class', 'x axis')
      .attr('transform', `translate(${margin.left}, ${height})`)
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
    <svg ref={node} />
  )
}

export default GroupedBarChart
