// src/App.jsx
import { AppRouter } from "./routes/AppRouter"; // <-- Importamos nuestro enrutador

function App() {
  return (
    // Esta etiqueta vacía <> es un "Fragment". Nos permite devolver
    // varios elementos sin necesidad de un <div> extra.
    <>
      <AppRouter /> {/* <-- Renderizamos las rutas que creamos */}
    </>
  )
}

export default App
