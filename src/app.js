import React, { useState } from 'react'
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
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
`

const Graph = styled.div`
  grid-area: barGraph;
  height: 700px;
  width: 1000px;
`

const mixedData = Object.keys(fd)
  .map(character => ({ 
    character,
    frameData: [
      { 
        action: 'fair',
        totalFrames: fd[character].fair.totalFrames,
      },
      {
        action: 'uair',
        totalFrames: fd[character].uair.totalFrames, 
      },
      {
        action: 'bair',
        totalFrames: fd[character].bair.totalFrames,
      },
      {
        action: 'dair',
        totalFrames: fd[character].dair.totalFrames,
      },
      {
        action: 'nair',
        totalFrames: fd[character].nair.totalFrames,
      },
    ]
  }))

const App = () => {
  const [data, setData] = useState(mixedData)
  const [fair, setFair] = useState(true)

  const colours = ['#FFCDB2', '#FFB4A2', '#E5989B', '#B5838D', '#6D6875']

  const addFair = () => {
    setFair(true)
    setData(mixedData)
  }
  const removeFair = () => {
    setFair(false)
    const updatedData =  Object.keys(fd)
    .map(character => ({ 
      character,
      frameData: [
        {
          action: 'uair',
          totalFrames: fd[character].uair.totalFrames, 
        },
        {
          action: 'bair',
          totalFrames: fd[character].bair.totalFrames,
        },
        {
          action: 'dair',
          totalFrames: fd[character].dair.totalFrames,
        },
        {
          action: 'nair',
          totalFrames: fd[character].nair.totalFrames,
        },
      ]
    }))
    setData(updatedData)
  }

  const falconData = [
    {
      action: 'uair',
      totalFrames: fd.CaptainFalcon.uair.totalFrames,
    },
    {
      action: 'bair',
      totalFrames: fd.CaptainFalcon.bair.totalFrames,
    },
    {
      action: 'dair',
      totalFrames: fd.CaptainFalcon.dair.totalFrames,
    },
    {
      action: 'nair',
      totalFrames: fd.CaptainFalcon.nair.totalFrames,
    },
  ]

  return (
    <PageContainer>
      <Graph>
        {/* <GroupedBarChart data={data} colours={colours}/> */}
        <BarChart data={falconData}/>
      </Graph>
      <button onClick={() => fair ? removeFair() : addFair()}>{fair ? 'Remove Fair' : 'Add Fair'}</button>
    </PageContainer>
  )
}

export default App
