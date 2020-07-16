import React from "react"

/*
  Renders the file submission button and enhance button
*/

const SubmissionForm = ({handleSubmit, handleFile}) => {
    return (
        <div className="row-center">
          <form className="form" onSubmit={handleSubmit}>
            <div className="file-input">
              <label>Select A File</label>
              <input type="file" name="file" onChange={handleFile}/>
            </div>
            <button>Enhance</button>
          </form>
        </div>
    )
}

export default SubmissionForm