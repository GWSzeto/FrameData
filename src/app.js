import React from 'react'
import BarChart from './components/barChart'
import fd from '../frameData'

const App = () => {
  const fairData = Object.keys(fd)
    .reduce((acc, characterName) => ({ ...acc, [characterName]: fd[characterName].fair}), {})
  const fairTotalFrames = Object.keys(fairData)
    .map(characterName => ({ characterName, totalFrames: fairData[characterName].totalFrames}))
  console.log("fair data: ", fairTotalFrames)
  return (
    <BarChart
      data={fairTotalFrames}
      size={[500, 500]}
    />
  )
}

export default App
