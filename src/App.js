import {useState, useEffect} from 'react'
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import Tasks from './components/Tasks'
import AddTask from './components/AddTask'
import About from './components/About'
import TaskDetails from './components/TaskDetails'

function App() {
  
  const [showAddTask, setShowAddTask] = useState(false)
  const [tasks, setTasks] = useState([])


  useEffect(() => {
    const getTasks = async () => {
      const tasksFromServer = await fetchTasks()
      setTasks(tasksFromServer)
    }

    getTasks()
  }, [])

  //Fetch Tasks ----------------------------------
  const fetchTasks = async () => {
    const res = await fetch('http://localhost:5000/tasks')
    const data = await res.json()

    return data
  }

  //Fetch A Task ----------------------------------
  const fetchATask = async (id) => {
    const res = await fetch(`http://localhost:5000/tasks/${id}`)
    const data = await res.json()

    return data
  }


  //Add task ----------------------------------
  const addTask = async (task) => {
    // const id = Math.floor(Math.random()*10000)
    // setTasks([...tasks, {...task, id}])
    
    const res = await fetch('http://localhost:5000/tasks',{
      method: 'POST',
      headers: {'Content-type':
                'application/json'},
      body: JSON.stringify(task)
      
    })

    const data = await res.json()

    setTasks([...tasks, data])
  }


  //Delete task -------------------------------
  const deleteTask = async (id) => {
    await fetch(`http://localhost:5000/tasks/${id}`,
                 {method: 'DELETE'})

    setTasks( tasks.filter((task) => 
              (task.id!== id)) )
  }


  //Toggle reminder ---------------------------
  const toggleReminder = async (id) => {

    const taskToToggle = await fetchATask(id)
    const updatedTask = {...taskToToggle, 
                          reminder: !taskToToggle.reminder}
    
    const res = await fetch(`http://localhost:5000/tasks/${id}`,
      {method: 'PUT',
      headers: {'Content-type':
                  'application/json'},
      body: JSON.stringify(updatedTask)})

    setTasks( tasks.map((task) => 
              (task.id === id
                ? {...task, reminder: !(task.reminder)}
                : task
              )))
  }
  
  
  // RETURN-----------------------------------------
  return (
    <Router>
      <div 
        className="container">
        
        <Header 
          onAdd={() => 
            (setShowAddTask(!showAddTask))} 
          showAdd={showAddTask}
          />
        
        
        <Routes> 
          <Route path='/' element={
            <>
              {showAddTask && 
                <AddTask 
                  onAdd={addTask}/>}
            
              {tasks.length > 0 
                ? (<Tasks 
                      tasks={tasks} 
                      onDelete={deleteTask}
                      onToggle={toggleReminder}
                  />)
                : 'No tasks to show..'}
            </>} />

          <Route path='/about' element={<About />} />
          
          <Route path='/task/:id' element={<TaskDetails />} />

        </Routes> 

        <Footer/>
      
      </div>
    </Router>
  );
}

export default App;

