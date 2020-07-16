import React from "react"
import ReactPlayer from "react-player"

/*
  Renders video player
  Documentation: https://github.com/CookPete/react-player
*/
const ResponsivePlayer = ({url}) => {
      return (
        <div className='player-wrapper'>
            <ReactPlayer
                className='react-player'
                url={url}
                controls={true}
            />
        </div>
      )
  }

export default ResponsivePlayer