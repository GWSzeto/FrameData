import React from 'react'
import styled from 'styled-components'
import BarChart from './components/barChart'
import GroupedBarChart from './components/groupedBarChart'
import fd from '../frameData'

const PageContainer = styled.div`
  /* display: grid;
  grid:
    " barGraph  ....." 50vh
    "  .....    ....." 50vh /
        50vw    50vw; */
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
`

const Graph = styled.div`
  grid-area: barGraph;
  height: 500px;
  width: 700px;
`

const App = () => {
  const mixedData = Object.keys(fd)
    .map(characterName => ({ characterName, fair: fd[characterName].fair.totalFrames, bair: fd[characterName].bair.totalFrames}))
  console.log("data in app: ", mixedData)
  return (
    <PageContainer>
      <Graph>
        <GroupedBarChart data={mixedData} />
        {/* <BarChart
          data={fairTotalFrames}
        /> */}
      </Graph>
    </PageContainer>
  )
}

export default App
