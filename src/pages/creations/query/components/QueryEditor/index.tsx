import MonacoEditor from 'react-monaco-editor';
import {
  Button
} from 'antd';
import {CodeOutlined, ExpandOutlined, FullscreenOutlined} from "@ant-design/icons";
const QueryEditor = () => {
  return (
    <div>
      <MonacoEditor
        width={'800px'}
        height={'400'}
        language="sql"
        theme="vs-dark"

      // value={code}
        // options={options}
        // onChange={::this.onChange}
        // editorDidMount={::this.editorDidMount}
      />
      <Button icon={<ExpandOutlined />}>Expand</Button>
      <Button icon={<CodeOutlined />}>Run</Button>
      <Button icon={<FullscreenOutlined />}>Full Screen</Button>
    </div>

  )
}


export default QueryEditor
