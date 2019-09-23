import React, { useEffect, useRef } from 'react'
import styled from 'styled-components'
import { select } from 'd3-selection'
import { scaleLinear, scaleOrdinal } from 'd3-scale'
import { max } from 'd3-array'
import { axisBottom, axisLeft } from 'd3-axis'

const PageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
`

const BarChart = ({ data, size }) => {
  const node = useRef(null)
  const frameData = data.map(({ totalFrames }) => totalFrames - 30)
  const characterNames = data.map(({ characterName }) => characterName)

  const createBarChart = () => {
    const dataMax = max(frameData)
    const xRange = characterNames.map((d, i) => i * ((700 - 25)/characterNames.length))
    const y = scaleLinear()
      .domain([dataMax, 0])
      .range([0, 400])
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
      .attr('height', d => 400 - y(d.totalFrames - 30))
      .attr('width', (700 - 25)/data.length)
      .attr('transform', 'translate(25, 0)') // translate 25px to make space for the y axis

    select(node.current)
      .append('g')
      .attr('class', 'y axis')
      .attr('transform', 'translate(25, 0)') // translate 25px to see y axis
      .call(yAxis)
      
    select(node.current)
      .append('g')
      .attr('class', 'x axis')
      .attr('transform', 'translate(25, 400)') // transform 25px to right and 400 px up to see x axis
      .call(xAxis)
      .selectAll('text') // doing all these fancy stuff so the names can fit
        .style('text-anchor', 'end')
        .attr('dx', '-0.25rem')
        .attr('dy', '0.5rem')
        .attr('transform', 'rotate(-64)')
  }

  useEffect(() => {
    createBarChart()
  }, [data, size])

  return (
    <PageContainer>
      <svg ref={node} width='700' height='500'>
      </svg>
    </PageContainer>
  )
}

export default BarChart