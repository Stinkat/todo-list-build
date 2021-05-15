import React, { useState } from 'react';
import './App.css';
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import _ from "lodash";
import { v4 } from "uuid";
import 'bootstrap/dist/css/bootstrap.min.css';


function TodosApp(props) {
  const [text, setText] = useState("")
  const [description, setDescription] = useState("")


  const [state, setState] = useState({
    "todo": {
      title: "Todo",
      items: []
    }
  })
  const [items, setTodos] = useState([]);


  const handleDragEnd = ({ destination, source }) => {
    if (!destination) {
      return
    }

    if (destination.index === source.index && destination.droppableId === source.droppableId) {
      return
    }

    // Creating a copy of item before removing it from state
    const itemCopy = { ...state[source.droppableId].items[source.index] }

    setState(prev => {
      prev = { ...prev }
      // Remove from previous items array
      prev[source.droppableId].items.splice(source.index, 1)

      console.log(destination.index)
      // Adding to new items array location
      prev[destination.droppableId].items.splice(destination.index, 0, itemCopy)

      return prev
    })
  }

  const addItem = () => {
    setState(prev => {
      return {
        ...prev,
        todo: {
          title: "Todo",
          items: [
            {
              id: v4(),
              name: text,
              desc: description
            },
            ...prev.todo.items
          ]
        }
      }
    })

    setText("")
    setDescription("")
  }

  const removeTodo = (index, items) => {
    const itemToDelete = items.splice(index, 1)

    setTodos(itemToDelete);
  };

  const [edit, setEdit] = useState({
    id: null,
    value: ''
  });

  const editTodo = ({ value }) => {
    console.log(value)
    // updateTodo(edit.id, value);
    // setEdit({
    //   id: null,
    //   value: ''
    // });
    // setTodos(itemToDelete);
  };
  // const updateTodo = (todoId, newValue) => {

  //   console.log(newValue);
  //   if (!newValue.text || /^\s*$/.test(newValue.text)) {
  //     return;
  //   }

  //   setTodos(prev => prev.map(item => (item.id === todoId ? newValue : item)));
  // };



  return (
    <div className="TodosApp" >
    
      <div><h1>Todo List</h1>
        <div className="form-group">
          <input placeholder='Title' className="form-control" type="text" value={text} onChange={(e) => setText(e.target.value)} />
        </div>
        <div className="form-group">
          <textarea placeholder="body" value={description} className="form-control" onChange={(e) => setDescription(e.target.value)} ></textarea>

        </div>
        <button className="btn btn-info" onClick={addItem}>Add</button>
      </div>
      <DragDropContext onDragEnd={handleDragEnd}>
        {_.map(state, (data, key) => {
          return (
            <div key={key} className={"column"}>
              <h3>{data.title}</h3>
              <Droppable droppableId={key}>
                {(provided, snapshot) => {
                  return (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={"droppable-col"}
                    >
                      {data.items.map((el, index) => {
                        return (
                          <Draggable key={el.id} index={index} draggableId={el.id}>
                            {(provided, snapshot) => {
                              // console.log(snapshot)
                              return (
                                <div
                                  className={`item ${snapshot.isDragging && "dragging"}`}
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                >
                                  <div className="border-bottom" > <textarea>{el.name}</textarea></div>       <div>
                                    <textarea>
                                      {el.desc}
                                    </textarea></div>
                                  <button onClick={() => removeTodo(index, data.items)}>Delete</button>
                                  <button onClick={() => setEdit({ id: el.id, value: el.desc })}>Edit</button>
                                </div>

                              )
                            }}
                          </Draggable>
                        )
                      })}
                      {provided.placeholder}
                    </div>
                  )
                }}
              </Droppable>
            </div>
          )
        })}
      </DragDropContext>
    </div >
  );
}

export default TodosApp;
