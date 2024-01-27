import {useState, useEffect} from "react"
import {useParams, Navigate, useNavigate, useLocation} from 'react-router-dom'
import Button from "./Button"


function TaskDetails() {

  const [loading, setLoading] = useState(true)
  const [task, setTask] = useState({})
  const [error, setError] = useState(null)

  const parms = useParams()
  const navigate = useNavigate()
  const {pathname} = useLocation()

  function pause(milliseconds) {
    var dt = new Date();
    while ( new Date() - dt <= milliseconds ) {}
  }

  useEffect(()=>{
    const fetchTask = async () => {
      setLoading(true)
      
      const res = await fetch(`http://localhost:5000/tasks/${parms.id}`)
      
      pause(200);

      if (res.status === 404){
        // setError('Task not found')
        navigate('/')
      }else{
        // console.log(data)
        const data = await res.json()
        setTask(data)
        setLoading(false)
      }

    }

    fetchTask()
  }, [])


  if (error){
    return <Navigate to='/' />
  }

  return loading 
    ? (<h3 
        style={{color:'green'}}
          >Loading..</h3>) 
    : (
        <div>
          <p>{pathname}</p>
          <h3>{task.text}</h3>
          <h4>{task.day}</h4>
          <Button 
            onClick={()=>{navigate(-1)}}
            text='Go Back'/>
        </div>
      )
}

export default TaskDetails
