import React from 'react'
import styled from 'styled-components'
import BarChart from './components/barChart'
import fd from '../frameData'

const PageContainer = styled.div`
  display: grid;
  grid:
    ".....   .....   ....." 1fr
    ".....  barGraph ....." 1fr
    ".....   .....   ....." 1fr /
      1fr     1fr      1fr;
  min-height: 100vh;
`

const Graph = styled.div`
  grid-area: barGraph;
`

const App = () => {
  const fairData = Object.keys(fd)
    .reduce((acc, characterName) => ({ ...acc, [characterName]: fd[characterName].fair}), {})
  const fairTotalFrames = Object.keys(fairData)
    .map(characterName => ({ characterName, totalFrames: fairData[characterName].totalFrames}))
  console.log("fair data: ", fairTotalFrames)
  return (
    <PageContainer>
      <Graph>
        <BarChart
          data={fairTotalFrames}
          size={[500, 500]}
        />
      </Graph>
    </PageContainer>
  )
}

export default App
