import React from 'react'
import styled from 'styled-components'
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
  height: 700px;
  width: 1000px;
`

const App = () => {
  const mixedData = Object.keys(fd)
    .map(character => ({ 
      character, 
      fair: fd[character].fair.totalFrames, 
      uair: fd[character].uair.totalFrames, 
      bair: fd[character].bair.totalFrames,
      nair: fd[character].nair.totalFrames,
      dair: fd[character].dair.totalFrames,
    }))
  const colours = ['#FFCDB2', '#FFB4A2', '#E5989B', '#B5838D', '#6D6875']
  return (
    <PageContainer>
      <Graph>
        <GroupedBarChart data={mixedData} colours={colours}/>
      </Graph>
    </PageContainer>
  )
}

export default App
