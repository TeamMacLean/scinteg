var FileInput = React.createClass({
  render: function () {
    return (
      <fieldset>
        <input name="attachment[]" className="deletable" type="file" key={this.props.index}
               onChange={this.props.onChange.bind(this,this.props.index)}></input>
      </fieldset>
    )
  }
});

var UploadApp = React.createClass({
  getInitialState: function () {
    return {files: ['0']};
  },
  onChange: function (index) {
    var newFiles = this.state.files.concat([index]);
    this.setState({files: newFiles});
    console.log(this.state);
  },
  render: function () {
    var self = this;
    return (
      <div>
        {self.state.files.map(function (file, i) {
          return (
            <FileInput index={i} onChange={self.onChange}/>
          )
        })}
      </div>

    )

  }
});
React.render(<UploadApp/>, document.getElementById('upload-area'));