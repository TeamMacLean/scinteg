var FileInput = React.createClass({displayName: "FileInput",
  render: function () {
    return (
      React.createElement("fieldset", null,
        React.createElement("input", {name: "attachment[]", className: "deletable", type: "file", key: this.props.index,
          onChange: this.props.onChange.bind(this,this.props.index)})
      )
    )
  }
});

var UploadApp = React.createClass({displayName: "UploadApp",
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
      React.createElement("div", null,
        self.state.files.map(function (file, i) {
          return (
            React.createElement(FileInput, {index: i, onChange: self.onChange})
          )
        })
      )

    )

  }
});
React.render(React.createElement(UploadApp, null), document.getElementById('upload-area'));