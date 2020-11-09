import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { v4 as uuid } from 'uuid'
import { Slide, Zoom, Flip, Bounce } from 'react-toastify'

toast.configure({
	position: toast.POSITION.BOTTOM_RIGHT,
	autoClose: 3000,
	pauseOnFocusLoss: false,
	toastId: uuid(),
	// transition: Slide,
	draggablePercent: 60,
})

export { toast }
