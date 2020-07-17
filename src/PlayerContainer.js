import axios from "axios"
import React, {Component} from "react"
import Video from "./files/enhanced_video.mp4"
import SubmissionForm from "./components/SubmissionForm"
import ResponsivePlayer from "./components/ResponsivePlayer"

const REACT_APP_DOLBY_API_KEY = process.env.REACT_APP_DOLBY_API_KEY

class PlayerContainer extends Component {
  constructor() {
    super()
    this.state ={
      regularUrl: '/',
      enhancedUrl: Video,
      file: null,
      progress: -1
    }
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleFile = this.handleFile.bind(this)
  }

/*handlesubmit() {
    1. POST - Create url on Dolby API for storing file
    2. PUT - Upload the selected video file to https://api.dolby.com/media/input 
        and store returned presigned url for file storage as serverUrl
        - Capture upload progress and store in state
    3. POST - Make a request to Dolby API to enhance video providing
        an input and output director for the enhancement process
    4. GET - Pull enhanced file from Dolby API
        - Store new file in state
}*/
  async handleSubmit(event) {
      
    event.preventDefault()

    if (this.state.file) {

        const serverUrl = await axios({
            method: "POST",
            url: "https://api.dolby.com/media/input",
            data: { url: `dlb://${this.state.file.name}` },
            headers: { "x-api-key": REACT_APP_DOLBY_API_KEY }
        })
        .then(res => {return res.data.url})
        .catch(err => console.error(err))

        await axios({
            method: "PUT",
            url: serverUrl,
            data: this.state.file,
            onUploadProgress: ProgressEvent => {
                this.setState({
                    progress: Math.round(ProgressEvent.loaded / ProgressEvent.total * 100)
                })
            }
        })
        .catch(err => console.error(err))

        const input = `dlb://${this.state.file.name}`
        const output = `dlb://enhanced${this.state.file.name}`
        
        await axios({
            method: "POST",
            url: "https://api.dolby.com/media/enhance",
            data: {input: input, output: output},
            headers: {"x-api-key": REACT_APP_DOLBY_API_KEY}
        })

        await axios({
            method: "POST",
            url: "http://localhost:5000/",
            data: {
                url: output
            },
        })
        .then(() => { this.setState( { enhancedUrl: Video })})
        .catch(err => console.error(err))
    }
}

/* handlefile() { // Store the file provided in state
    file: The actual file
    regularUrl: the directory of the file provided this
                is used for providing react-player a source
}*/
async handleFile(event) {

    const file = event.target.files[0]

    await this.setState({
        file: file,
        regularUrl: URL.createObjectURL(file)
    })
}

render() {
  return (
    <div>
        <SubmissionForm 
          handleSubmit={this.handleSubmit}
          handleFile={this.handleFile}
          />
        <div className="row-center">
          <ResponsivePlayer url={this.state.regularUrl} />
          <ResponsivePlayer url={this.state.enhancedUrl} />
        </div>
          {this.state.progress > -1 && <p className="progress-text">Upload progress: {this.state.progress}%</p>}
      </div>
    )
  }
}

export default PlayerContainer;