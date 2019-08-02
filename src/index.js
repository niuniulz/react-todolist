import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';


const IngItem = function (props) {
  const [content, setContent] = useState(props.content)

  const editContent = (e) => {
    setContent(e.target.value)
    props.editContent(e.target.value)
  }

  return (
    <div className='item'>
      <input type='checkbox' onClick={props.changePos} />
      {props.isEdit ?
        <input type='text' value={content} onChange={e => editContent(e)} placeholder='请输入待办事项' className='input-text' /> :
        <span className='item-content'>{props.content}</span>}
      {props.isEdit ?
        <span><button onClick={props.modifyItem} className='btn'>保存</button> <button onClick={props.modifyCancel} className='btn'>取消</button></span> :
        <span><button onClick={props.editClick} className='btn'>编辑</button><button onClick={props.delClick} className='btn'>删除</button></span>}
    </div>
  )
}

const EdItem = function (props) {
  return (
    <div>
      <input type='checkbox' checked disabled />
      <span className='item-content'>{props.content}</span>
    </div>
  )
}

const List = function () {
  const [itemContent, setItemContent] = useState('')
  const [inglist, setIngList] = useState(JSON.parse(localStorage.getItem('ing-list')) || [])
  const [edlist, setEdList] = useState(JSON.parse(localStorage.getItem('ed-list')) || [])

  let copy = JSON.parse(JSON.stringify(inglist))

  let [content, setContent] = useState('')

  const addItem = () => {
    console.log(content)
    if (!content) {
      alert('请输入内容后再添加！')
      return
    }
    let copy = JSON.parse(JSON.stringify(inglist))
    copy.push({ status: 1, content })
    setIngList(copy)
    localStorage.setItem('ing-list', JSON.stringify(copy))
    setContent('')
  }

  const edit = function (index) {
    let copy = JSON.parse(JSON.stringify(inglist))
    copy[index].isEdit = true
    setIngList(copy)
  }

  const editContent = (val) => {
    console.log(val)
    setItemContent(val)
  }

  /**
   * 将正在进行的任务放入到已完成中
   */
  const changePos = (item, index) => {
    let ingCopy = JSON.parse(JSON.stringify(inglist))
    let edCopy = JSON.parse(JSON.stringify(edlist))
    console.log(edCopy, ingCopy)
    edCopy.push({ status: 2, isEdit: false, content: item.content })
    ingCopy.splice(index, 1)
    setIngList(ingCopy)
    setEdList(edCopy)
    localStorage.setItem('ing-list', JSON.stringify(ingCopy))
    localStorage.setItem('ed-list', JSON.stringify(edCopy))
  }

  const modifyItem = (index) => {
    console.log('mobifyItem={mobifyItem}')
    let copy = JSON.parse(JSON.stringify(inglist))
    copy[index].content = itemContent
    copy[index].isEdit = false
    setIngList(copy)
    localStorage.setItem('ing-list', JSON.stringify(copy))
  }

  const modifyCancel = index => {
    let copy = JSON.parse(JSON.stringify(inglist))
    copy[index].isEdit = false
    setIngList(copy)
  }

  const delClick = index => {
    let copy = JSON.parse(JSON.stringify(inglist))
    copy.splice(index, 1)
    setIngList(copy)
  }
  
  return (
    <div className='list-wrapper'>
      <div className='add-item'>
        <input type='text' value={content} onChange={function (e) { setContent(e.target.value) }} className='input-text' />
        <button className='btn' onClick={addItem}>添加一项</button>
      </div>
      <div className='ing-wrapper'>
        <div>正在进行中</div>
        <ul className='ing'>
          {inglist.map((item, index) =>
            <li className='todo-item' key={index}>
              <IngItem
                changePos={() => changePos(item, index)}
                editClick={() => edit(index)}
                modifyItem={() => modifyItem(index)}
                modifyCancel={() => modifyCancel(index)}
                delClick={() => delClick(index)}
                editContent={editContent}
                isEdit={item.isEdit}
                content={item.content}
                index={index}
              ></IngItem></li>)}
        </ul>
      </div>
      <div className='ed-wrapper'>
        <div>已完成</div>
        <ul className='ed'>
          {edlist.map((item, index) => <li className='todo-item' key={index}><EdItem content={item.content} index={index}></EdItem></li>)}
        </ul>
      </div>
    </div>
  )
}

ReactDOM.render(<div>
  <List></List>
</div>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();