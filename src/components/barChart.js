import React, { useEffect, useRef } from 'react'
import { select } from 'd3-selection'
import { scaleLinear, scaleOrdinal } from 'd3-scale'
import { max } from 'd3-array'
import { axisBottom, axisLeft } from 'd3-axis'
import responsivefy from '../utility/responsivefy'

const BarChart = ({ data }) => {
  const node = useRef(null)
  const frameData = data.map(({ totalFrames }) => totalFrames - 30)
  const characterNames = data.map(({ characterName }) => characterName)

  const createBarChart = () => {
    const margin = {top: 0, right: 0, bottom: 50, left: 25}
    const width = node.current.parentNode.offsetWidth - margin.left - margin.right
    const height = node.current.parentNode.offsetHeight - margin.top - margin.bottom

    const dataMax = max(frameData)
    const xRange = characterNames.map((d, i) => i * (width/characterNames.length))
    const y = scaleLinear()
      .domain([dataMax, 0])
      .range([0, height])
    const x = scaleOrdinal()
      .domain(characterNames)
      .range(xRange)
    const xAxis = axisBottom(x)
      .ticks(characterNames)
    const yAxis = axisLeft(y)
      .ticks()

    select(node.current)
      .selectAll('rect')
      .data(data)
      .enter()
      .append('rect')

    select(node.current)
      .selectAll('rect')
      .data(data)
      .exit()
      .remove()
    
    select(node.current)
      .selectAll('rect')
      .data(data)
      .style('fill', '#578ED2')
      .attr('x', (d, i) => x(d.characterName))
      .attr('y', (d, i) => y(d.totalFrames - 30))
      .attr('height', d => height - y(d.totalFrames - 30))
      .attr('width', width/data.length)
      .attr('transform', `translate(${margin.left}, 0)`) // translate 25px to make space for the y axis
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